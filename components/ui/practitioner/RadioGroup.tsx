import { UseFormRegisterReturn } from "react-hook-form";

/*
 * Circle radio buttons stacked vertically (or in 2 columns).
 * All options share one field, so we spread the same `registration` onto each
 * input - the browser handles the "only one selected" behaviour by name.
 */
interface Props {
  options: string[];
  registration: UseFormRegisterReturn;
  error?: string;
  columns?: 1 | 2;
}

export default function RadioGroup({
  options,
  registration,
  error,
  columns = 1,
}: Props) {
  return (
    <div>
      <div
        className={`grid gap-3 ${columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}
      >
        {options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-start gap-3 text-sm text-slate-700"
          >
            <input
              type="radio"
              value={option}
              {...registration}
              className="mt-0.5 h-4 w-4 shrink-0 accent-slate-700"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
