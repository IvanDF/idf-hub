"use client";

import { socials } from "@/data/nav";
import styles from "./layout.module.scss";

/**
 * Typographic social-handle list — shared by the desktop right rail and the
 * mobile overlay.
 */
export default function SocialLinks() {
  return (
    <nav className={styles.socialLinks} aria-label="Social links">
      {socials.map(({ href, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
