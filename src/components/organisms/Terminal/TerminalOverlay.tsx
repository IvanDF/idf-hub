"use client";

import styles from "./Terminal.module.scss";

interface TerminalOverlayProps {
  onClose: () => void;
  children: React.ReactNode;
}

export default function TerminalOverlay({ onClose, children }: TerminalOverlayProps) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      {children}
    </div>
  );
}
