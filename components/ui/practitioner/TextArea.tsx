import { forwardRef } from "react";
import FieldLabel from "./FieldLabel";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
  error?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, Props>(function TextArea(
  { label, required, error, className = "", ...props },
  ref,
) {
  return (
    <div>
      {label && <FieldLabel required={required}>{label}</FieldLabel>}
      <textarea
        ref={ref}
        rows={4}
        {...props}
        className={`w-full resize-none rounded-lg border bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-500 ${
          error ? "border-red-400" : "border-slate-200"
        } ${className}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default TextArea;
