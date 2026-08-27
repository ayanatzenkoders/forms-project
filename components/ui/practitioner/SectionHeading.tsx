/* Big section title inside the card, e.g. "Personal Details". */
export default function SectionHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h2 className="text-xl font-bold text-slate-900">{children}</h2>
  );
}
