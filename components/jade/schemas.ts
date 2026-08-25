import { z } from "zod";

/*
 * ALL Jade form schemas live here, in ONE place with no "use client".
 *
 * Why they moved out of the Page components: a schema written inside a client
 * component can't be imported by a server action. Keeping them here means the
 * browser AND the server validate against the exact same rules — so there is
 * only one definition of "valid" that can never drift apart.
 */

// ---------- Page 1: Personal Information ----------
export const form1Schema = z.object({
  // Files upload on select, so we validate the returned PATH STRING.
  profileImagePath: z.string().min(1, "Please upload a profile image"),
  resumePath: z.string().min(1, "Resume document is required"),
  // Age is a whole number - you can't be 29.2 years old on a form like this.
  age: z
    .number({ error: "Age is required" })
    .int("Age must be a whole number")
    .min(1, "Enter a valid age")
    .max(120, "Enter a valid age"),
  gender: z.string().min(1, "Select gender"),
  religion: z.string().min(1, "Religion required"),
  race: z.string().min(1, "Race required"),
  // Decimals ARE allowed here so "6 months" can be entered as 0.5.
  yearsExperience: z
    .number({ error: "Experience is required" })
    .min(0, "Experience can't be negative")
    .max(80, "Enter a valid number of years"),
  favouriteQuote: z.string().min(1, "Quote required"),
  hobbies: z.array(z.string()).min(1, "Select at least one hobby"),
  country: z.string().min(1, "Country required"),
  state: z.string().min(1, "State required"),
  address: z.string().min(1, "Address required"),
});

// ---------- Page 2: Education ----------
export const form2Schema = z.object({
  instituteName: z.string().min(1, "Institute name required"),
  degree: z.string().min(1, "Degree required"),
  fieldOfStudy: z.string().min(1, "Field of study required"),
  startDate: z.string().min(1, "Start date required"),
  endDate: z.string().min(1, "End date required"),
  certificatePath: z.string().min(1, "Please upload your certificate"),
});

// ---------- Page 3: Professional ----------
export const form3Schema = z
  .object({
    companyName: z.string().min(1, "Company name is required"),
    jobTitle: z.string().min(1, "Job title is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    certificatePath: z.string().min(1, "Experience certificate is required"),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date should be after Start Date",
    path: ["endDate"],
  });

// ---------- Page 4: Specialization ----------
export const form4Schema = z.object({
  specializations: z
    .array(z.string())
    .min(1, "Select at least one specialization"),
});

// ---------- Page 5: License ----------
export const form5Schema = z.object({
  state: z.string().min(1, "State is required"),
  npiNumber: z.string().regex(/^\d{10}$/, "NPI must be 10 digits"),
  licenseFilePath: z.string().min(1, "License upload is required"),
  liabilityInsuranceFilePath: z
    .string()
    .min(1, "Liability insurance upload is required"),
});

// ---------- Page 6: Availability ----------
export const form6Schema = z
  .object({
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

// ---------- Page 7: Banking ----------
export const form7Schema = z.object({
  bankName: z.string().min(1, "Please select a bank"),
  accountTitle: z.string().min(1, "Account title is required"),
  accountNumber: z.string().min(1, "Account number / IBAN is required"),
});

/*
 * The WHOLE form, all 7 sections required and complete.
 * The server action parses incoming data with this before touching the
 * database, so a half-filled or hand-crafted request is rejected.
 */
export const jadeSubmissionSchema = z.object({
  personalInformation: form1Schema,
  education: form2Schema,
  professional: form3Schema,
  specialization: form4Schema,
  license: form5Schema,
  availability: form6Schema,
  banking: form7Schema,
});

export type Form1Values = z.infer<typeof form1Schema>;
export type Form2Values = z.infer<typeof form2Schema>;
export type Form3Values = z.infer<typeof form3Schema>;
export type Form4Values = z.infer<typeof form4Schema>;
export type Form5Values = z.infer<typeof form5Schema>;
export type Form6Values = z.infer<typeof form6Schema>;
export type Form7Values = z.infer<typeof form7Schema>;
