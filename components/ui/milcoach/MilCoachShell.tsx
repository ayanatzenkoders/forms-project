import MilCoachLogo from "./Logo";
import Stepper from "./Stepper";

/*
 * The MilCoach page frame, shared by all 3 steps.
 *
 * Design values: page background #FBFBFB (from the Figma Properties panel),
 * green accent #6DBE45, white content area.
 *
 * Like the other two forms, the shell owns the <form> so the height chain and
 * the submit wiring can never be forgotten by an individual page.
 */
interface Props {
  step: number; // 1-based, drives the Stepper
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  children: React.ReactNode;
  onPrevious?: () => void; // omitted on step 1
  onSkip?: () => void; // optional "SKIP" link (steps 2 and 3)
  nextLabel?: string;
  isSubmitting?: boolean;
}

export default function MilCoachShell({
  step,
  onSubmit,
  children,
  onPrevious,
  onSkip,
  nextLabel = "Next",
  isSubmitting = false,
}: Props) {
  return (
    <div className="min-h-[100dvh] bg-[#FBFBFB]">
      <header className="mx-auto max-w-5xl px-6 pt-6">
        <MilCoachLogo />
      </header>

      <Stepper current={step} />

      <form onSubmit={onSubmit} className="mx-auto max-w-5xl px-6 pb-12">
        <div className="flex flex-col gap-8">{children}</div>

        {/* Footer: SKIP on the left, Previous / Next on the right */}
        <div className="mt-8 flex items-center justify-between">
          {onSkip ? (
            <button
              type="button"
              onClick={onSkip}
              className="text-xs font-medium tracking-[0.2em] text-slate-500 hover:text-slate-700"
            >
              SKIP
            </button>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-3">
            {onPrevious && (
              <button
                type="button"
                onClick={onPrevious}
                className="rounded-md bg-[#6DBE45] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#5CA838]"
              >
                ← Previous
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-[#6DBE45] px-6 py-2 text-sm font-medium text-white transition hover:bg-[#5CA838] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Please wait…" : `${nextLabel} →`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
