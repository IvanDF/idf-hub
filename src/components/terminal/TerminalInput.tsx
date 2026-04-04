"use client";

import styles from "@/components/home/Terminal.module.scss";
import { forwardRef } from "react";

interface TerminalInputProps {
  value: string;
  suggestion?: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(
  ({ value, suggestion, onChange, onKeyDown, onSubmit }, ref) => {
    const ghostSuffix =
      suggestion && value && suggestion.startsWith(value.toLowerCase())
        ? suggestion.slice(value.length)
        : "";

    return (
      <div className={styles.inputArea}>
        <span className={styles.prompt}>{">"}</span>
        <div className={styles.inputWrapper}>
          {ghostSuffix && (
            <span className={styles.ghostSuggestion} aria-hidden="true">
              {value}
              <span className={styles.ghostSuffix}>{ghostSuffix}</span>
            </span>
          )}
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
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
        <button
          type="button"
          className={styles.sendButton}
          onClick={onSubmit}
          aria-label="Send command"
        >
          Send
        </button>
      </div>
    );
  },
);

TerminalInput.displayName = "TerminalInput";

export default TerminalInput;
