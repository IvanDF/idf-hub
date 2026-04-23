import { PageTransition } from "@/components/templates/Layout";

export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
