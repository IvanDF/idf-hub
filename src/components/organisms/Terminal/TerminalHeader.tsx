"use client";

import styles from "./Terminal.module.scss";

interface TerminalHeaderProps {
  title?: string;
  onClose?: () => void;
}

export default function TerminalHeader({ 
  title = "IDF OS", 
  onClose 
}: TerminalHeaderProps) {
  return (
    <div className={styles.terminalHeader}>
      <span className={styles.terminalTitle}>{title}</span>
      {onClose && (
        <button 
          type="button" 
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close terminal"
        />
      )}
    </div>
  );
}
