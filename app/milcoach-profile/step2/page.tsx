"use client";

import { useRouter } from "next/navigation";
import Page2 from "@/components/milcoach/Page2";
import { useMilCoach } from "@/context/MilCoachContext";
import { useRequireSection } from "@/components/milcoach/useRequireSection";

export default function MilCoachStep2() {
  const { formData, updateSection } = useMilCoach();
  const router = useRouter();

  // Guard: step 1 must be complete before this step can be opened.
  const allowed = useRequireSection(
    Object.keys(formData.personalDetails).length > 0,
    "/milcoach-profile/step1",
  );
  if (!allowed) return null;

  function nextPage() {
    router.push("/milcoach-profile/step3");
  }

  function prevPage() {
    router.push("/milcoach-profile/step1");
  }

  return (
    <Page2
      nextPage={nextPage}
      prevPage={prevPage}
      updateSection={updateSection}
      formData={formData}
    />
  );
}
