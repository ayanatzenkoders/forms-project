"use client";

/*
 * Pick several values from a fixed list (the "Languages" field).
 * Choosing an option adds a chip; the option then disappears from the list so
 * it cannot be picked twice.
 *
 * Controlled, like TagInput: parent owns `value`, we report changes upward.
 */
interface Props {
  label: string;
  required?: boolean;
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  error?: string;
  placeholder?: string;
}

export default function MultiSelect({
  label,
  required,
  options,
  value,
  onChange,
  error,
  placeholder = "Select",
}: Props) {
  return (
    <div>
      <label className="mb-1 block text-xs text-slate-600">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      <select
        // Always "" so it acts as a picker, not a value holder.
        value=""
        onChange={(e) => {
          const picked = e.target.value;
          if (picked) onChange([...value, picked]);
        }}
        className={`w-full rounded-md border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#6DBE45] ${
          error ? "border-red-400" : "border-slate-200"
        }`}
      >
        <option value="">{placeholder}</option>
        {options
          .filter((option) => !value.includes(option))
          .map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
      </select>

      {value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {value.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 rounded bg-[#EAF7E3] px-2 py-1 text-xs text-[#4F9E2E]"
            >
              {item}
              <button
                type="button"
                onClick={() => onChange(value.filter((v) => v !== item))}
                aria-label={`Remove ${item}`}
                className="text-[#4F9E2E]/60 hover:text-[#4F9E2E]"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
