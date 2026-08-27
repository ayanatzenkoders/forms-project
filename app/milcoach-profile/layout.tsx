"use client";

import { MilCoachProvider, useMilCoach } from "@/context/MilCoachContext";

// Inside the provider so it can read `hydrated`. Waiting here is what lets
// every step trust that formData is already filled on its first render, so no
// page needs a reset() effect to patch values in afterwards.
function MilCoachGate({ children }: { children: React.ReactNode }) {
  const { hydrated } = useMilCoach();

  if (!hydrated) {
    return <p className="p-8 text-center text-gray-400">Loading…</p>;
  }

  return <>{children}</>;
}

export default function MilCoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MilCoachProvider>
      <MilCoachGate>{children}</MilCoachGate>
    </MilCoachProvider>
  );
}
