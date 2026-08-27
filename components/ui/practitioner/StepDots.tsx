/*
 * The segmented progress indicator at the top-right of the card.
 * The active segment is wider and dark; the rest are short grey bars.
 */
export default function StepDots({
  current,
  total,
}: {
  current: number; // 1-based
  total: number;
}) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Step ${current} of ${total}`}>
      {Array.from({ length: total }, (_, i) => i + 1).map((step) => (
        <span
          key={step}
          className={`h-1.5 rounded-full transition-all ${
            step === current ? "w-8 bg-slate-700" : "w-4 bg-slate-200"
          }`}
        />
      ))}
    </div>
  );
}
