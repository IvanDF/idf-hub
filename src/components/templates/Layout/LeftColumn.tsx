"use client";

import AudioToggle from "@/components/atoms/audio-toggle";
import Button from "@/components/atoms/button";
import GlitchText from "@/components/atoms/glitch-text";
import Text from "@/components/atoms/text";
import { navItems } from "@/data/nav";
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
          {navItems.map(({ href, label }, i) => (
            <Link
              key={href}
              href={href}
              className={`${styles.navLink} ${isActive(href) ? styles.navLinkActive : ""}`}
            >
              {i + 1}. {label}
            </Link>
          ))}
        </div>
      </nav>

      <div className={styles.divider}></div>

      <footer className={styles.footer}>
        <AudioToggle />

        <div className={styles.name}>
          <GlitchText text="IVAN DEL FATTI" />
        </div>

        <Button
          variant="ghost"
          stamp={false}
          onClick={() =>
            window.dispatchEvent(
              new KeyboardEvent("keydown", { key: "k", metaKey: true }),
            )
          }
        >
          <GlitchText text="<_" className={styles.prompt} />
          <Text as="span" variant="label" className={styles.cmdKey}>
            ⌘K
          </Text>
          <Text as="span" variant="label" className={styles.cmdLabel}>
            to explore
          </Text>
        </Button>
      </footer>
    </aside>
  );
}
