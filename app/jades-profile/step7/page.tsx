"use client";

import { useRouter } from "next/navigation";
import { useJade } from "@/context/JadeContext";
import JadePage7 from "@/components/jade/Page7";
import { useRequireSection } from "@/components/jade/useRequireSection";

export default function JadeStep7() {
  const router = useRouter();

  const { formData, updateSection } = useJade();

  // Guard: step 6 (availability) must be done first.
  const allowed = useRequireSection(
    Object.keys(formData.availability).length > 0,
    "/jades-profile/step6",
  );
  if (!allowed) return null;

  function prevPage() {
    router.push("/jades-profile/step6");
  }

  return (
    <JadePage7
      prevPage={prevPage}
      updateSection={updateSection}
      formData={formData}
    />
  );
}
