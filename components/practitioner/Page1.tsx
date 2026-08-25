"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PractitionerFormData } from "./types";

interface Props {
  nextPage: () => void;
  updateSection: (section: keyof PractitionerFormData, data: any) => void;
  formData: PractitionerFormData;
}

const SYSTEM_ISSUES = [
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

const page1Schema = z.object({
  profileImage: z
    .any()
    .refine((files) => files?.length > 0, "Image is required"),
  dob: z.string().min(1, "Date of birth required"),
  location: z.string().min(1, "Location required"),
  therapistGenderPreference: z.string().min(1, "Select gender preference"),
  systemIssues: z.array(z.string()).min(1, "Select at least one issue"),
});

export type Page1Values = z.infer<typeof page1Schema>;

export default function Page1({ nextPage, updateSection, formData }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Page1Values>({
    resolver: zodResolver(page1Schema),
    defaultValues: {
      systemIssues: [],
      ...formData?.ProfileInfo1,
    },
  });

  const onSubmit = (data: Page1Values) => {
    updateSection("ProfileInfo1", data);
    nextPage();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-lg mx-auto p-4 space-y-4 border rounded"
    >
      <h2 className="text-xl font-bold">Personal Details</h2>

      {/* Profile Image */}
      <div>
        <label className="block text-sm font-medium">
          Upload Profile Image
        </label>
        <input type="file" accept="image/*" {...register("profileImage")} />
        {errors.profileImage && (
          <p className="text-red-500 text-xs">
            {errors.profileImage.message as string}
          </p>
        )}
      </div>

      {/* Date of Birth */}
      <div>
        <label className="block text-sm font-medium">Date of Birth</label>
        <input
          type="date"
          {...register("dob")}
          className="border p-2 w-full rounded"
        />
        {errors.dob && (
          <p className="text-red-500 text-xs">{errors.dob.message}</p>
        )}
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium">Location</label>
        <input
          type="text"
          placeholder="Enter Location"
          {...register("location")}
          className="border p-2 w-full rounded"
        />
        {errors.location && (
          <p className="text-red-500 text-xs">{errors.location.message}</p>
        )}
      </div>

      {/* Gender Preference */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Do you have a preference in gender for your therapist?
        </label>
        <div className="flex gap-4">
          {["Male", "Female", "Both"].map((gender) => (
            <label key={gender} className="flex items-center gap-1">
              <input
                type="radio"
                value={gender}
                {...register("therapistGenderPreference")}
              />
              {gender}
            </label>
          ))}
        </div>
        {errors.therapistGenderPreference && (
          <p className="text-red-500 text-xs">
            {errors.therapistGenderPreference.message}
          </p>
        )}
      </div>

      {/* System Issues Checkboxes (Simple Array Binding) */}
      <div>
        <label className="block text-sm font-medium mb-1">System Issues</label>
        <div className="flex flex-wrap gap-3">
          {SYSTEM_ISSUES.map((item) => (
            <label
              key={item}
              className="flex items-center gap-1 text-sm border p-1.5 rounded"
            >
              <input
                type="checkbox"
                value={item}
                {...register("systemIssues")}
              />
              {item}
            </label>
          ))}
        </div>
        {errors.systemIssues && (
          <p className="text-red-500 text-xs mt-1">
            {errors.systemIssues.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="bg-slate-800 text-white px-6 py-2 rounded"
      >
        Continue
      </button>
    </form>
  );
}
