"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JadeFormData, UpdateSection } from "./types";
import { form5Schema, Form5Values } from "./schemas";
import FileUpload from "./FileUpload";
import FormShell from "@/components/ui/FormShell";
import FormActions from "@/components/ui/FormActions";
import SectionLabel from "@/components/ui/SectionLabel";
import TextField from "@/components/ui/TextField";
import SelectField from "@/components/ui/SelectField";

interface Props {
  prevPage: () => void;
  nextPage: () => void;
  updateSection: UpdateSection;
  formData: JadeFormData;
}

export default function JadePage5({
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
  } = useForm<Form5Values>({
    resolver: zodResolver(form5Schema),
    // Hydrated by the layout gate, so defaultValues is reliable (no reset effect).
    defaultValues: {
      ...formData.license,
    },
  });

  // Store the uploaded path AND persist immediately (survives a mid-page refresh).
  function handleUploaded(
    field: "licenseFilePath" | "liabilityInsuranceFilePath",
    path: string,
  ) {
    setValue(field, path, { shouldValidate: true });
    updateSection("license", getValues());
  }

  const onSubmit = (data: Form5Values) => {
    updateSection("license", data);
    nextPage();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormShell
        title="License"
        actions={<FormActions onBack={prevPage} nextLabel="Next" />}
      >
        <SectionLabel>License details</SectionLabel>

        <SelectField
          label="State"
          error={errors.state?.message}
          {...register("state")}
        >
          <option value="">Select State</option>
          <option value="SD">Sindh</option>
          <option value="PJ">Punjab</option>
          <option value="BL">Balochistan</option>
          <option value="KPK">KPK</option>
          <option value="Gil">Gilgit</option>
          <option value="JK">Jammu Kashmir</option>
        </SelectField>

        <TextField
          label="NPI Number"
          placeholder="10-digit NPI"
          error={errors.npiNumber?.message}
          {...register("npiNumber")}
        />

        <FileUpload
          label="Upload License (LCSW, LMFT, LPC, PsyD)"
          folder="licenses"
          accept=".pdf,.doc,.docx,image/*"
          hint="(JPG, PNG, or PDF)"
          value={watch("licenseFilePath")}
          error={errors.licenseFilePath?.message}
          onUploaded={(path) => handleUploaded("licenseFilePath", path)}
        />

        <FileUpload
          label="Upload Liability Insurance"
          folder="liability-insurance"
          accept=".jpeg,.png,.pdf"
          hint="(JPEG, PNG, or PDF)"
          value={watch("liabilityInsuranceFilePath")}
          error={errors.liabilityInsuranceFilePath?.message}
          onUploaded={(path) =>
            handleUploaded("liabilityInsuranceFilePath", path)
          }
        />
      </FormShell>
    </form>
  );
}
