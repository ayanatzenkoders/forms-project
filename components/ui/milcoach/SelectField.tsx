import { forwardRef } from "react";

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  required?: boolean;
  error?: string;
}

const SelectField = forwardRef<HTMLSelectElement, Props>(function SelectField(
  { label, required, error, children, className = "", ...props },
  ref,
) {
  return (
    <div>
      <label className="mb-1 block text-xs text-slate-600">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <select
        ref={ref}
        {...props}
        className={`w-full rounded-md border bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#6DBE45] ${
          error ? "border-red-400" : "border-slate-200"
        } ${className}`}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default SelectField;
