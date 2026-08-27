"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { practitionerSubmissionSchema } from "@/components/practitioner/schemas"

// Same 9 MB guard as the Jade uploader: the browser `accept` attribute is only
// a hint, so the real size check must happen on the server.
const MAX_FILE_SIZE = 9 * 1024 * 1024;

/*
 * Uploads one practitioner file and returns its PATH STRING.
 *
 * Same lesson as the Jade form: a File cannot be stored in localStorage or sent
 * as JSON, but a path string survives every boundary. So we upload as soon as
 * the file is picked and carry only the returned path in form state.
 *
 * Files live in the existing "jade-files" bucket under a practitioner/ prefix,
 * so no new bucket setup is needed.
 */
export async function uploadPractitionerFile(formData: FormData) {
  const supabase = createSupabaseServerClient();

  const file = formData.get("file") as File | null;
  const folder = formData.get("folder") as string;

  if (!file || file.size === 0) throw new Error("No file provided");

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File is too large (max 9 MB)");
  }

  const extension = file.name.split(".").pop() || "file";
  const path = `practitioner/${folder}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from("jade-files")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    console.error(`Failed to upload ${folder}:`, error);
    throw new Error(`Failed to upload ${folder}`);
  }

  return path;
}

// Removes a replaced file so it doesn't linger unreferenced in the bucket.
export async function deletePractitionerFile(path: string) {
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.storage.from("jade-files").remove([path]);

  if (error) {
    // Never block the user's form on a failed cleanup.
    console.error("Failed to delete old file:", error);
  }
}



export async function submitPractitionerForm(input: unknown) {
  const supabase = createSupabaseServerClient();
  try {
    // ---- 1. Validate everything that arrived ----
    const parsed = practitionerSubmissionSchema.safeParse(input);

    if (!parsed.success) {
      console.error("Invalid practitioner submission:", parsed.error.issues);
      throw new Error("Some required information is missing or invalid.");
    }

    const data = parsed.data;

    // ---- 2. Insert one row ----
    // Files were already uploaded step-by-step, so only path STRINGS are here.
    const { data: profile, error } = await supabase
      .from("practitioner_profiles")
      .insert({
        // Step 1
        profile_image_path: data.ProfileInfo1.profileImagePath,
        dob: data.ProfileInfo1.dob,
        location: data.ProfileInfo1.location,
        therapist_gender_preference:
          data.ProfileInfo1.therapistGenderPreference,
        system_issues: data.ProfileInfo1.systemIssues,

        // Step 2 - array of {therapist, stars}, stored as JSON
        work_ratings: data.workratings.workratings,

        // Step 3
        body_issues: data.issues.issues,

        // Step 4
        diagnosed_with_cancer: data.cancerHistory.diagnosedWithCancer,
        cancer_location: data.cancerHistory.location,
        cancer_treatment: data.cancerHistory.treatment,
        additional_notes: data.cancerHistory.additionalNotes,

        // Step 5
        bsb_number: data.payment.bsbNumber,
        account_holder_name: data.payment.accountHolderName,
        account_number: data.payment.accountNumber,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create practitioner profile:", error);
      throw new Error("Failed to create practitioner profile");
    }

    // ---- 3. Done ----
    return { success: true, practitionerProfileId: profile.id };
  } catch (error) {
    console.error("SUBMIT PRACTITIONER ERROR:", error);

    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to submit practitioner form",
    );
  }
}