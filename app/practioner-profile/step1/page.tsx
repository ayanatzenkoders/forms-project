"use client";

import Page1 from "@/components/practitioner/Page1";
import { usePractioner } from "@/context/PractitionerContext";
import { useRouter } from "next/navigation";

export default function PractitionerStep1() {
  const { formData, updateSection } = usePractioner();
  const router = useRouter();

  function nextPage() {
    router.push("/practioner-profile/step2");
  }

  return (
    <Page1
      nextPage={nextPage}
      updateSection={updateSection}
      formData={formData}
    />
  );
}
