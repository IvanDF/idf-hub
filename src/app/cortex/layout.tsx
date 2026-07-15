import type { Metadata } from "next";

// The cortex page is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "The Cortex Lab",
  description:
    "A hidden lab of real cognitive tests — reaction time, Stroop interference, and sequence memory.",
  alternates: { canonical: "/cortex" },
  robots: { index: false, follow: false },
};

export default function CortexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
