"use client";

import { usePathname } from "next/navigation";
import Identity from "./Identity";
import SiteNav from "./SiteNav";
import styles from "./layout.module.scss";

export default function LeftColumn() {
  const pathname = usePathname();
  const isLab = pathname.startsWith("/lab") || pathname.startsWith("/about");

  return (
    <aside className={`${styles.leftColumn} ${isLab ? styles.autoHide : ""}`}>
      <SiteNav />
      <div className={styles.divider}></div>
      <Identity />
    </aside>
  );
}
