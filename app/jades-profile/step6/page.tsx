"use client";

import { useRouter } from "next/navigation";
import JadePage6 from "@/components/jade/Page6";
import { useJade } from "@/context/JadeContext";
import { useRequireSection } from "@/components/jade/useRequireSection";

export default function JadeStep6() {
  const router = useRouter();

  const { formData, updateSection } = useJade();

  // Guard: step 5 (license) must be done first.
  const allowed = useRequireSection(
    Object.keys(formData.license).length > 0,
    "/jades-profile/step5",
  );
  if (!allowed) return null;

  function nextPage() {
    router.push("/jades-profile/step7");
  }

  function prevPage() {
    router.push("/jades-profile/step5");
  }

  return (
    <JadePage6
      nextPage={nextPage}
      prevPage={prevPage}
      updateSection={updateSection}
      formData={formData}
    />
  );
}
