"use client";

import { useRouter } from "next/navigation";
import Page3 from "@/components/practitioner/Page3";
import { usePractioner } from "@/context/PractitionerContext";
import { useRequireSection } from "@/components/practitioner/useRequireSection";

export default function PractitionerStep3() {
  const { formData, updateSection } = usePractioner();
  const router = useRouter();

  // Guard: the previous step must be complete before this one can be opened.
  const allowed = useRequireSection(
    Object.keys(formData.workratings).length > 0,
    "/practioner-profile/step2",
  );
  if (!allowed) return null;

  function nextPage() {
    router.push("/practioner-profile/step4");
  }

  function prevPage() {
    router.push("/practioner-profile/step2");
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
