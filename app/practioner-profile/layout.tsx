import { PractionerProvider } from "@/context/PractitionerContext";

export default function JadeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PractionerProvider>{children}</PractionerProvider>;
}
