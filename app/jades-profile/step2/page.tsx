"use client";

import { useRouter } from "next/navigation";
import JadePage2 from "@/components/jade/Page2";
import { useJade } from "@/context/JadeContext";
import { useRequireSection } from "@/components/jade/useRequireSection";

export default function JadeStep2() {
  const router = useRouter();

  const { formData, updateSection } = useJade();

  // Guard: you may only be here if step 1 (personal info) is done. If someone
  // opens /step2 directly, send them back to step 1.
  const allowed = useRequireSection(
    Object.keys(formData.personalInformation).length > 0,
    "/jades-profile/step1",
  );
  if (!allowed) return null;

  function nextPage() {
    router.push("/jades-profile/step3");
  }

  function prevPage() {
    router.push("/jades-profile/step1");
  }

  return (
    <JadePage2
      nextPage={nextPage}
      prevPage={prevPage}
      updateSection={updateSection}
      formData={formData}
    />
  );
}
