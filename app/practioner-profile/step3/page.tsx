"use client";

import Page3 from "@/components/practitioner/Page3";
import { usePractioner } from "@/context/PractitionerContext";
import { useRouter } from "next/navigation";

export default function PractitionerStep2() {
  const { formData, updateSection } = usePractioner();
  const router = useRouter();

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
