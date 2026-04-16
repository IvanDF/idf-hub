"use client";

import styles from "./Terminal.module.scss";
import { forwardRef } from "react";

interface TerminalInputProps {
  value: string;
  suggestion?: string;
  context?: 'site' | 'admin';
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(
  ({ value, suggestion, context = 'site', onChange, onKeyDown, onSubmit }, ref) => {
    const ghostSuffix =
      suggestion && value && suggestion.startsWith(value.toLowerCase())
        ? suggestion.slice(value.length)
        : "";

    const placeholder = ghostSuffix
      ? "tab to complete"
      : context === 'admin'
        ? "list · add · status · tab to complete"
        : "help · lab · open · tab to complete";

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
            placeholder={placeholder}
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
