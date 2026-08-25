"use client";

import Page2 from "@/components/practitioner/Page2";
import { usePractioner } from "@/context/PractitionerContext";
import { useRouter } from "next/navigation";

export default function PractitionerStep2() {
  const { formData, updateSection } = usePractioner();
  const router = useRouter();

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
