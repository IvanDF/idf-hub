"use client";

import Terminal from "@/components/organisms/Terminal";
import { usePathname } from "next/navigation";
import styles from "./layout.module.scss";
import LeftColumn from "./LeftColumn";
import RightColumn from "./RightColumn";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Business card landing page — fullscreen immersive canvas, no chrome
  if (pathname?.startsWith("/business-card")) {
    return <>{children}</>;
  }

  // Admin routes get terminal with admin context — no sidebar or columns
  if (pathname?.startsWith("/admin")) {
    return (
      <>
        <Terminal context="admin" />
        {children}
      </>
    );
  }

  return (
    <div className={styles.container}>
      <Terminal />
      <LeftColumn />
      <main className={styles.main} data-fus-target="main">{children}</main>
      <RightColumn />
    </div>
  );
}
