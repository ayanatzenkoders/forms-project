"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { milcoachSubmissionSchema } from "@/components/milcoach/schemas";

// Resume limit from the design: "up to 5MB".
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/*
 * Uploads the resume and returns its PATH STRING.
 * Same rule as the other two forms: a File cannot survive localStorage or JSON,
 * but a path string can - so we upload on select and carry only the path.
 */
export async function uploadMilCoachFile(formData: FormData) {
  const supabase = createSupabaseServerClient();

  const file = formData.get("file") as File | null;
  const folder = formData.get("folder") as string;

  if (!file || file.size === 0) throw new Error("No file provided");

  // The browser `accept` attribute is only a hint, so the real check is here.
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File is too large (max 5 MB)");
  }

  const extension = file.name.split(".").pop() || "file";
  const path = `milcoach/${folder}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from("jade-files")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    console.error(`Failed to upload ${folder}:`, error);
    throw new Error(`Failed to upload ${folder}`);
  }

  return path;
}

export async function deleteMilCoachFile(path: string) {
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.storage.from("jade-files").remove([path]);

  // A failed cleanup must never block the user's form.
  if (error) console.error("Failed to delete old file:", error);
}

/*
 * Saves a completed MilCoach profile.
 * `input` is `unknown` because types vanish at runtime and this action is a
 * public endpoint - safeParse is the real gate.
 */
export async function submitMilCoachForm(input: unknown) {
  const supabase = createSupabaseServerClient();

  try {
    const parsed = milcoachSubmissionSchema.safeParse(input);

    if (!parsed.success) {
      console.error("Invalid MilCoach submission:", parsed.error.issues);
      throw new Error("Some required information is missing or invalid.");
    }

    const data = parsed.data;

    const { data: profile, error } = await supabase
      .from("milcoach_profiles")
      .insert({
        // Step 1
        resume_path: data.personalDetails.resumePath,
        name: data.personalDetails.name,
        // Empty string -> null, otherwise a real number for the int column.
        age: data.personalDetails.age ? Number(data.personalDetails.age) : null,
        branch_of_service: data.personalDetails.branchOfService,
        languages: data.personalDetails.languages,
        rank: data.personalDetails.rank,

        // Step 2 - arrays of objects are stored as JSON
        work_experience: data.workExperience.experiences,
        industry_of_interest: data.workExperience.industryOfInterest,
        job_position_of_interest: data.workExperience.jobPositionOfInterest,
        job_position_level: data.workExperience.jobPositionLevel,
        aspiration_location: data.workExperience.location,

        // Step 3
        education: data.education.educations,
        certificates: data.education.certificates,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create MilCoach profile:", error);
      throw new Error("Failed to create MilCoach profile");
    }

    return { success: true, milcoachProfileId: profile.id };
  } catch (error) {
    console.error("SUBMIT MILCOACH ERROR:", error);

    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to submit MilCoach form",
    );
  }
}
