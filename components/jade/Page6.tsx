"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JadeFormData, UpdateSection } from "./types";
import { form6Schema, Form6Values } from "./schemas";
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

export default function JadePage6({
  nextPage,
  prevPage,
  updateSection,
  formData,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form6Values>({
    resolver: zodResolver(form6Schema),
    // Hydrated by the layout gate, so defaultValues is reliable (no reset effect).
    defaultValues: {
      ...formData.availability,
    },
  });

  const onSubmit = (data: Form6Values) => {
    updateSection("availability", data);
    nextPage();
  };

  return (
    <FormShell
      onSubmit={handleSubmit(onSubmit)}
      title="Your Available Timings"
      actions={<FormActions onBack={prevPage} nextLabel="Next" />}
    >
      <SectionLabel>Working hours</SectionLabel>

      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="Start Time"
          type="time"
          error={errors.startTime?.message}
          {...register("startTime")}
        />
        <TextField
          label="End Time"
          type="time"
          error={errors.endTime?.message}
          {...register("endTime")}
        />
      </div>
    </FormShell>
  );
}
