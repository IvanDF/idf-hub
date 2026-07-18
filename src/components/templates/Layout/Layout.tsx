"use client";

import Terminal from "@/components/organisms/Terminal";
import { usePathname } from "next/navigation";
import styles from "./layout.module.scss";
import LeftColumn from "./LeftColumn";
import MobileNav from "./MobileNav";
import RightColumn from "./RightColumn";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Business card landing page — fullscreen immersive canvas, no chrome
  if (pathname?.startsWith("/business-card")) {
    return <>{children}</>;
  }

  // Classified archive — fullscreen, no site chrome (the rails' divider drew
  // a stray line over the scene); its own CTA returns to the surface, and the
  // terminal stays reachable via ⌘K.
  if (pathname?.startsWith("/secrets")) {
    return (
      <>
        <Terminal />
        {children}
      </>
    );
  }

  // Admin routes get terminal with admin context — no sidebar or columns.
  // NOT on the login page though: the always-open terminal used to cover the
  // form, forcing an Esc nobody could guess.
  if (pathname?.startsWith("/admin")) {
    return (
      <>
        {!pathname.startsWith("/admin/login") && <Terminal context="admin" />}
        {children}
      </>
    );
  }

  return (
    <div className={styles.container}>
      <Terminal />
      <MobileNav />
      <LeftColumn />
      <main className={styles.main} data-fus-target="main">{children}</main>
      <RightColumn />
    </div>
  );
}
