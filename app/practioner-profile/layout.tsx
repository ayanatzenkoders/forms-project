"use client";

import { PractionerProvider, usePractioner } from "@/context/PractitionerContext";

// Sits INSIDE the provider so it can read `hydrated`. Until the saved draft has
// been read from localStorage we render a loading line. That is what lets every
// step trust that formData is already filled on its first render, so no page
// needs a reset() effect to patch values in afterwards.
function PractitionerGate({ children }: { children: React.ReactNode }) {
  const { hydrated } = usePractioner();

  if (!hydrated) {
    return <p className="p-8 text-center text-gray-400">Loading…</p>;
  }

  return <>{children}</>;
}

export default function PractitionerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PractionerProvider>
      <PractitionerGate>{children}</PractitionerGate>
    </PractionerProvider>
  );
}
