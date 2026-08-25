"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JadeFormData, UpdateSection } from "./types";
import { form7Schema, Form7Values } from "./schemas";
import { submitJadeForm } from "@/app/actions/jade";

interface Props {
  prevPage: () => void;
  updateSection: UpdateSection;
  formData: JadeFormData;
}

export default function JadePage7({
  prevPage,
  updateSection,
  formData,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Form7Values>({
    resolver: zodResolver(form7Schema),
    defaultValues: {
      ...formData.banking,
    },
  });

  const onSubmit = async (data: Form7Values) => {
    try {
      // Latest Page 7 data + everything already stored in Context.
      const completeData: JadeFormData = {
        ...formData,
        banking: data,
      };

      // No files here anymore! Every uploaded file was already sent to
      // Supabase on the page where it was picked, and only its PATH STRING
      // lives inside completeData now. Since the whole object is plain
      // text/numbers, we can pass it straight to the server action — no
      // FormData envelope needed (FormData is only for carrying binary files).
      const result = await submitJadeForm(completeData);

      console.log("Jade submitted:", result);

      if (result.success) {
        alert("Jade profile submitted successfully!");

        // Clear the saved draft after it is safely stored in the database.
        localStorage.removeItem("JadeFormData");
      }
    } catch (error) {
      console.error("Jade submission failed:", error);
      alert("Something went wrong while submitting the form.");
    }
  };
  return (
    <div className="max-w-lg mx-auto space-y-4">
      {/* Note Banner */}
      <div className="p-4 bg-gray-100 rounded-lg border border-gray-200 text-sm text-gray-700 flex items-start gap-2">
        <span className="font-bold text-gray-800">ⓘ Note:</span>
        <span>
          We only collect the information necessary to process your payments.
        </span>
      </div>

      {/* Main Form Container */}
      <div className="p-6 border rounded-lg bg-white shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-center text-gray-800">
          Banking Details
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Select Bank Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Select Bank
            </label>
            <select
              {...register("bankName")}
              className="w-full p-2.5 border rounded bg-gray-50 focus:bg-white text-gray-800"
            >
              <option value="">Select Bank</option>
              <option value="HBL">Habib Bank Limited (HBL)</option>
              <option value="Meezan">Meezan Bank</option>
              <option value="UBL">United Bank Limited (UBL)</option>
              <option value="MCB">MCB Bank</option>
              <option value="Standard Chartered">Standard Chartered</option>
            </select>
            {errors.bankName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.bankName.message}
              </p>
            )}
          </div>

          {/* Account Title */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Account Title
            </label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              {...register("accountTitle")}
              className="w-full p-2.5 border rounded bg-gray-50 focus:bg-white text-gray-800"
            />
            {errors.accountTitle && (
              <p className="text-red-500 text-xs mt-1">
                {errors.accountTitle.message}
              </p>
            )}
          </div>

          {/* Account Number / IBAN */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Account no / IBAN
            </label>
            <input
              type="text"
              placeholder="e.g. PK00MEZN0001234567890123"
              {...register("accountNumber")}
              className="w-full p-2.5 border rounded bg-gray-50 focus:bg-white text-gray-800"
            />
            {errors.accountNumber && (
              <p className="text-red-500 text-xs mt-1">
                {errors.accountNumber.message}
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
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
