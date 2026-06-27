"use client";

import { navItems } from "@/data/nav";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./layout.module.scss";

interface SiteNavProps {
  onNavigate?: () => void;
  /** Show the keyboard-shortcut number prefix (desktop rail only). */
  showIndex?: boolean;
}

/**
 * Primary site navigation links — shared by the desktop left rail and the
 * mobile overlay so both render identical markup and styling.
 */
export default function SiteNav({ onNavigate, showIndex = true }: SiteNavProps) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className={styles.navbar}>
      <div className={styles.siteNav}>
        {navItems.map(({ href, label }, i) => (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`${styles.navLink} ${isActive(href) ? styles.navLinkActive : ""}`}
          >
            {showIndex ? `${i + 1}. ` : ""}
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
