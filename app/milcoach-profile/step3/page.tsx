"use client";

import { useRouter } from "next/navigation";
import Page3 from "@/components/milcoach/Page3";
import { useMilCoach } from "@/context/MilCoachContext";
import { useRequireSection } from "@/components/milcoach/useRequireSection";

export default function MilCoachStep3() {
  const { formData, updateSection } = useMilCoach();
  const router = useRouter();

  // Guard: step 2 must be complete before this step can be opened.
  const allowed = useRequireSection(
    Object.keys(formData.workExperience).length > 0,
    "/milcoach-profile/step2",
  );
  if (!allowed) return null;

  function prevPage() {
    router.push("/milcoach-profile/step2");
  }

  // Finished: replace (not push) so Back cannot return to the submitted form.
  function onSuccess() {
    router.replace("/");
  }

  return (
    <Page3
      prevPage={prevPage}
      onSuccess={onSuccess}
      updateSection={updateSection}
      formData={formData}
    />
  );
}
