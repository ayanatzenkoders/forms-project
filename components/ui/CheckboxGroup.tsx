import { UseFormRegisterReturn } from "react-hook-form";

/*
 * A list of checkboxes that all feed ONE array field (e.g. specializations).
 *
 * `registration` is whatever register("specializations") returns. We spread it
 * onto every checkbox: react-hook-form sees several inputs sharing a name, each
 * with its own `value`, and collects the ticked ones into an array for us.
 */
interface Props {
  label: string;
  options: string[];
  registration: UseFormRegisterReturn;
  error?: string;
}

export default function CheckboxGroup({
  label,
  options,
  registration,
  error,
}: Props) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-medium text-slate-500">{label}</p>

      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#F4F6F8] px-3 py-2 text-xs text-slate-700 transition hover:bg-[#EDF1F5]"
          >
            <input
              type="checkbox"
              value={option}
              {...registration}
              className="h-3.5 w-3.5 accent-[#1B75BC]"
            />
            {option}
          </label>
        ))}
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
