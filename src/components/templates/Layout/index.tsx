"use client";

import Terminal from "@/components/organisms/Terminal/Terminal";
import { useState } from "react";
import styles from "./layout.module.scss";
import LeftColumn from "./LeftColumn";
import MobileNav from "./MobileNav";
import RightColumn from "./RightColumn";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <main className={styles.main}>{children}</main>
      <RightColumn />
    </div>
  );
}
