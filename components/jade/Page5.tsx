"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JadeFormData, UpdateSection } from "./types";
import { form5Schema, Form5Values } from "./schemas";
import FileUpload from "./FileUpload";

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
    <div className="max-w-lg mx-auto p-6 border rounded-lg bg-white shadow-sm space-y-4">
      <h2 className="text-xl font-bold text-center text-gray-800">License</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* State Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">State</label>
          <select
            {...register("state")}
            className="w-full p-2 border rounded bg-gray-50 focus:bg-white"
          >
            <option value="">Select State</option>
            <option value="SD">Sindh</option>
            <option value="PJ">Punjab</option>
            <option value="BL">Balochistan</option>
            <option value="KPK">KPK</option>
            <option value="Gil">Gilgit</option>
            <option value="JK">Jammu Kashmir</option>
          </select>
          {errors.state && (
            <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>
          )}
        </div>

        {/* NPI Number */}
        <div>
          <label className="block text-sm font-medium mb-1">NPI Number</label>
          <input
            type="text"
            placeholder="10-digit NPI"
            {...register("npiNumber")}
            className="w-full p-2 border rounded bg-gray-50 focus:bg-white"
          />
          {errors.npiNumber && (
            <p className="text-red-500 text-xs mt-1">
              {errors.npiNumber.message}
            </p>
          )}
        </div>

        {/* Upload License */}
        <FileUpload
          label="Upload License (LCSW, LMFT, LPC, PsyD)"
          folder="licenses"
          accept=".pdf,.doc,.docx,image/*"
          value={watch("licenseFilePath")}
          error={errors.licenseFilePath?.message}
          onUploaded={(path) => handleUploaded("licenseFilePath", path)}
        />

        {/* Upload Liability Insurance */}
        <FileUpload
          label="Upload Liability Insurance (JPEG, PNG, PDF)"
          folder="liability-insurance"
          accept=".jpeg,.png,.pdf"
          value={watch("liabilityInsuranceFilePath")}
          error={errors.liabilityInsuranceFilePath?.message}
          onUploaded={(path) =>
            handleUploaded("liabilityInsuranceFilePath", path)
          }
        />

        {/* Action Buttons */}
        <div className="flex justify-between pt-2">
          <button
            type="button"
            onClick={prevPage}
            className="px-4 py-2 border border-gray-400 rounded text-gray-700 hover:bg-gray-100"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}
