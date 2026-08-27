"use client";

import { JadeProvider, useJade } from "@/context/JadeContext";
import ProgressBar from "@/components/jade/ProgressBar";
import JadeLogo from "@/components/ui/Logo";

// Sits INSIDE the provider so it can read `hydrated`. Until the saved draft has
// been read from localStorage we render nothing (a tiny loading line). This is
// what lets every step page trust that formData is already filled on first
// render — so we no longer need the reset() effects that patched it afterwards.
function JadeGate({ children }: { children: React.ReactNode }) {
  const { hydrated } = useJade();

  if (!hydrated) {
    return <p className="text-center p-8 text-gray-400">Loading…</p>;
  }

  return (
    // The progress bar sits above the form shell. No page padding here: each
    // step's FormShell is full-bleed so the mountain footer can reach the edges.
    <div className="flex min-h-[100dvh] flex-col bg-white">
      <div className="px-4 pt-4">
        <JadeLogo />
        <ProgressBar />
      </div>
      {children}
    </div>
  );
}

export default function JadeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <JadeProvider>
      <JadeGate>{children}</JadeGate>
    </JadeProvider>
  );
}
