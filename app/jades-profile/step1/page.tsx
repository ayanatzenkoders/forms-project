"use client";

import { useRouter } from "next/navigation";
import JadePage1 from "@/components/jade/Page1";
import { useJade } from "@/context/JadeContext";

export default function JadeStep1() {
  const { formData, updateSection } = useJade();

  const router = useRouter();

  function nextPage() {
    router.push("/jades-profile/step2");
  }

  return (
    <JadePage1
      nextPage={nextPage}
      updateSection={updateSection}
      formData={formData}
    />
  );
}
