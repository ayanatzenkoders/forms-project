"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/*
 * Guards a step: if the required earlier section isn't complete, send the user
 * back to where they should be. Returns `true` when it's safe to render.
 *
 * WHY a hook + useEffect instead of redirecting straight inside the component
 * body: calling router.replace() while React is rendering is a side effect and
 * React warns against it. Side effects belong in useEffect. We also return a
 * boolean so the page can render `null` during the brief moment before the
 * redirect happens (otherwise it would flash the guarded form for one frame).
 *
 * This relies on the layout's JadeGate having already waited for hydration, so
 * by the time this runs, formData is the real saved data — not empty.
 */
export function useRequireSection(isComplete: boolean, redirectTo: string) {
  const router = useRouter();

  useEffect(() => {
    if (!isComplete) {
      router.replace(redirectTo);
    }
  }, [isComplete, redirectTo, router]);

  return isComplete;
}
