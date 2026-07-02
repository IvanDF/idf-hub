import type { Metadata } from "next";

// The lab index is a client component, so its metadata lives here.
// Project pages override this via their own generateMetadata.
export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected projects by Ivan Del Fatti — design, code, and craft: interactive experiments, design systems, plugins, and creative work.",
  alternates: { canonical: "/lab" },
};

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return children;
}
