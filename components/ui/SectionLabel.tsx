/* Small group heading inside a card, e.g. "Basic information" / "Address Details". */
export default function SectionLabel({ children }: { children: string }) {
  return (
    <p className="pt-2 text-xs font-semibold text-slate-700">{children}</p>
  );
}
