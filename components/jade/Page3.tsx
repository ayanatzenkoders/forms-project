"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JadeFormData, UpdateSection } from "./types";
import { form3Schema, Form3Values } from "./schemas";
import FileUpload from "./FileUpload";
import FormShell from "@/components/ui/FormShell";
import FormActions from "@/components/ui/FormActions";
import SectionLabel from "@/components/ui/SectionLabel";
import TextField from "@/components/ui/TextField";

interface Props {
  prevPage: () => void;
  nextPage: () => void;
  updateSection: UpdateSection;
  formData: JadeFormData;
}

export default function JadePage3({
  nextPage,
  prevPage,
  updateSection,
  formData,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm<Form3Values>({
    resolver: zodResolver(form3Schema),
    mode: "onBlur",
    // Hydrated by the layout gate, so defaultValues is reliable (no reset effect).
    defaultValues: {
      ...formData.professional,
    },
  });

  // Store the uploaded path AND persist immediately (survives a mid-page refresh).
  function handleUploaded(path: string) {
    setValue("certificatePath", path, { shouldValidate: true });
    updateSection("professional", getValues());
  }

  const onSubmit = (data: Form3Values) => {
    updateSection("professional", data);
    nextPage();
  };

  return (
    <FormShell
      onSubmit={handleSubmit(onSubmit)}
      title="Professional Information"
      actions={<FormActions onBack={prevPage} nextLabel="Next" />}
    >
      <SectionLabel>Experience details</SectionLabel>

      <TextField
        label="Company Name"
        error={errors.companyName?.message}
        {...register("companyName")}
      />

      <TextField
        label="Job Title"
        error={errors.jobTitle?.message}
        {...register("jobTitle")}
      />

      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="Start Date"
          type="date"
          error={errors.startDate?.message}
          {...register("startDate")}
        />
        <TextField
          label="End Date"
          type="date"
          error={errors.endDate?.message}
          {...register("endDate")}
        />
      </div>

      <FileUpload
        label="Upload Experience Certificate"
        folder="experience-certificates"
        accept=".pdf,image/*"
        hint="(JPG, PNG, or PDF)"
        value={watch("certificatePath")}
        error={errors.certificatePath?.message}
        onUploaded={handleUploaded}
      />
    </FormShell>
  );
}
