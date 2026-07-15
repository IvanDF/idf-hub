"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Identity, { openCommandPalette } from "./Identity";
import SiteNav from "./SiteNav";
import SocialLinks from "./SocialLinks";
import ThemeToggle from "./ThemeToggle";
import styles from "./layout.module.scss";

/**
 * Mobile chrome: a carved burger that opens a full-screen overlay mirroring the
 * desktop rails. It composes the exact same shared components (SiteNav,
 * Identity, ThemeToggle, SocialLinks) — no duplicated markup, logic, or styles.
 */
export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);

  // Close the overlay on route change by adjusting state during render
  // (React's recommended pattern) rather than a cascading setState-in-effect.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setIsOpen(false);
  }

  const close = () => setIsOpen(false);

  // Lock body scroll while the overlay is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          className={styles.terminalFab}
          onClick={openCommandPalette}
          aria-label="Open terminal"
        >
          {">_"}
        </button>
      )}

      <button
        type="button"
        className={`${styles.burger} ${isOpen ? styles.burgerOpen : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {isOpen && (
        <div className={styles.overlay} role="dialog" aria-modal="true">
          <div className={styles.overlayHead}>
            <ThemeToggle />
          </div>

          <div className={styles.overlayCenter}>
            <SiteNav onNavigate={close} showIndex={false} />
          </div>

          <div className={styles.overlayFoot}>
            <Identity onCommand={close} showShortcut={false} />
            <SocialLinks />
          </div>
        </div>
      )}
    </>
  );
}
