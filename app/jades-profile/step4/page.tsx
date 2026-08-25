"use client";

import { useRouter } from "next/navigation";
import JadePage4 from "@/components/jade/Page4";
import { useJade } from "@/context/JadeContext";
import { useRequireSection } from "@/components/jade/useRequireSection";

export default function JadeStep4() {
  const router = useRouter();

  const { formData, updateSection } = useJade();

  // Guard: step 3 (professional) must be done first.
  const allowed = useRequireSection(
    Object.keys(formData.professional).length > 0,
    "/jades-profile/step3",
  );
  if (!allowed) return null;

  function nextPage() {
    router.push("/jades-profile/step5");
  }

  function prevPage() {
    router.push("/jades-profile/step3");
  }

  return (
    <JadePage4
      nextPage={nextPage}
      prevPage={prevPage}
      updateSection={updateSection}
      formData={formData}
    />
  );
}
