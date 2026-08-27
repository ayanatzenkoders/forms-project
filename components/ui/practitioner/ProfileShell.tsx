import StepDots from "./StepDots";

/*
 * The practitioner card frame, shared by every step:
 *   "Complete Profile" heading + step dots  ->  fields  ->  Continue button.
 *
 * Design values taken from the Figma Properties panel:
 *   white #FFFFFF, radius 20px, padding 24px, gap 16px,
 *   drop shadow x0 y6 blur30 #000000 at 8%.
 *
 * Like the Jade FormShell, this component owns the <form> so no page can
 * forget the wiring, and every step is guaranteed the same frame.
 */
interface Props {
  step: number; // 1-based, drives the dots
  totalSteps: number;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  children: React.ReactNode;
  onBack?: () => void;
  continueLabel?: string;
  isSubmitting?: boolean;
}

export default function ProfileShell({
  step,
  totalSteps,
  onSubmit,
  children,
  onBack,
  continueLabel = "Continue",
  isSubmitting = false,
}: Props) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-slate-50 px-4 py-10">
      <form
        onSubmit={onSubmit}
        className="mx-auto w-full max-w-3xl rounded-[20px] bg-white p-6 shadow-[0_6px_30px_rgba(0,0,0,0.08)]"
      >
        {/* Title row */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Complete Profile
          </h1>
          <StepDots current={step} total={totalSteps} />
        </div>

        <hr className="my-5 border-slate-200" />

        {/* gap-4 == the 16px gap from the design */}
        <div className="flex flex-col gap-4">{children}</div>

        {/* Continue sits bottom-right */}
        <div className="mt-8 flex items-center justify-between">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Back
            </button>
          ) : (
            <span />
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-gradient-to-b from-slate-600 to-slate-800 px-10 py-3 text-sm font-medium text-white shadow-sm transition hover:from-slate-700 hover:to-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Please wait…" : continueLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
