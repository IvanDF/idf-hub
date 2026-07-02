"use client";

import { useAudio } from "@/context/AudioContext";
import { useTheme } from "@/context/ThemeContext";
import { useVoiceShoutContext } from "@/context/VoiceShoutContext";
import { useCommandDeepLink } from "@/hooks/terminal/useCommandDeepLink";
import { useTerminalCommands } from "@/hooks/terminal/useTerminalCommands";
import { useTerminalInput } from "@/hooks/terminal/useTerminalInput";
import { useTerminalKeyboard } from "@/hooks/terminal/useTerminalKeyboard";
import {
  ADMIN_COMMANDS,
  ASCII_ART,
  OPEN_COMMANDS,
  PROJECT_CATEGORIES,
  SEARCH_COMMANDS,
  VALID_COMMANDS,
} from "@/lib/terminal/Terminal.constants";
import type { HistoryItem } from "@/types/terminal";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import SnakeGame from "./SnakeGame";
import styles from "./Terminal.module.scss";
import TerminalHeader from "./TerminalHeader";
import TerminalHistoryItem from "./TerminalHistoryItem";
import TerminalInput from "./TerminalInput";
import TerminalOverlay from "./TerminalOverlay";
import TerminalQuickCommands from "./TerminalQuickCommands";

/** Returns false on mobile (≤768 px) to avoid force-opening the software keyboard. */
function shouldAutoFocus(): boolean {
  return (
    typeof window !== "undefined" &&
    !window.matchMedia("(max-width: 768px)").matches
  );
}

/** Maps easter egg IDs to ASCII art keys where they differ. */
function getAsciiId(eggId: string): string {
  return (
    ({ playbook: "playbook", ragnar: "ragnar" } as Record<string, string>)[
      eggId
    ] ?? eggId
  );
}

/**
 * Delay (ms) before executing a deep-link command after the terminal opens.
 * Allows the open animation (~0.3 s) to complete and the initial history
 * render to settle before running the command.
 */
const DEEP_LINK_EXECUTION_DELAY_MS = 200;

