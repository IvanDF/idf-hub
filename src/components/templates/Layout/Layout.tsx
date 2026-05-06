"use client";

import Terminal from "@/components/organisms/Terminal";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./layout.module.scss";
import LeftColumn from "./LeftColumn";
import MobileNav from "./MobileNav";
import RightColumn from "./RightColumn";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <div
      className={styles.container}
      data-mobile-menu={mobileMenuOpen ? "open" : undefined}
    >
      <Terminal />
      <MobileNav
        isOpen={mobileMenuOpen}
        onToggle={() => setMobileMenuOpen((prev) => !prev)}
        onClose={() => setMobileMenuOpen(false)}
      />
      <LeftColumn />
      <main className={styles.main} data-fus-target="main">{children}</main>
      <RightColumn />
    </div>
  );
}
