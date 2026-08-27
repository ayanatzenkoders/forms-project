import { forwardRef } from "react";

/*
 * A filled input with its label sitting INSIDE the box (as in the design),
 * plus the error message underneath.
 *
 * forwardRef is required: react-hook-form's register() hands back a `ref` that
 * must reach the real <input>. Without forwardRef the ref would stop at this
 * wrapper component and RHF could not read the field's value.
 *
 * Usage:  <TextField label="Age" error={errors.age?.message}
 *                    {...register("age", { valueAsNumber: true })} />
 */
interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const TextField = forwardRef<HTMLInputElement, Props>(function TextField(
  { label, error, className = "", ...inputProps },
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
        <input
          ref={ref}
          {...inputProps}
          // bg-transparent + outline-none so the grey wrapper provides the look
          className={`w-full bg-transparent text-sm text-slate-800 outline-none ${className}`}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default TextField;
