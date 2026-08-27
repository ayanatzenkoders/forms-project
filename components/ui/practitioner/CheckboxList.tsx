import { UseFormRegisterReturn } from "react-hook-form";

/*
 * A plain vertical list of checkboxes (the "Select Issues" design).
 *
 * Different from CheckboxChips: no pills, no dark selected state - just a
 * stacked list. Same wiring though: every checkbox shares ONE field name via
 * `registration`, each carrying its own `value`, and react-hook-form collects
 * the ticked ones into an array automatically.
 */
interface Props {
  options: string[];
  registration: UseFormRegisterReturn;
  error?: string;
}

export default function CheckboxList({ options, registration, error }: Props) {
  return (
    <div>
      <div className="flex flex-col gap-3.5">
        {options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-3 text-sm text-slate-700"
          >
            <input
              type="checkbox"
              value={option}
              {...registration}
              className="h-4 w-4 shrink-0 rounded border-slate-300 accent-slate-700"
            />
            {option}
          </label>
        ))}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
