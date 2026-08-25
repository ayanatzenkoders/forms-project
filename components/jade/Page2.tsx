"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JadeFormData, UpdateSection } from "./types";
import { form2Schema, Form2Values } from "./schemas";
import FileUpload from "./FileUpload";

interface Props {
  nextPage: () => void;
  prevPage: () => void;
  //   keyType = Keyof Object; // extracts the properties. If object is defined as:
  //   interface User {
  //   id: number;
  //   name: string;F
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-lg mx-auto p-4"
    >
      <h2>Education Information</h2>

      {/* Institute Name */}
      <div>
        <label className="block text-sm font-medium">Institute Name</label>
        <input
          type="text"
          {...register("instituteName")}
          className="border p-2 w-full"
        />
        {errors.instituteName && (
          <p className="text-red-500 text-xs">{errors.instituteName.message}</p>
        )}
      </div>

      {/* Degree */}
      <div>
        <label className="block text-sm font-medium">Degree</label>
        <input
          type="text"
          {...register("degree")}
          className="border p-2 w-full"
        />
        {errors.degree && (
          <p className="text-red-500 text-xs">{errors.degree.message}</p>
        )}
      </div>

      {/* Field of Study */}
      <div>
        <label className="block text-sm font-medium">Field of Study</label>
        <input
          type="text"
          {...register("fieldOfStudy")}
          className="border p-2 w-full"
        />
        {errors.fieldOfStudy && (
          <p className="text-red-500 text-xs">{errors.fieldOfStudy.message}</p>
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

      {/* Upload Certificate */}
      <div>
        <FileUpload
          label="Upload Certificate"
          folder="education-certificates"
          accept=".pdf,image/*"
          value={watch("certificatePath")}
          error={errors.certificatePath?.message}
          onUploaded={handleUploaded}
        />
      </div>

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
