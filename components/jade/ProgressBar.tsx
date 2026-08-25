"use client";

import { usePathname } from "next/navigation";

// The 7 steps in order, with a short label each. The array index + 1 is the
// step number, so we only maintain this list in one place.
const STEPS = [
  "Personal",
  "Education",
  "Professional",
  "Specialization",
  "License",
  "Availability",
  "Banking",
];

export default function ProgressBar() {
  // usePathname() gives the current URL path, e.g. "/jades-profile/step3".
  // We pull the trailing number out of it to know which step is active.
  const pathname = usePathname();
  const match = pathname.match(/step(\d+)/);
  const current = match ? Number(match[1]) : 1; // 1-based step number

  const percent = (current / STEPS.length) * 100;

  return (
    <div className="max-w-lg mx-auto mb-6">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>
          Step {current} of {STEPS.length}
        </span>
        <span>{STEPS[current - 1]}</span>
      </div>

      {/* Track */}
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        {/* Filled portion grows with the current step */}
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
