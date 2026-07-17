"use client";

import { usePathname } from "next/navigation";
import Identity from "./Identity";
import SiteNav from "./SiteNav";
import styles from "./layout.module.scss";

export default function LeftColumn() {
  const pathname = usePathname();
  // Immersive routes collapse the rail to its scribed peek line
  const autoHide =
    pathname.startsWith("/lab") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/time-machine");

  return (
    <aside className={`${styles.leftColumn} ${autoHide ? styles.autoHide : ""}`}>
      <SiteNav />
      <div className={styles.divider}></div>
      <Identity />
    </aside>
  );
}
