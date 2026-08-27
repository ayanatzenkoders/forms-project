import { forwardRef } from "react";

/*
 * Same filled look as TextField, but wrapping a <select>.
 * The <option> elements are passed in as children by each page.
 */
interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
}

const SelectField = forwardRef<HTMLSelectElement, Props>(function SelectField(
  { label, error, children, className = "", ...selectProps },
  ref,
) {
  return (
    <div>
      <div
        className={`rounded-lg bg-[#F4F6F8] px-3 py-2 ring-1 transition ${
          error ? "ring-red-400" : "ring-transparent focus-within:ring-[#1B75BC]"
        }`}
      >
        <label className="block text-[11px] font-medium text-slate-500">
          {label}
        </label>
        <select
          ref={ref}
          {...selectProps}
          className={`w-full bg-transparent text-sm text-slate-800 outline-none ${className}`}
        >
          {children}
        </select>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default SelectField;
