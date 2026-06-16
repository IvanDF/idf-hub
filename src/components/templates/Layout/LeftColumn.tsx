"use client";

import AudioToggle from "@/components/atoms/audio-toggle";
import GlitchText from "@/components/atoms/glitch-text";
import Magnetic from "@/components/atoms/magnetic";
import RotatingTitle from "@/components/atoms/rotating-title";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./layout.module.scss";

export default function LeftColumn() {
  const pathname = usePathname();
  const isLab = pathname.startsWith("/lab") || pathname.startsWith("/about");

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside className={`${styles.leftColumn} ${isLab ? styles.autoHide : ""}`}>
      {/* Command Palette Trigger */}
      <nav className={styles.navbar}>
        <Magnetic>
          <button
            className={styles.terminalLink}
            onClick={() => {
              const event = new KeyboardEvent("keydown", {
                key: "k",
                metaKey: true,
              });
              window.dispatchEvent(event);
            }}
          >
            <span className={styles.prompt}>&lt;_</span>
            <span className={styles.label}>cmd</span>
          </button>
        </Magnetic>

        {/* Site nav */}
        <div className={styles.siteNav}>
          <Link
            href="/"
            className={`${styles.navLink} ${isActive("/") ? styles.navLinkActive : ""}`}
          >
            Home
          </Link>
          <Link
            href="/lab"
            className={`${styles.navLink} ${isActive("/lab") ? styles.navLinkActive : ""}`}
          >
            Work
          </Link>
          <Link
            href="/about"
            className={`${styles.navLink} ${isActive("/about") ? styles.navLinkActive : ""}`}
          >
            About
          </Link>
        </div>

        <span className={styles.cmdHint}>⌘K to explore</span>
      </nav>

      {/* Divider */}
      <div className={styles.divider}></div>

      {/* Footer: Name + Role + Audio */}
      <footer className={styles.footer}>
        <AudioToggle />

        <div className={styles.name}>
          <GlitchText text="IVAN DEL FATTI" />
        </div>

        <RotatingTitle className={styles.role} />
      </footer>
    </aside>
  );
}