export default function Terminal({
  context = "site",
}: {
  context?: "site" | "admin";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isFirstOpen, setIsFirstOpen] = useState(true);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [discoveredEggs, setDiscoveredEggs] = useState<Set<string>>(new Set());
  const [completionData, setCompletionData] = useState<{
    ids: string[];
    categories: string[];
  }>({
    ids: [],
    categories: PROJECT_CATEGORIES,
  });
  const [gameActive, setGameActive] = useState(false);
  const [asciiFrame, setAsciiFrame] = useState(0);
  const [lastEasterEgg, setLastEasterEgg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { toggleTheme, superDarkMode } = useTheme();
  const { playType, playCommand, playError, playEasterEgg, playLightOn } =
    useAudio();
  const {
    isListening,
    transcript,
    sessionId,
    error: voiceError,
    detectedLevel,
  } = useVoiceShoutContext();

  const discoverEgg = useCallback((eggId: string) => {
    setDiscoveredEggs((prev) => {
      if (prev.has(eggId)) return prev;
      const next = new Set(prev);
      next.add(eggId);
      return next;
    });
  }, []);

  // Persist / restore discovered eggs
  useEffect(() => {
    const saved = localStorage.getItem("idf-easter-eggs");
    if (saved) {
      try {
        setDiscoveredEggs(new Set(JSON.parse(saved)));
      } catch {
        /* ignore */
      }
    }
  }, []);
  useEffect(() => {
    localStorage.setItem(
      "idf-easter-eggs",
      JSON.stringify([...discoveredEggs]),
    );
  }, [discoveredEggs]);
  useEffect(() => {
    if (superDarkMode) discoverEgg("theme_toggle");
  }, [superDarkMode, discoverEgg]);

  // Fetch project IDs + categories for smart autocomplete
  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data: { id: string; category: string }[]) => {
        if (!Array.isArray(data)) return;
        setCompletionData({
          ids: data.map((p) => p.id),
          categories: [...new Set(data.map((p) => p.category.toLowerCase()))],
        });
      })
      .catch(() => {});
  }, []);

  useTerminalKeyboard({
    isOpen,
    setIsOpen,
    toggleTheme,
    playLightOn,
    router,
    discoverEgg,
    playEasterEgg,
  });

  // Admin terminal is always open on mount
  useEffect(() => {
    if (context === "admin") setIsOpen(true);
  }, [context]);

  // ASCII art animation for easter eggs
  const getAsciiArt = (eggId: string): string[] => {
    const art = ASCII_ART[getAsciiId(eggId)];
    if (!art?.length) return [];
    return art[asciiFrame % art.length].map((line) => `   ${line}`);
  };
  useEffect(() => {
    const asciiId = getAsciiId(lastEasterEgg ?? "");
    if (!lastEasterEgg || !ASCII_ART[asciiId]) return;
    const art = ASCII_ART[asciiId];
    const interval = setInterval(() => {
      setAsciiFrame((prev) => {
        if (prev >= art.length - 1) {
          setLastEasterEgg(null);
          return 0;
        }
        return prev + 1;
      });
    }, 250);
    return () => clearInterval(interval);
  }, [lastEasterEgg]);

  const WELCOME_MESSAGE: HistoryItem =
    context === "admin"
      ? {
          command: "",
          output: [
            { type: "system", content: "┌── idf-hub :: admin terminal ──" },
            {
              type: "text",
              content: "list — projects  │  add — new  │  status — stats",
            },
            {
              type: "text",
              content: "logout — sign out  │  site — back to site",
            },
            {
              type: "text",
              content: "type 'help' for all commands",
              cta: { label: "→ help", cmd: "help" },
            },
          ],
        }
      : {
          command: "",
          output: [
            { type: "system", content: "IDF OS v3.0" },
            {
              type: "text",
              content: "Welcome. Tap [→] to run commands.",
              cta: { label: "→ help", cmd: "help" },
            },
            {
              type: "text",
              content: "lab — projects  │  search — find  │  theme — toggle",
            },
            {
              type: "text",
              content: "admin — dashboard  │  whoami — auth status",
            },
            { type: "text", content: "⟁  joor zah frul...  ⟁" },
          ],
        };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (shouldAutoFocus()) inputRef.current?.focus();
        if (isFirstOpen) {
          setHistory([WELCOME_MESSAGE]);
          setIsFirstOpen(false);
        }
        if (terminalBodyRef.current)
          terminalBodyRef.current.scrollTop =
            terminalBodyRef.current.scrollHeight;
      }, 100);
    } else {
      setIsFirstOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isFirstOpen]);

  useEffect(() => {
    if (terminalBodyRef.current)
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
  }, [history, transcript, isListening, voiceError]);

  const { executeCommand } = useTerminalCommands({
    router,
    toggleTheme,
    playLightOn,
    playError,
    playEasterEgg,
    discoveredEggs,
    discoverEgg,
    setHistory,
    setCommandHistory,
    setHistoryIndex,
    setLastEasterEgg,
    setAsciiFrame,
    setIsOpen,
    context,
    setGameActive,
    getAuthUser: async () => {
      const res = await fetch("/api/auth/me");
      const { user } = await res.json();
      return user ? { email: user.email } : null;
    },
    signOut: async () => {
      await fetch("/api/auth/logout", { method: "POST" });
    },
  });

  // Deep link: parse ?cmd= on mount and auto-execute
  const { pendingCommand, clearPendingCommand } = useCommandDeepLink();
  const deepLinkCmdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pendingCommand) return;
    deepLinkCmdRef.current = pendingCommand;
    clearPendingCommand();
    setIsOpen(true);
  }, [pendingCommand, clearPendingCommand]);

  useEffect(() => {
    if (isOpen && deepLinkCmdRef.current) {
      const cmd = deepLinkCmdRef.current;
      deepLinkCmdRef.current = null;
      setTimeout(() => executeCommand(cmd), DEEP_LINK_EXECUTION_DELAY_MS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Inline autocomplete suggestion
  const suggestion = (() => {
    if (!input?.trim()) return "";
    const lo = input.toLowerCase();
    const cmds = context === "admin" ? ADMIN_COMMANDS : VALID_COMMANDS;
    const spaceIdx = lo.indexOf(" ");
    if (spaceIdx !== -1) {
      const cmd = lo.slice(0, spaceIdx);
      const partial = lo.slice(spaceIdx + 1);
      if (partial && OPEN_COMMANDS.includes(cmd)) {
        const match = completionData.ids.find(
          (id) => id.startsWith(partial) && id.length > partial.length,
        );
        if (match) return `${cmd} ${match}`;
      }
      if (partial && SEARCH_COMMANDS.includes(cmd)) {
        const pool = [...completionData.categories, ...completionData.ids];
        const match = pool.find(
          (c) =>
            c.toLowerCase().startsWith(partial) && c.length > partial.length,
        );
        if (match) return `${cmd} ${match.toLowerCase()}`;
      }
      return "";
    }
    return cmds.find((c) => c.startsWith(lo) && c.length > lo.length) ?? "";
  })();

  const { submitCurrentInput, handleInputKeyDown } = useTerminalInput({
    input,
    setInput,
    commandHistory,
    historyIndex,
    setHistoryIndex,
    suggestion,
    executeCommand,
    playCommand,
  });

  if (!isOpen) return null;

  const executeQuickCommand = (cmd: string) => {
    setInput(cmd);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <TerminalOverlay onClose={() => setIsOpen(false)}>
      <div
        className={`${styles.terminalContainer} ${context === "admin" ? styles.admin : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <TerminalHeader />

        <div className={styles.terminalBody} ref={terminalBodyRef}>
          {gameActive ? (
            <SnakeGame
              onExit={(score) => {
                setGameActive(false);
                setHistory((prev) => [
                  // eslint-disable-next-line max-lines
                  ...prev,
                  {
                    command: "snake",
                    output: [
                      { type: "system", content: "Game over." },
                      {
                        type: score > 0 ? "success" : "text",
                        content: `Final score: ${score}`,
                      },
                      {
                        type: "text",
                        content: "Type 'snake' to play again.",
                        cta: { label: "→ play again", cmd: "snake" },
                      },
                    ],
                  },
                ]);
              }}
            />
          ) : (
            <>
              {history.map((item, index) => (
                <TerminalHistoryItem
                  key={index}
                  item={item}
                  onExecuteCommand={executeQuickCommand}
                />
              ))}
              {lastEasterEgg && ASCII_ART[getAsciiId(lastEasterEgg)] && (
                <pre className={styles.asciiArt}>
                  {getAsciiArt(lastEasterEgg).join("\n")}
                </pre>
              )}

              {/* ── Voice / Thu'um inline block ─────────────────────── */}
              {(isListening || voiceError) && (
                <div
                  className={`${styles.voiceBlock}${voiceError ? ` ${styles.voiceBlockError}` : ""}`}
                >
                  <div className={styles.voiceHeader}>
                    {!voiceError && <span className={styles.voiceDot} />}
                    <span>
                      {voiceError
                        ? "[!] Thu\u2019um blocked"
                        : "Speak the Thu\u2019um, Dovahkiin\u2026"}
                    </span>
                  </div>

                  {isListening && (
                    <>
                      <div className={styles.voiceCountdown}>
                        <div
                          key={sessionId}
                          className={styles.voiceCountdownFill}
                        />
                      </div>

                      {/* Transcript visible only in admin context for debugging */}
                      {context === "admin" && (
                        <div className={styles.voiceTranscript}>
                          <span className={styles.voiceTranscriptLabel}>
                            ● REC
                          </span>
                          <span className={styles.voiceTranscriptText}>
                            {transcript || "\u2026"}
                          </span>
                        </div>
                      )}

                      <div className={styles.voiceHints}>
                        <span
                          className={
                            detectedLevel && detectedLevel >= 1
                              ? styles.voiceHintActive
                              : undefined
                          }
                        >
                          fus
                        </span>
                        {" \u00b7 "}
                        <span
                          className={
                            detectedLevel && detectedLevel >= 2
                              ? styles.voiceHintActive
                              : undefined
                          }
                        >
                          fus ro
                        </span>
                        {" \u00b7 "}
                        <span
                          className={
                            detectedLevel && detectedLevel >= 3
                              ? styles.voiceHintActive
                              : undefined
                          }
                        >
                          fus ro dah
                        </span>
                      </div>
                    </>
                  )}

                  {voiceError && (
                    <div className={styles.voiceError}>
                      {voiceError === "network-error"
                        ? "Chrome speech API needs HTTPS — works on production, not plain localhost."
                        : voiceError}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <TerminalQuickCommands
          context={context}
          onCommand={executeQuickCommand}
        />
        <TerminalInput
          ref={inputRef}
          value={input}
          suggestion={suggestion}
          context={context}
          onChange={(v) => {
            setInput(v);
            if (v.length > 0) playType();
          }}
          onKeyDown={handleInputKeyDown}
          onSubmit={submitCurrentInput}
        />
      </div>
    </TerminalOverlay>
  );
}
