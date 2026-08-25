"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JadeFormData, UpdateSection } from "./types";
import { form3Schema, Form3Values } from "./schemas";
import FileUpload from "./FileUpload";

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-lg mx-auto p-4"
    >
      <h2>Professional Information</h2>

      {/* Company Name */}
      <div>
        <label className="block text-sm font-medium">Company Name</label>
        <input
          type="text"
          {...register("companyName")}
          className="border p-2 w-full"
        />
        {errors.companyName && (
          <p className="text-red-500 text-xs">{errors.companyName.message}</p>
        )}
      </div>

      {/* Job Title */}
      <div>
        <label className="block text-sm font-medium">Job Title</label>
        <input
          type="text"
          {...register("jobTitle")}
          className="border p-2 w-full"
        />
        {errors.jobTitle && (
          <p className="text-red-500 text-xs">{errors.jobTitle.message}</p>
        )}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium">Start Date</label>
          <input
            type="date"
            {...register("startDate")}
            className="border p-2 w-full"
          />
          {errors.startDate && (
            <p className="text-red-500 text-xs">{errors.startDate.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">End Date</label>
          <input
            type="date"
            {...register("endDate")}
            className="border p-2 w-full"
          />
          {errors.endDate && (
            <p className="text-red-500 text-xs">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      {/* Upload Experience Certificate */}
      <FileUpload
        label="Upload Experience Certificate"
        folder="experience-certificates"
        accept=".pdf,image/*"
        value={watch("certificatePath")}
        error={errors.certificatePath?.message}
        onUploaded={handleUploaded}
      />

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevPage}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Back
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </form>
  );
}
