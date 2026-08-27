"use client";

/*
 * A 1-5 star row. This is a CONTROLLED component: it does not talk to
 * react-hook-form directly. The page passes the current `value` and an
 * `onChange`, and stores the result with setValue().
 *
 * Why not register()? Stars are not a native form input, so there is no DOM
 * element for RHF to read a value from - we have to set it ourselves.
 */
interface Props {
  value: number;
  onChange: (stars: number) => void;
  max?: number;
}

export default function StarRating({ value, onChange, max = 5 }: Props) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button" // never submit the form
          onClick={() => onChange(star)}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          className="transition hover:scale-110"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={star <= value ? "#FBBF24" : "#D1D5DB"}
          >
            <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );
}
