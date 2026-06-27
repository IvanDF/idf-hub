"use client";

import Magnetic from "@/components/atoms/magnetic";
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
      <Magnetic>
        <ThemeToggle />
      </Magnetic>

      <div className={styles.divider}></div>

      <SocialLinks />
    </aside>
  );
}
