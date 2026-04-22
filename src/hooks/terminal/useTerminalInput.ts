"use client";

import { useCallback } from "react";

type UseTerminalInputOptions = {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  commandHistory: string[];
  historyIndex: number;
  setHistoryIndex: React.Dispatch<React.SetStateAction<number>>;
  suggestion: string;
  executeCommand: (cmd: string) => Promise<void>;
  playCommand: () => void;
};

type UseTerminalInputReturn = {
  submitCurrentInput: () => void;
  handleInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

/**
 * Manages terminal input submission and keyboard navigation
 * (Enter, Tab completion, ArrowUp/Down command history).
 */
export function useTerminalInput({
  input,
  setInput,
  commandHistory,
  historyIndex,
  setHistoryIndex,
  suggestion,
  executeCommand,
  playCommand,
}: UseTerminalInputOptions): UseTerminalInputReturn {
  const submitCurrentInput = useCallback(() => {
    const value = input.trim();
    if (!value) return;
    playCommand();
    executeCommand(value);
    setInput("");
  }, [input, playCommand, executeCommand, setInput]);

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        if (suggestion) setInput(suggestion);
      } else if (e.key === "Enter") {
        submitCurrentInput();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (commandHistory.length > 0) {
          const newIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
          setHistoryIndex(newIdx);
          setInput(commandHistory[newIdx]);
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex !== -1) {
          if (historyIndex === commandHistory.length - 1) {
            setHistoryIndex(-1);
            setInput("");
          } else {
            const newIdx = Math.min(commandHistory.length - 1, historyIndex + 1);
            setHistoryIndex(newIdx);
            setInput(commandHistory[newIdx]);
          }
        }
      }
    },
    [commandHistory, historyIndex, setHistoryIndex, setInput, suggestion, submitCurrentInput],
  );

  return { submitCurrentInput, handleInputKeyDown };
}
