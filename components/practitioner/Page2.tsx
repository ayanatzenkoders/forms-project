"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PractitionerFormData, UpdatePractitionerSection } from "./types";
import { page2Schema, Page2Values, THERAPISTS } from "./schemas";
import ProfileShell from "@/components/ui/practitioner/ProfileShell";
import FieldLabel from "@/components/ui/practitioner/FieldLabel";
import StarRating from "@/components/ui/practitioner/StarRating";
import { TOTAL_STEPS } from "./Page1";

interface Props {
  nextPage: () => void;
  prevPage: () => void;
  updateSection: UpdatePractitionerSection;
  formData: PractitionerFormData;
}

export default function Page2({
  nextPage,
  prevPage,
  updateSection,
  formData,
}: Props) {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Page2Values>({
    resolver: zodResolver(page2Schema),
    defaultValues: {
      // Start every therapist at 0 stars, then overlay any saved draft.
      workratings:
        formData.workratings?.workratings ??
        THERAPISTS.map((therapist) => ({ therapist, stars: 0 })),
    },
  });

  // watch() re-renders the rows whenever a rating changes, so the stars update.
  const rows = watch("workratings") ?? [];

  function setStars(index: number, stars: number) {
    // Stars are not a native input, so RHF cannot read them from the DOM -
    // we write the value ourselves with setValue().
    const next = rows.map((row, i) => (i === index ? { ...row, stars } : row));
    setValue("workratings", next, { shouldValidate: true });
  }

  const onSubmit = (data: Page2Values) => {
    updateSection("workratings", data);
    nextPage();
  };

  return (
    <ProfileShell
      step={2}
      totalSteps={TOTAL_STEPS}
      onSubmit={handleSubmit(onSubmit)}
      onBack={prevPage}
    >
      <FieldLabel required size="lg">
        Please select which of the following you have used in the past and rate
        how well they worked for you. (out of 5 stars)
      </FieldLabel>

      <div className="flex flex-col gap-1">
        {rows.map((row, index) => (
          <div
            key={row.therapist}
            className="flex items-center justify-between py-1.5"
          >
            <span className="text-sm text-slate-800">{row.therapist}</span>
            <StarRating
              value={row.stars}
              onChange={(stars) => setStars(index, stars)}
            />
          </div>
        ))}
      </div>

      {/* The array-level refine() message lands on the root of the field */}
      {errors.workratings?.root && (
        <p className="text-xs text-red-500">
          {errors.workratings.root.message}
        </p>
      )}
      {errors.workratings?.message && (
        <p className="text-xs text-red-500">{errors.workratings.message}</p>
      )}
    </ProfileShell>
  );
}
