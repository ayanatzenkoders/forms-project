import { forwardRef } from "react";

/* Multi-line version of TextField (Favourite Quote, Address, ...). */
interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

const TextAreaField = forwardRef<HTMLTextAreaElement, Props>(
  function TextAreaField({ label, error, className = "", ...props }, ref) {
    return (
      <div>
        <div
          className={`rounded-lg bg-[#F4F6F8] px-3 py-2 ring-1 transition ${
            error
              ? "ring-red-400"
              : "ring-transparent focus-within:ring-[#1B75BC]"
          }`}
        >
          <label className="block text-[11px] font-medium text-slate-500">
            {label}
          </label>
          <textarea
            ref={ref}
            rows={2}
            {...props}
            className={`w-full resize-none bg-transparent text-sm text-slate-800 outline-none ${className}`}
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

export default TextAreaField;
