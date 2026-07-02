import type { Metadata } from "next";

// The time machine page is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "Time Machine",
  description:
    "A journey through the past versions of the iDF hub, from the first commit to today.",
  alternates: { canonical: "/time-machine" },
};

export default function TimeMachineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
