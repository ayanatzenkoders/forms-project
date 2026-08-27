import { forwardRef } from "react";
import FieldLabel from "./FieldLabel";

/*
 * Bordered white input with the label above it (practitioner style).
 * forwardRef so react-hook-form's register() ref reaches the real <input>.
 */
interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  error?: string;
}

const TextInput = forwardRef<HTMLInputElement, Props>(function TextInput(
  { label, required, error, className = "", ...props },
  ref,
) {
  // we passed register("bsbNumber") which under the hood send as an object: {
  //   name: "bsbNumber",
  //   onChange: f(),
  //   onBlur: f(),
  //   ref: f()
  // } Now we also send other props label and placeholder.
  // Now react take all of these and encapsulate it in object.
  //   {
  //   label: "BSB Number",
  //   placeholder: "Enter BSB Number",
  //   name: "bsbNumber",       // from register()
  //   onChange: f(),           // from register()
  //   onBlur: f(),             // from register()
  //   ref: f()                 // from register().
  // }
  // Then: react extract it and pass it to forwardRef. Then we attach it with input tag as ref={ref}
  // & ...prop colelct everything remaining include: placeholder, name, onChange, onBlur
  return (
    <div>
      {label && <FieldLabel required={required}>{label}</FieldLabel>}
      <input
        ref={ref}
        {...props}
        className={`w-full rounded-lg border bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-500 ${
          error ? "border-red-400" : "border-slate-200"
        } ${className}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default TextInput;
