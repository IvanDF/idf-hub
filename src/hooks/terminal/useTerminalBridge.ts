"use client";

import {
  TERMINAL_COMMAND_EVENT,
  type TerminalCommandEventDetail,
} from "@/lib/terminal/Terminal.bridge";
import { useEffect, useRef } from "react";

/**
 * The overlay has to mount before a command can render into it — the same
 * reason the `?cmd=` deep link waits before executing.
 */
const COMMAND_EXECUTION_DELAY_MS = 200;

interface UseTerminalBridgeOptions {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  executeCommand: (cmd: string) => Promise<void> | void;
}

/**
 * Lets `window.idf.run()` drive the terminal: opens it on request and runs the
 * command once the overlay is up. A command arriving while the terminal is
 * already open runs straight away.
 */
export function useTerminalBridge({
  isOpen,
  setIsOpen,
  executeCommand,
}: UseTerminalBridgeOptions): void {
  const pendingRef = useRef<string | null>(null);
  const isOpenRef = useRef(isOpen);
  const executeRef = useRef(executeCommand);

  useEffect(() => {
    isOpenRef.current = isOpen;
    executeRef.current = executeCommand;
  });

  useEffect(() => {
    const handleRequest = (event: Event) => {
      const detail = (event as CustomEvent<TerminalCommandEventDetail>).detail;
      const command = detail?.command;
      if (typeof command !== "string") return;
      // Acknowledges the request so the console can report a missing terminal.
      event.preventDefault();

      if (!command.trim()) {
        setIsOpen(true);
        return;
      }
      if (isOpenRef.current) {
        void executeRef.current(command);
        return;
      }
      pendingRef.current = command;
      setIsOpen(true);
    };

    window.addEventListener(TERMINAL_COMMAND_EVENT, handleRequest);
    return () =>
      window.removeEventListener(TERMINAL_COMMAND_EVENT, handleRequest);
  }, [setIsOpen]);

  useEffect(() => {
    if (!isOpen || pendingRef.current === null) return;
    const command = pendingRef.current;
    pendingRef.current = null;
    const timer = setTimeout(
      () => void executeRef.current(command),
      COMMAND_EXECUTION_DELAY_MS,
    );
    return () => clearTimeout(timer);
  }, [isOpen]);
}
