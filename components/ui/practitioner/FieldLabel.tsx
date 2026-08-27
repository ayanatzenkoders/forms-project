/*
 * Label that sits ABOVE the input (the practitioner design), with the red
 * asterisk for required fields.
 */
export default function FieldLabel({
  children,
  required = false,
  size = "sm",
}: {
  children: React.ReactNode;
  required?: boolean;
  size?: "sm" | "lg";
}) {
  return (
    <label
      className={
        size === "lg"
          ? "mb-3 block text-lg font-semibold text-slate-900"
          : "mb-1.5 block text-sm text-slate-700"
      }
    >
      {children}
      {required && <span className="text-red-500"> *</span>}
    </label>
  );
}
