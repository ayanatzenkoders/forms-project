"use client";

import { useRouter } from "next/navigation";
import Page2 from "@/components/practitioner/Page2";
import { usePractioner } from "@/context/PractitionerContext";
import { useRequireSection } from "@/components/practitioner/useRequireSection";

export default function PractitionerStep2() {
  const { formData, updateSection } = usePractioner();
  const router = useRouter();

  // Guard: the previous step must be complete before this one can be opened.
  const allowed = useRequireSection(
    Object.keys(formData.ProfileInfo1).length > 0,
    "/practioner-profile/step1",
  );
  if (!allowed) return null;

  function nextPage() {
    router.push("/practioner-profile/step3");
  }

  function prevPage() {
    router.push("/practioner-profile/step1");
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
