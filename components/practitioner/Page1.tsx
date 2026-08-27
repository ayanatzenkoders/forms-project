"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PractitionerFormData, UpdatePractitionerSection } from "./types";
import { page1Schema, Page1Values, SYSTEM_ISSUES } from "./schemas";
import ProfileShell from "@/components/ui/practitioner/ProfileShell";
import SectionHeading from "@/components/ui/practitioner/SectionHeading";
import FieldLabel from "@/components/ui/practitioner/FieldLabel";
import TextInput from "@/components/ui/practitioner/TextInput";
import RadioGroup from "@/components/ui/practitioner/RadioGroup";
import CheckboxChips from "@/components/ui/practitioner/CheckboxChips";
import UploadBox from "@/components/ui/practitioner/UploadBox";

export const TOTAL_STEPS = 5;

interface Props {
  nextPage: () => void;
  updateSection: UpdatePractitionerSection;
  formData: PractitionerFormData;
}

export default function Page1({ nextPage, updateSection, formData }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm<Page1Values>({
    resolver: zodResolver(page1Schema),
    // The layout gate waits for hydration, so formData is already the saved
    // draft here and defaultValues is reliable on first render.
    defaultValues: {
      systemIssues: [],
      ...formData.ProfileInfo1,
    },
  });

  // Needed only to style the chips; RHF still owns the real value.
  const selectedIssues = watch("systemIssues") ?? [];

  // Store the uploaded path AND persist immediately, so a mid-page refresh
  // doesn't lose it (it would otherwise only save on Continue).
  function handleUploaded(path: string) {
    setValue("profileImagePath", path, { shouldValidate: true });
    updateSection("ProfileInfo1", getValues());
  }

  const onSubmit = (data: Page1Values) => {
    updateSection("ProfileInfo1", data);
    nextPage();
  };

  return (
    <ProfileShell
      step={1}
      totalSteps={TOTAL_STEPS}
      onSubmit={handleSubmit(onSubmit)}
    >
      <SectionHeading>Personal Details</SectionHeading>

      <div>
        <FieldLabel required>Upload Profile Image</FieldLabel>
        <UploadBox
          folder="profile-images"
          accept="image/*,.pdf"
          value={watch("profileImagePath")}
          error={errors.profileImagePath?.message}
          onUploaded={handleUploaded}
        />
      </div>

      {/* Date of Birth + Location share a row, as in the design */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextInput
          label="Date of Birth"
          required
          type="date"
          error={errors.dob?.message}
          {...register("dob")}
        />
        <TextInput
          label="Location"
          required
          placeholder="Enter Location"
          error={errors.location?.message}
          {...register("location")}
        />
      </div>

      <div>
        <FieldLabel required size="lg">
          Do you have a preference in gender for your therapist?
        </FieldLabel>
        <RadioGroup
          options={["Male", "Female", "Both"]}
          registration={register("therapistGenderPreference")}
          error={errors.therapistGenderPreference?.message}
        />
      </div>

      <div>
        <FieldLabel required size="lg">
          System Issues
        </FieldLabel>
        <CheckboxChips
          options={SYSTEM_ISSUES}
          registration={register("systemIssues")}
          selected={selectedIssues}
          error={errors.systemIssues?.message}
        />
      </div>
    </ProfileShell>
  );
}
