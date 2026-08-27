import { UseFormRegisterReturn } from "react-hook-form";

/*
 * The "System Issues" style pills: a bordered chip per option that turns dark
 * navy with white text once ticked.
 *
 * `selected` comes from watch(fieldName) in the page. We need it purely for
 * STYLING - react-hook-form already tracks the real value through
 * `registration`. The chips wrap naturally so long labels take a whole row,
 * matching the design.
 */
interface Props {
  options: string[];
  registration: UseFormRegisterReturn;
  selected: string[];
  error?: string;
}

export default function CheckboxChips({
  options,
  registration,
  selected,
  error,
}: Props) {
  return (
    <div>
      <div className="flex flex-wrap gap-2.5">
        {options.map((option) => {
          const isOn = selected.includes(option);
          return (
            <label
              key={option}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-xs transition ${
                isOn
                  ? "border-slate-800 bg-slate-800 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              <input
                type="checkbox"
                value={option}
                {...registration}
                className="h-3.5 w-3.5 accent-white"
              />
              {option}
            </label>
          );
        })}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
