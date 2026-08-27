"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PractitionerFormData, UpdatePractitionerSection } from "./types";
import { page5Schema, Page5Values } from "./schemas";
import { submitPractitionerForm } from "@/app/actions/practitioner";
import ProfileShell from "@/components/ui/practitioner/ProfileShell";
import SectionHeading from "@/components/ui/practitioner/SectionHeading";
import TextInput from "@/components/ui/practitioner/TextInput";
import { TOTAL_STEPS } from "./Page1";

/*
 * STEP 5 - "Payment Details" (the last step).
 *
 * Differences from the middle steps:
 *  - the button says "Submit", not "Continue"
 *  - onSubmit is async, because a real submit will call a server action
 *  - isSubmitting disables the button so it cannot be double-clicked
 */
interface Props {
  nextPage: () => void; // route sends the user away when finished
  prevPage: () => void;
  updateSection: UpdatePractitionerSection;
  formData: PractitionerFormData;
}

export default function Page5({
  nextPage,
  prevPage,
  updateSection,
  formData,
}: Props) {
  const {
    register,
    handleSubmit,
    // isSubmitting is true while an async onSubmit is still running.
    formState: { errors, isSubmitting },
  } = useForm<Page5Values>({
    resolver: zodResolver(page5Schema),
    defaultValues: {
      bsbNumber: "",
      accountHolderName: "",
      accountNumber: "",
      ...formData.payment,
    },
  });

  const onSubmit = async (data: Page5Values) => {
    try {
      // The latest step-5 values PLUS everything already saved in context.
      // `data` is fresher than formData.payment, because context is only
      // written on submit - so we overlay it last.
      const completeData = {
        ...formData,
        payment: data,
      };

      // No files here: each upload already happened on its own step and only
      // the path STRING travels, so this is plain JSON - no FormData needed.
      const result = await submitPractitionerForm(completeData);

      if (result.success) {
        alert("Practitioner profile submitted successfully!");

        // Clear the saved draft now that it is safely in the database.
        localStorage.removeItem("PractitionerFormData");

        // Leave the finished form. We do NOT call clearForm() here: changing
        // context would re-render this page and trip the step guard while we
        // are still on it. Navigating away unmounts the provider, which throws
        // the in-memory draft away for free.
        nextPage();
      }
    } catch (error) {
      console.error("Practitioner submission failed:", error);
      alert("Something went wrong while submitting the form.");
    }
  };

  return (
    <ProfileShell
      step={5}
      totalSteps={TOTAL_STEPS}
      onSubmit={handleSubmit(onSubmit)}
      onBack={prevPage}
      continueLabel="Submit"
      isSubmitting={isSubmitting}
    >
      <SectionHeading>Payment Details</SectionHeading>

      {/* BSB + Account Holder Name share a row, as in the design */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextInput
          label="BSB Number"
          required
          placeholder="Enter BSB Number"
          error={errors.bsbNumber?.message}
          {...register("bsbNumber")}
        />
        <TextInput
          label="Account Holder Name"
          required
          placeholder="Enter Account Holder Name"
          error={errors.accountHolderName?.message}
          {...register("accountHolderName")}
        />
      </div>

      {/* Account number sits alone on the next row, half width */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextInput
          label="Account Number / IBAN Number"
          required
          placeholder="Enter Account Number / IBAN Number"
          error={errors.accountNumber?.message}
          {...register("accountNumber")}
        />
      </div>
    </ProfileShell>
  );
}
