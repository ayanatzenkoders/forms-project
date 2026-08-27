import { forwardRef } from "react";

/* Label above, bordered input below - the MilCoach style. */
interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  error?: string;
}

const TextField = forwardRef<HTMLInputElement, Props>(function TextField(
  { label, required, error, className = "", ...props },
  ref,
) {
  return (
    <div>
      <label className="mb-1 block text-xs text-slate-600">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        ref={ref}
        {...props}
        className={`w-full rounded-md border bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#6DBE45] ${
          error ? "border-red-400" : "border-slate-200"
        } ${className}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default TextField;
