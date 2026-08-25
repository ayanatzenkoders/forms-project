"use client";

import { useRouter } from "next/navigation";
import Page3 from "@/components/jade/Page3";
import { useJade } from "@/context/JadeContext";
import { useRequireSection } from "@/components/jade/useRequireSection";

export default function JadeStep3() {
  const router = useRouter();

  const { formData, updateSection } = useJade();

  // Guard: step 2 (education) must be done first.
  const allowed = useRequireSection(
    Object.keys(formData.education).length > 0,
    "/jades-profile/step2",
  );
  if (!allowed) return null;

  function nextPage() {
    router.push("/jades-profile/step4");
  }

  function prevPage() {
    router.push("/jades-profile/step2");
  }

  return (
    <Page3
      nextPage={nextPage}
      prevPage={prevPage}
      updateSection={updateSection}
      formData={formData}
    />
  );
}
