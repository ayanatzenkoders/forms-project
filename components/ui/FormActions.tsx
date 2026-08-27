/*
 * The Back / Next (or Submit) row shown under the card on every step.
 *
 * Alignment rule from the design: when there is no Back button, Next still sits
 * on the RIGHT. `justify-between` + an empty <span/> placeholder achieves that
 * without any conditional layout classes.
 */
interface Props {
  onBack?: () => void; // omitted on step 1
  nextLabel?: string; // "Next" by default, "Submit" on the last step
  isSubmitting?: boolean;
  disabled?: boolean;
}

export default function FormActions({
  onBack,
  nextLabel = "Next",
  isSubmitting = false,
  disabled = false,
}: Props) {
  return (
    <div className="flex items-center justify-between">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-[#0B2B5B] px-5 py-2 text-sm font-medium text-[#0B2B5B] transition hover:bg-slate-50"
        >
          &lt; Back
        </button>
      ) : (
        <span />
      )}

      <button
        type="submit"
        disabled={disabled || isSubmitting}
        className="rounded-lg bg-[#0B2B5B] px-6 py-2 text-sm font-medium text-white transition hover:bg-[#0a2249] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Please wait…" : `${nextLabel} ›`}
      </button>
    </div>
  );
}
