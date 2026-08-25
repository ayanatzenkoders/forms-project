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

// import Page2 from "@/components/practitioner/Page2";
// import { usePractioner } from "@/context/PractitionerContext";
// import { useRouter } from "next/navigation";

// export default function PractitionerStep2() {
//   const { formData, updateSection } = usePractioner();
//   const router = useRouter();

//   function nextPage() {
//     router.push("/practioner-profile/step3");
//   }

//   function prevPage() {
//     router.push("/practioner-profile/step1");
//   }

//   return (
//     <Page2
//       nextPage={nextPage}
//       prevPage={prevPage}
//       updateSection={updateSection}
//       formData={formData}
//     />
//   );
// }
