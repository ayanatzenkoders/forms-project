"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { jadeSubmissionSchema } from "@/components/jade/schemas";

export async function createJadeCategory(name: string) {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("categories")
    .insert({
      category_type: "hobby",
      name,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating hobby:", error);
    throw new Error("Failed to create hobby");
  }

  return data;
}

export async function getJadeCategories() {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("category_type", "hobby")
    .order("name");

  if (error) {
    console.error("Error fetching hobbies:", error);
    throw new Error("Failed to fetch hobbies");
  }

  return data;
}

// Max upload size. The DB/bucket limit is 10 MB, so we stop a bit below that so
// the friendly error fires here instead of a raw storage rejection.
const MAX_FILE_SIZE = 9 * 1024 * 1024; // 9 MB in bytes

export async function uploadJadeFile(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const file = formData.get("file") as File | null;
  const folder = formData.get("folder") as string;

  if (!file || file.size === 0) throw new Error("No file provided");

  // The browser `accept` attribute is only a hint and is easy to bypass, so the
  // real size check has to live on the server — this is the actual gate.
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File is too large (max 9 MB)");
  }

  const extension = file.name.split(".").pop() || "file";
  const path = `jade/${folder}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from("jade-files")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(`Failed to upload ${folder}`);
  return path; // <-- a string, safe for context + localStorage
}

// Removes a file from the bucket. Used when a user replaces an already-uploaded
// file, so the old one doesn't linger unreferenced (see "orphan files").
export async function deleteJadeFile(path: string) {
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.storage.from("jade-files").remove([path]);

  if (error) {
    // Don't throw — a failed cleanup shouldn't block the user's form.
    console.error("Failed to delete old file:", error);
  }
}

export async function submitJadeForm(input: unknown) {
  const supabase = createSupabaseServerClient();

  try {
    // --------------------------------
    // 0. VALIDATE what arrived
    // --------------------------------
    // The parameter is `unknown`, not JadeFormData, on purpose: a TypeScript
    // type is only a compile-time promise and disappears at runtime. This
    // action is a public HTTP endpoint, so anyone can POST any shape to it.
    // parse() is the runtime check that actually enforces the rules — and it
    // uses the SAME schemas the browser used, so nothing can drift.
    const parsed = jadeSubmissionSchema.safeParse(input);

    if (!parsed.success) {
      console.error("Invalid Jade submission:", parsed.error.issues);
      throw new Error("Some required information is missing or invalid.");
    }

    // From here on, `data` is guaranteed complete and correctly typed.
    const data = parsed.data;

    // Every file was already uploaded (on the page where it was picked) and
    // now lives inside `data` as a plain PATH STRING. So there is nothing to
    // upload here anymore — we just write those strings straight into the row.

    // --------------------------------
    // 1. Insert Jade profile
    // --------------------------------

    const { data: jadeProfile, error: jadeError } =
      await supabase
        .from("jade_profiles")
        .insert({
          // Page 1
          profile_image_path: data.personalInformation.profileImagePath,
          resume_path: data.personalInformation.resumePath,
          age: data.personalInformation.age,
          gender: data.personalInformation.gender,
          religion: data.personalInformation.religion,
          race: data.personalInformation.race,
          years_experience:
            data.personalInformation.yearsExperience,
          favourite_quote:
            data.personalInformation.favouriteQuote,
          country: data.personalInformation.country,
          state: data.personalInformation.state,
          address: data.personalInformation.address,

          // Page 2
          institute_name: data.education.instituteName,
          degree: data.education.degree,
          field_of_study: data.education.fieldOfStudy,
          education_start_date: data.education.startDate,
          education_end_date: data.education.endDate,
          education_certificate_path: data.education.certificatePath,

          // Page 3
          company_name: data.professional.companyName,
          job_title: data.professional.jobTitle,
          professional_start_date:
            data.professional.startDate,
          professional_end_date:
            data.professional.endDate,
          experience_certificate_path: data.professional.certificatePath,

          // Page 5
          license_state: data.license.state,
          npi_number: data.license.npiNumber,
          license_file_path: data.license.licenseFilePath,
          liability_insurance_file_path:
            data.license.liabilityInsuranceFilePath,

          // Page 6
          availability_start_time:
            data.availability.startTime,
          availability_end_time:
            data.availability.endTime,

          // Page 7
          bank_name: data.banking.bankName,
          account_title: data.banking.accountTitle,
          account_number: data.banking.accountNumber,
        })
        .select()
        .single();

    if (jadeError) {
      console.error("Failed to create Jade profile:", jadeError);
      throw new Error("Failed to create Jade profile");
    }

   // --------------------------------
// 5. Insert category relationships
// --------------------------------

const hobbyNames: string[] =
  data.personalInformation.hobbies ?? [];

const specializationNames: string[] =
  data.specialization.specializations ?? [];

const relations: {
  jade_profile_id: string;
  category_id: string;
}[] = [];

// Hobbies
if (hobbyNames.length > 0) {
  const { data: hobbyCategories, error } =
    await supabase
      .from("categories")
      .select("id, name")
      .eq("category_type", "hobby")
      .in("name", hobbyNames);

  if (error) {
    throw new Error("Failed to find hobby categories");
  }

  for (const category of hobbyCategories) {
    relations.push({
      jade_profile_id: jadeProfile.id,
      category_id: category.id,
    });
  }
}

// Specializations
if (specializationNames.length > 0) {
  const { data: specializationCategories, error } =
    await supabase
      .from("categories")
      .select("id, name")
      .eq("category_type", "specialization")
      .in("name", specializationNames);

  if (error) {
    throw new Error(
      "Failed to find specialization categories",
    );
  }

  for (const category of specializationCategories) {
    relations.push({
      jade_profile_id: jadeProfile.id,
      category_id: category.id,
    });
  }
}

// Insert junction records
if (relations.length > 0) {
  const { error } = await supabase
    .from("jade_profile_categories")
    .insert(relations);

  if (error) {
    console.error("Junction insert failed:", error);
    throw new Error(
      "Failed to save Jade categories",
    );
  }
}

    // --------------------------------
    // 6. Everything succeeded
    // --------------------------------

    return {
      success: true,
      jadeProfileId: jadeProfile.id,
    };
  } catch (error) {
    console.error("SUBMIT JADE ERROR:", error);

    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to submit Jade form",
    );
  }
}