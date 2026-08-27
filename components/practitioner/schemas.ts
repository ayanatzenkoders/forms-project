import { z } from "zod";

/*
 * All practitioner schemas in ONE place (no "use client"), so both the pages
 * and any future server action can validate against the same rules.
 */

export const SYSTEM_ISSUES = [
  "Hypertension",
  "Hypotension",
  "Diabetes 1 or 2",
  "Hyperthyroidism",
  "Hypothyroidism",
  "Autoimmune condition (rheumatoid arthritis, lupus etc)",
  "Kidney diseases",
  "Liver diseases",
  "Respiratory diseases (asthma, COPD etc)",
  "Heart diseases",
  "History of strokes or transient ischemic attacks (TIA), HIV, Hep A B C",
  "Parkinson's disease",
  "Multiple sclerosis",
  "Genetic disorder",
];

export const THERAPISTS = [
  "Physiotherapist",
  "Chiropractor",
  "Osteopath",
  "Myotherapist",
  "Remedial Massage Therapist",
  "Acupuncturist/TCM Doctor",
];

export const TREATMENTS = [
  "Chemotherapy & Radiation",
  "Radiation",
  "Chemotherapy",
  "Removal Of Cancer With Course Of Chemo & Radiation, Natural)",
];

// ---------- Step 1: Personal Details ----------
export const page1Schema = z.object({
  // Uploaded on select -> we keep the returned path string, not the File.
  profileImagePath: z.string().min(1, "Profile image is required"),
  dob: z.string().min(1, "Date of birth is required"),
  location: z.string().min(1, "Location is required"),
  therapistGenderPreference: z.string().min(1, "Select a preference"),
  systemIssues: z.array(z.string()).min(1, "Select at least one issue"),
});

// ---------- Step 2: Ratings of past treatments ----------
export const page2Schema = z.object({
  workratings: z
    .array(
      z.object({
        therapist: z.string(),
        stars: z.number().min(0).max(5),
      }),
    )
    // At least one therapist must actually be rated.
    .refine((rows) => rows.some((r) => r.stars > 0), {
      message: "Rate at least one of the above",
    }),
});

// ---------- Step 3: Body areas ----------
export const BODY_ISSUES = [
  "Head and Neck Issues",
  "Torso Issues",
  "Pelvis Issues",
  "Arms Issues",
  "Legs Issues",
];

export const page3Schema = z.object({
  // One array field fed by all five checkboxes.
  issues: z.array(z.string()).min(1, "Select at least one issue"),
});

// ---------- Step 4: Cancer history ----------
export const page4Schema = z
  .object({
    diagnosedWithCancer: z.string().min(1, "Please choose Yes or No"),
    location: z.string(),
    treatment: z.string(),
    additionalNotes: z.string(),
  })
  // Location + treatment only matter when the answer is "Yes".
  .refine(
    (data) => data.diagnosedWithCancer !== "Yes" || data.location.length > 0,
    { message: "Location is required", path: ["location"] },
  )
  .refine(
    (data) => data.diagnosedWithCancer !== "Yes" || data.treatment.length > 0,
    { message: "Select a treatment", path: ["treatment"] },
  );

// ---------- Step 5: Payment details ----------
export const page5Schema = z.object({
  // Australian BSB: 6 digits, optionally written as 123-456.
  bsbNumber: z
    .string()
    .min(1, "BSB number is required")
    .regex(/^\d{3}-?\d{3}$/, "BSB must be 6 digits (e.g. 123-456)"),
  accountHolderName: z.string().min(1, "Account holder name is required"),
  accountNumber: z.string().min(1, "Account number / IBAN is required"),
});

export type Page1Values = z.infer<typeof page1Schema>;
export type Page2Values = z.infer<typeof page2Schema>;
export type Page3Values = z.infer<typeof page3Schema>;
export type Page4Values = z.infer<typeof page4Schema>;
export type Page5Values = z.infer<typeof page5Schema>;

/*
 * The WHOLE practitioner form: all 5 sections, all required and complete.
 *
 * The server action parses incoming data with this before touching the
 * database. A TypeScript type is erased at runtime, and a server action is a
 * public HTTP endpoint, so this parse is the ONLY thing actually stopping a
 * half-filled or hand-crafted request.
 */
export const practitionerSubmissionSchema = z.object({
  ProfileInfo1: page1Schema,
  workratings: page2Schema,
  issues: page3Schema,
  cancerHistory: page4Schema,
  payment: page5Schema,
});
