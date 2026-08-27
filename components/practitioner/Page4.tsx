"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PractitionerFormData, UpdatePractitionerSection } from "./types";
import { page4Schema, Page4Values, TREATMENTS } from "./schemas";
import ProfileShell from "@/components/ui/practitioner/ProfileShell";
import FieldLabel from "@/components/ui/practitioner/FieldLabel";
import TextInput from "@/components/ui/practitioner/TextInput";
import TextArea from "@/components/ui/practitioner/TextArea";
import RadioGroup from "@/components/ui/practitioner/RadioGroup";
import { TOTAL_STEPS } from "./Page1";

interface Props {
  nextPage: () => void;
  prevPage: () => void;
  updateSection: UpdatePractitionerSection;
  formData: PractitionerFormData;
}

export default function Page4({
  nextPage,
  prevPage,
  updateSection,
  formData,
}: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Page4Values>({
    resolver: zodResolver(page4Schema),
    defaultValues: {
      diagnosedWithCancer: "",
      location: "",
      treatment: "",
      additionalNotes: "",
      ...formData.cancerHistory,
    },
  });

  // Conditional UI: the follow-up questions only apply to a "Yes" answer.
  // watch() makes this component re-render when the radio changes.
  const answeredYes = watch("diagnosedWithCancer") === "Yes";

  const onSubmit = (data: Page4Values) => {
    updateSection("cancerHistory", data);
    nextPage();
  };

  return (
    <ProfileShell
      step={4}
      totalSteps={TOTAL_STEPS}
      onSubmit={handleSubmit(onSubmit)}
      onBack={prevPage}
    >
      <div>
        <FieldLabel required size="lg">
          Have You Ever Been Diagnosed With Cancer?
        </FieldLabel>
        <RadioGroup
          options={["Yes", "No"]}
          columns={2}
          registration={register("diagnosedWithCancer")}
          error={errors.diagnosedWithCancer?.message}
        />
      </div>

      {/* Everything below only shows once the answer is Yes */}
      {answeredYes && (
        <>
          <div>
            <FieldLabel required size="lg">
              Location
            </FieldLabel>
            <TextInput
              label="Location"
              placeholder="Enter Location"
              error={errors.location?.message}
              {...register("location")}
            />
          </div>

          <div>
            <FieldLabel required size="lg">
              Specify Treatment
            </FieldLabel>
            <RadioGroup
              options={TREATMENTS}
              columns={2}
              registration={register("treatment")}
              error={errors.treatment?.message}
            />
          </div>
        </>
      )}

      <TextArea
        label="Anything else you wish to let us know"
        placeholder="Write Something"
        error={errors.additionalNotes?.message}
        {...register("additionalNotes")}
      />
    </ProfileShell>
  );
}
