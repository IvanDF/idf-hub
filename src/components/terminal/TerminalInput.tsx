"use client";

import styles from "@/components/home/Terminal.module.scss";
import { forwardRef } from "react";

interface TerminalInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(
  ({ value, onChange, onKeyDown }, ref) => {
    return (
      <div className={styles.inputArea}>
        <span className={styles.prompt}>{">"}</span>
        <input
          ref={ref}
          type="text"
          className={styles.input}
          value={value}
          placeholder="Type guide, help, or search..."
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    );
  },
);

TerminalInput.displayName = "TerminalInput";

export default TerminalInput;
