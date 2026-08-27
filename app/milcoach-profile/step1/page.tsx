"use client";

import { useRouter } from "next/navigation";
import Page1 from "@/components/milcoach/Page1";
import { useMilCoach } from "@/context/MilCoachContext";

export default function MilCoachStep1() {
  const { formData, updateSection } = useMilCoach();
  const router = useRouter();

  function nextPage() {
    router.push("/milcoach-profile/step2");
  }

  return (
    <Page1
      nextPage={nextPage}
      updateSection={updateSection}
      formData={formData}
    />
  );
}
