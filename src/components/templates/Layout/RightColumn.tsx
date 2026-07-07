"use client";

import { usePathname } from "next/navigation";
import SocialLinks from "./SocialLinks";
import ThemeToggle from "./ThemeToggle";
import styles from "./layout.module.scss";

/**
 * Renders the desktop right-side rail with theme controls and social links.
 */
export default function RightColumn() {
  const pathname = usePathname();
  const isLab = pathname.startsWith("/lab") || pathname.startsWith("/about");

  return (
    <aside className={`${styles.rightColumn} ${isLab ? styles.autoHide : ""}`}>
      {/* No Magnetic wrapper (it suppresses the global blob envelope), but
          the plain div must stay: the rail is pointer-events: none with a
          `> *` re-enable, and Button's `all: unset` would inherit the rail's
          none if the button were the direct child. */}
      <div>
        <ThemeToggle />
      </div>

      <div className={styles.divider}></div>

      <SocialLinks />
    </aside>
  );
}
