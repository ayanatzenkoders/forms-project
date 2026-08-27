"use client";

import { useRouter } from "next/navigation";
import Page5 from "@/components/practitioner/Page5";
import { usePractioner } from "@/context/PractitionerContext";
import { useRequireSection } from "@/components/practitioner/useRequireSection";

export default function PractitionerStep5() {
  const { formData, updateSection } = usePractioner();
  const router = useRouter();

  // Guard: the previous step must be complete before this one can be opened.
  const allowed = useRequireSection(
    Object.keys(formData.cancerHistory).length > 0,
    "/practioner-profile/step4",
  );
  if (!allowed) return null;

  function nextPage() {
    // Finished: replace (not push) so Back cannot return to the submitted form.
    router.replace("/");
  }

  function prevPage() {
    router.push("/practioner-profile/step4");
  }

  return (
    <Page5
      nextPage={nextPage}
      prevPage={prevPage}
      updateSection={updateSection}
      formData={formData}
    />
  );
}
