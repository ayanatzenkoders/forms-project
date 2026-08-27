"use client";

import { useRouter } from "next/navigation";
import Page4 from "@/components/practitioner/Page4";
import { usePractioner } from "@/context/PractitionerContext";
import { useRequireSection } from "@/components/practitioner/useRequireSection";

export default function PractitionerStep4() {
  const { formData, updateSection } = usePractioner();
  const router = useRouter();

  // Guard: the previous step must be complete before this one can be opened.
  const allowed = useRequireSection(
    Object.keys(formData.issues).length > 0,
    "/practioner-profile/step3",
  );
  if (!allowed) return null;

  function nextPage() {
    router.push("/practioner-profile/step5");
  }

  function prevPage() {
    router.push("/practioner-profile/step3");
  }

  return (
    <Page4
      nextPage={nextPage}
      prevPage={prevPage}
      updateSection={updateSection}
      formData={formData}
    />
  );
}
