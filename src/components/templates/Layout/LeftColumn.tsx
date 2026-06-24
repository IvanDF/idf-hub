"use client";

import Button from "@/components/atoms/button";
import AudioToggle from "@/components/atoms/audio-toggle";
import GlitchText from "@/components/atoms/glitch-text";
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
      <nav className={styles.navbar}>
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
      </nav>

      <div className={styles.divider}></div>

      <footer className={styles.footer}>
        <AudioToggle />

        <div className={styles.name}>
          <GlitchText text="IVAN DEL FATTI" />
        </div>

        <Button
          variant="chrome"
          onClick={() =>
            window.dispatchEvent(
              new KeyboardEvent("keydown", { key: "k", metaKey: true })
            )
          }
        >
          <GlitchText text="<_" className={styles.prompt} />
          <span className={styles.cmdKey}>⌘K</span>
          <span className={styles.cmdLabel}>to explore</span>
        </Button>
      </footer>
    </aside>
  );
}
