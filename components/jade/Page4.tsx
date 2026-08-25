"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JadeFormData, UpdateSection } from "./types";
import { form4Schema, Form4Values } from "./schemas";

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
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-semibold text-center text-slate-800 mb-6">
        Select Specialization
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {SPECIALIZATIONS.map((item) => (
          <label key={item}>
            <input
              type="checkbox"
              value={item}
              {...register("specializations")}
            />
            {item}
          </label>
        ))}

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={prevPage}
            className="px-6 py-2 border border-[#003B73] text-[#003B73] font-medium rounded-lg hover:bg-slate-50"
          >
            &lt; Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#003B73] text-white font-medium rounded-lg hover:bg-[#002B54]"
          >
            Next &gt;
          </button>
        </div>
      </form>
    </div>
  );
}
