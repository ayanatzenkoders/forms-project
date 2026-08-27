"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JadeFormData, UpdateSection } from "./types";
import { form4Schema, Form4Values } from "./schemas";
import FormShell from "@/components/ui/FormShell";
import FormActions from "@/components/ui/FormActions";
import CheckboxGroup from "@/components/ui/CheckboxGroup";

interface Props {
  prevPage: () => void;
  nextPage: () => void;
  updateSection: UpdateSection;
  formData: JadeFormData;
}

const SPECIALIZATIONS = [
  "Depression",
  "Anxiety",
  "Behavior Change",
  "Family Therapy",
  "Sleeping Difficulty",
  "Grief",
  "PTSD",
  "Loneliness",
  "Job Change",
  "Retirement",
  "Companionship",
  "Purpose/Meaning",
  "Declining Health",
  "Declining Mortality",
  "Other",
];

export default function JadePage4({
  nextPage,
  prevPage,
  updateSection,
  formData,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form4Values>({
    resolver: zodResolver(form4Schema),
    // Hydrated by the layout gate, so defaultValues is reliable (no reset effect).
    defaultValues: {
      specializations: formData.specialization?.specializations || [], // Form ke andr specialization Array
    },
  });

  const onSubmit = (data: Form4Values) => {
    updateSection("specialization", data);
    nextPage();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormShell
        title="Select Specialization"
        actions={<FormActions onBack={prevPage} nextLabel="Next" />}
      >
        <CheckboxGroup
          label="Choose everything you specialise in"
          options={SPECIALIZATIONS}
          registration={register("specializations")}
          error={errors.specializations?.message}
        />
      </FormShell>
    </form>
  );
}
