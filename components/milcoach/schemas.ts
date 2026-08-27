import { z } from "zod";

/*
 * All MilCoach schemas in ONE place (no "use client"), so the pages and the
 * server action validate against exactly the same rules.
 */

export const BRANCHES = [
  "Army",
  "Navy",
  "Air Force",
  "Marine Corps",
  "Coast Guard",
  "Space Force",
];

export const LANGUAGES = [
  "English",
  "French",
  "Spanish",
  "German",
  "Arabic",
  "Urdu",
  "Mandarin",
];

export const RANKS = [
  "Enlisted",
  "Non-Commissioned Officer",
  "Warrant Officer",
  "Commissioned Officer",
  "Senior Officer",
];

export const EDUCATION_LEVELS = [
  "High School",
  "Associates",
  "Bachelors",
  "Masters",
  "Doctorate",
];

export const POSITION_LEVELS = [
  "Entry Level",
  "Mid Level",
  "Senior Level",
  "Executive",
];

// ---------- Step 1: Personal Details ----------
export const page1Schema = z.object({
  // Optional: the user may fill the form manually instead of uploading.
  resumePath: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  // Age is optional, so an empty box must pass. Kept as a STRING here (that is
  // what an <input> always gives us) and converted to a number in the server
  // action - mixing string and number in one schema breaks type inference.
  age: z
    .string()
    .regex(/^\d*$/, "Age must be a number")
    // Empty is fine (optional), but a filled value must be a sensible age.
    .refine((v) => !v || (Number(v) >= 17 && Number(v) <= 80), {
      message: "Age must be between 17 and 80",
    })
    .optional(),
  branchOfService: z.string().min(1, "Branch of service is required"),
  languages: z.array(z.string()).min(1, "Select at least one language"),
  rank: z.string().min(1, "Rank is required"),
});

// ---------- Step 2: Work Experience ----------
// One row of the work-experience table.
export const experienceSchema = z.object({
  careerField: z.string().min(1, "Career field is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  // Must be digits: a plain z.string() happily accepted "abc" before.
  years: z
    .string()
    .min(1, "Years is required")
    .regex(/^\d{1,2}$/, "Years must be a number (0-99)"),
  skills: z.array(z.string()),
});

export const page2Schema = z.object({
  // Allowed to be empty because this step has a SKIP link.
  experiences: z.array(experienceSchema),
  industryOfInterest: z.string(),
  jobPositionOfInterest: z.string(),
  jobPositionLevel: z.string(),
  location: z.string(),
});

// ---------- Step 3: Education ----------
export const educationSchema = z.object({
  level: z.string().min(1, "Level of education is required"),
  institution: z.string().min(1, "Institution is required"),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  associates: z.string().min(1, "Associates is required"),
});

export const certificateSchema = z.object({
  name: z.string().min(1, "Certificate name is required"),
});

export const page3Schema = z.object({
  // Both allowed to be empty - this step has a SKIP link too.
  educations: z.array(educationSchema),
  certificates: z.array(certificateSchema),
});

/*
 * The WHOLE form. The server action parses with this before inserting, because
 * TypeScript types are erased at runtime and a server action is a public HTTP
 * endpoint that anyone can post to.
 */
export const milcoachSubmissionSchema = z.object({
  personalDetails: page1Schema,
  workExperience: page2Schema,
  education: page3Schema,
});

export type Page1Values = z.infer<typeof page1Schema>;
export type Page2Values = z.infer<typeof page2Schema>;
export type Page3Values = z.infer<typeof page3Schema>;
export type ExperienceValues = z.infer<typeof experienceSchema>;
export type EducationValues = z.infer<typeof educationSchema>;
export type CertificateValues = z.infer<typeof certificateSchema>;
