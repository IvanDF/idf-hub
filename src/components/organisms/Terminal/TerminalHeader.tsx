"use client";

import styles from "./Terminal.module.scss";

interface TerminalHeaderProps {
  title?: string;
}

export default function TerminalHeader({
  title = "IDF OS",
}: TerminalHeaderProps) {
  return (
    <div className={styles.terminalHeader}>
      <span className={styles.terminalTitle}>{title}</span>
    </div>
  );
}
