"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JadeFormData, UpdateSection } from "./types";
import { form7Schema, Form7Values } from "./schemas";
import { submitJadeForm } from "@/app/actions/jade";
import FormShell from "@/components/ui/FormShell";
import FormActions from "@/components/ui/FormActions";
import SectionLabel from "@/components/ui/SectionLabel";
import TextField from "@/components/ui/TextField";
import SelectField from "@/components/ui/SelectField";

interface Props {
  prevPage: () => void;
  updateSection: UpdateSection;
  formData: JadeFormData;
  // Called once the profile is safely saved, so the step page can navigate
  // away from the finished form.
  onSuccess: () => void;
}

export default function JadePage7({
  prevPage,
  updateSection,
  formData,
  onSuccess,
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

        // Clear the saved draft now that it is safely stored in the database.
        localStorage.removeItem("JadeFormData");

        // Leave the finished form. We deliberately do NOT clear the context
        // state here: changing it would re-render this page (and trip the step
        // guard) while we are still on it. Navigating away unmounts the
        // JadeProvider, so the in-memory data is discarded automatically — and
        // localStorage is already empty, so a fresh visit starts blank.
        onSuccess();
      }
    } catch (error) {
      console.error("Jade submission failed:", error);
      alert("Something went wrong while submitting the form.");
    }
  };

  return (
    <FormShell
      onSubmit={handleSubmit(onSubmit)}
      title="Banking Details"
      actions={
        <FormActions
          onBack={prevPage}
          nextLabel="Submit"
          isSubmitting={isSubmitting}
        />
      }
    >
      {/* Note banner */}
      <div className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
        <span className="font-semibold text-slate-800">ⓘ Note:</span>
        <span>
          We only collect the information necessary to process your payments.
        </span>
      </div>

      <SectionLabel>Account information</SectionLabel>

      <SelectField
        label="Select Bank"
        error={errors.bankName?.message}
        {...register("bankName")}
      >
        <option value="">Select Bank</option>
        <option value="HBL">Habib Bank Limited (HBL)</option>
        <option value="Meezan">Meezan Bank</option>
        <option value="UBL">United Bank Limited (UBL)</option>
        <option value="MCB">MCB Bank</option>
        <option value="Standard Chartered">Standard Chartered</option>
      </SelectField>

      <TextField
        label="Account Title"
        placeholder="e.g. John Doe"
        error={errors.accountTitle?.message}
        {...register("accountTitle")}
      />

      <TextField
        label="Account no / IBAN"
        placeholder="e.g. PK00MEZN0001234567890123"
        error={errors.accountNumber?.message}
        {...register("accountNumber")}
      />
    </FormShell>
  );
}
