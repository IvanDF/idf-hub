import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "iDF Brand",
  robots: { index: false, follow: false },
};

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
