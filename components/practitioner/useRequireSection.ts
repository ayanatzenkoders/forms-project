"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/*
 * Guards a step: if the required earlier section isn't complete, send the user
 * back. Returns `true` when it is safe to render.
 *
 * The redirect lives in useEffect because calling router.replace() during
 * render is a side effect and React warns about it. The boolean lets the page
 * render null in the brief moment before the redirect happens, so the guarded
 * form never flashes on screen.
 */
export function useRequireSection(isComplete: boolean, redirectTo: string) {
  const router = useRouter();

  useEffect(() => {
    if (!isComplete) router.replace(redirectTo);
  }, [isComplete, redirectTo, router]);

  return isComplete;
}
