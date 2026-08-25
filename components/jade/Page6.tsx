"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JadeFormData, UpdateSection } from "./types";
import { form6Schema, Form6Values } from "./schemas";

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
    <div className="max-w-lg mx-auto p-6 border rounded-lg bg-white shadow-sm space-y-4">
      <h2 className="text-xl font-bold text-center text-gray-800">
        Your Available Timings
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Start Time Field */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Start Time
          </label>
          <input
            type="time"
            {...register("startTime")}
            className="w-full p-2.5 border rounded bg-gray-50 focus:bg-white text-gray-800"
          />
          {errors.startTime && (
            <p className="text-red-500 text-xs mt-1">
              {errors.startTime.message}
            </p>
          )}
        </div>

        {/* End Time Field */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            End Time
          </label>
          <input
            type="time"
            {...register("endTime")}
            className="w-full p-2.5 border rounded bg-gray-50 focus:bg-white text-gray-800"
          />
          {errors.endTime && (
            <p className="text-red-500 text-xs mt-1">
              {errors.endTime.message}
            </p>
          )}
        </div>

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
