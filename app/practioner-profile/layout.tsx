/*
 * ── PARKED LAYOUT (unfinished feature) ──────────────────────────────────────
 * Next.js requires layout.tsx to export a default component that renders its
 * children. A fully commented-out file exports nothing and breaks the build.
 *
 * This placeholder just passes children through. Your real code is preserved
 * below, exactly as you left it.
 *
 * TO RESUME: uncomment your code below, then delete this placeholder.
 * ───────────────────────────────────────────────────────────────────────────
 */
export default function ParkedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

// import { PractionerProvider } from "@/context/PractitionerContext";

// export default function JadeLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return <PractionerProvider><{children}</PractionerProvider>;
// }
