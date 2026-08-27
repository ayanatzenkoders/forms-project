"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PractitionerFormData, UpdatePractitionerSection } from "./types";
import { page3Schema, Page3Values, BODY_ISSUES } from "./schemas";
import ProfileShell from "@/components/ui/practitioner/ProfileShell";
import SectionHeading from "@/components/ui/practitioner/SectionHeading";
import CheckboxList from "@/components/ui/practitioner/CheckboxList";
import { TOTAL_STEPS } from "./Page1";

/*
 * STEP 3 - "Select Issues"
 *
 * Props come from the ROUTE file (app/practioner-profile/step3/page.tsx).
 * The route knows about URLs; this component knows about fields. That split is
 * why the component never imports useRouter.
 */
interface Props {
  nextPage: () => void; // route pushes /step4
  prevPage: () => void; // route pushes /step2
  updateSection: UpdatePractitionerSection; // saves into context + localStorage
  formData: PractitionerFormData; // the whole saved draft
}

export default function Page3({
  nextPage,
  prevPage,
  updateSection,
  formData,
}: Props) {
  const {
    register, // connects an input to a field name
    handleSubmit, // validates, then calls our onSubmit with clean data
    formState: { errors }, // per-field messages produced by the schema
  } = useForm<Page3Values>({
    // The resolver is the bridge: it hands the form values to Zod and turns
    // Zod's complaints into `errors`.
    resolver: zodResolver(page3Schema),
    defaultValues: {
      issues: [], // an array field must start as an array, never undefined
      ...formData.issues, // overlay anything already saved (Back button / refresh)
    },
  });

  // Runs ONLY when validation passes. `data` is the validated Page3Values.
  const onSubmit = (data: Page3Values) => {
    updateSection("issues", data); // 1. save this step
    nextPage(); // 2. move to step 4
  };

  return (
    <ProfileShell
      step={3} // which dot is highlighted
      totalSteps={TOTAL_STEPS}
      onSubmit={handleSubmit(onSubmit)} // the shell renders the <form>
      onBack={prevPage} // omit this and no Back button renders
    >
      <SectionHeading>Select Issues</SectionHeading>

      <CheckboxList
        options={BODY_ISSUES}
        // register("issues") returns {name, onChange, onBlur, ref}. The list
        // spreads that SAME object onto all five checkboxes; because they share
        // a name and each has its own value, RHF builds the array for us.
        registration={register("issues")}
        error={errors.issues?.message}
      />
    </ProfileShell>
  );
}
