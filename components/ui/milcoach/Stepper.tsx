/*
 * The horizontal 3-step progress bar.
 *
 * Each step is a numbered circle joined by a line, with its label in a pill
 * underneath. Steps BEFORE the current one show a tick instead of a number.
 */
const STEPS = ["Personal Details", "Work Experience", "Education"];

export default function Stepper({ current }: { current: number }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <div className="relative flex items-start justify-between">
        {/* The connecting line sits behind the circles */}
        <div className="absolute left-0 right-0 top-3 -z-10 h-0.5 bg-slate-200" />

        {STEPS.map((label, index) => {
          const step = index + 1;
          const done = step < current;
          const active = step === current;

          return (
            <div key={label} className="flex flex-col items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-[11px] font-semibold ${
                  done || active
                    ? "border-[#6DBE45] bg-[#6DBE45] text-white"
                    : "border-slate-200 bg-white text-slate-400"
                }`}
              >
                {done ? "✓" : step}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-[11px] ${
                  done || active
                    ? "bg-[#EAF7E3] font-medium text-[#4F9E2E]"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
