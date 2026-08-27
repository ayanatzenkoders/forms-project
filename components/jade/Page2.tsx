"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JadeFormData, UpdateSection } from "./types";
import { form2Schema, Form2Values } from "./schemas";
import FileUpload from "./FileUpload";
import FormShell from "@/components/ui/FormShell";
import FormActions from "@/components/ui/FormActions";
import SectionLabel from "@/components/ui/SectionLabel";
import TextField from "@/components/ui/TextField";

interface Props {
  nextPage: () => void;
  prevPage: () => void;
  //   keyType = Keyof Object; // extracts the properties. If object is defined as:
  //   interface User {
  //   id: number;
  //   name: string;
  //   email: string;
  // }
  // Then The value of: keyType = "id" | "name" | "email"
  updateSection: UpdateSection;
  formData: JadeFormData;
}

export default function JadePage2({
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
  } = useForm<Form2Values>({
    resolver: zodResolver(form2Schema),
    mode: "onBlur", // Show Field Errors when Move to Other fields
    // formData is already hydrated (see layout's JadeGate), so defaultValues is
    // reliable and no reset() effect is needed.
    defaultValues: {
      ...formData.education,
    },
  });

  // Store the uploaded path AND persist immediately, so a mid-page refresh
  // doesn't lose the file's path (it would otherwise save only on "Next").
  function handleUploaded(path: string) {
    setValue("certificatePath", path, { shouldValidate: true });
    updateSection("education", getValues());
  }

  const onSubmit = (data: Form2Values) => {
    updateSection("education", data);
    nextPage();
  };

  return (
    <FormShell
      onSubmit={handleSubmit(onSubmit)}
      title="Education Information"
      actions={<FormActions onBack={prevPage} nextLabel="Next" />}
    >
      <SectionLabel>Education details</SectionLabel>

      <TextField
        label="Institute Name"
        error={errors.instituteName?.message}
        {...register("instituteName")}
      />

      <TextField
        label="Degree"
        error={errors.degree?.message}
        {...register("degree")}
      />

      <TextField
        label="Field Of Study"
        error={errors.fieldOfStudy?.message}
        {...register("fieldOfStudy")}
      />

      {/* Two dates share a row, matching the design's paired fields */}
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
        label="Upload Your Certificate"
        folder="education-certificates"
        accept=".pdf,image/*"
        hint="(JPG, PNG, or PDF)"
        value={watch("certificatePath")}
        error={errors.certificatePath?.message}
        onUploaded={handleUploaded}
      />
    </FormShell>
  );
}
