"use client";

import { useRouter } from "next/navigation";
import JadePage5 from "@/components/jade/Page5";
import { useJade } from "@/context/JadeContext";
import { useRequireSection } from "@/components/jade/useRequireSection";

export default function JadeStep5() {
  const router = useRouter();

  const { formData, updateSection } = useJade();

  // Guard: step 4 (specialization) must be done first.
  const allowed = useRequireSection(
    Object.keys(formData.specialization).length > 0,
    "/jades-profile/step4",
  );
  if (!allowed) return null;

  function nextPage() {
    router.push("/jades-profile/step6");
  }

  function prevPage() {
    router.push("/jades-profile/step4");
  }

  return (
    <JadePage5
      nextPage={nextPage}
      prevPage={prevPage}
      updateSection={updateSection}
      formData={formData}
    />
  );
}
