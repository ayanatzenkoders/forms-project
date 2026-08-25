/*
 * ── PARKED ROUTE (unfinished feature) ───────────────────────────────────────
 * Next.js requires every page.tsx / layout.tsx to export a default component.
 * A fully commented-out file exports NOTHING, so the build fails with
 * "is not a module" — that is why commenting alone was not enough.
 *
 * This placeholder keeps the build green. Your real code is preserved below,
 * exactly as you left it.
 *
 * TO RESUME: uncomment your code below, then delete this placeholder.
 * ───────────────────────────────────────────────────────────────────────────
 */
export default function ParkedPage() {
  return null;
}

// "use client";

// import Page1 from "@/components/practitioner/Page1";
// import { usePractioner } from "@/context/PractitionerContext";
// import { useRouter } from "next/navigation";

// export default function PractitionerStep1() {
//   const { formData, updateSection } = usePractioner();
//   const router = useRouter();

//   function nextPage() {
//     router.push("/practioner-profile/step2");
//   }

//   return (
//     <Page1
//       nextPage={nextPage}
//       updateSection={updateSection}
//       formData={formData}
//     />
//   );
// }
