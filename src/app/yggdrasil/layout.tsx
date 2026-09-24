import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yggdrasil",
  description:
    "A home server designed around one person's day: the house, the notes, the training plan and the backups, on hardware I own.",
  alternates: { canonical: "/yggdrasil" },
};

export default function YggdrasilLayout({ children }: { children: React.ReactNode }) {
  return children;
}
