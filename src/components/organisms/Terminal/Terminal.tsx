"use client";

import type { HistoryItem } from "./index";
import {
  TerminalHeader,
  TerminalInput,
  TerminalOverlay,
  TerminalQuickCommands,
} from "./index";
import { ASCII_ART, VALID_COMMANDS, ADMIN_COMMANDS, SEARCH_COMMANDS, OPEN_COMMANDS, PROJECT_CATEGORIES } from "./Terminal.constants";
import { useTerminalCommands } from "./useTerminalCommands";
import { useAudio } from "@/context/AudioContext";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Terminal.module.scss";

import { createClient } from "@/lib/supabase/client";

import SnakeGame from "./SnakeGame";

export default function Terminal({ context = 'site' }: { context?: 'site' | 'admin' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isFirstOpen, setIsFirstOpen] = useState(true);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [discoveredEggs, setDiscoveredEggs] = useState<Set<string>>(new Set());
  const [completionData, setCompletionData] = useState<{ ids: string[]; categories: string[] }>({
    ids: [],
    categories: PROJECT_CATEGORIES,
  });
  const [gameActive, setGameActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  const shouldAutoFocusInput = () => {
    if (typeof window === "undefined") return false;
    return !window.matchMedia("(max-width: 768px)").matches;
  };

  const router = useRouter();
  const { toggleTheme, theme, superDarkMode } = useTheme();
  const { playType, playCommand, playError, playEasterEgg, playLightOn } =
    useAudio();

  // Load discovered eggs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("idf-easter-eggs");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDiscoveredEggs(new Set(parsed));
      } catch {
        // Ignore invalid data
      }
    }
  }, []);

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
      .catch(() => {}); // graceful fallback to static categories
  }, []);

  // Save discovered eggs to localStorage
  useEffect(() => {
    localStorage.setItem(
      "idf-easter-eggs",
      JSON.stringify([...discoveredEggs]),
    );
  }, [discoveredEggs]);

  const discoverEgg = useCallback((eggId: string) => {
    setDiscoveredEggs((prev) => {
      if (prev.has(eggId)) return prev;
      const next = new Set(prev);
      next.add(eggId);
      return next;
    });
  }, []);

  useEffect(() => {
    if (superDarkMode) {
      discoverEgg("theme_toggle");
    }
  }, [superDarkMode, discoverEgg]);

  // Konami code listener — real keyboard sequence only, not terminal typing
  useEffect(() => {
    const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
    let pos = 0;
    const handleKonami = (e: KeyboardEvent) => {
      if (e.key === KONAMI[pos]) {
        pos++;
        if (pos === KONAMI.length) {
          pos = 0;
          discoverEgg("konami");
          playEasterEgg("konami");
        }
      } else {
        pos = e.key === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", handleKonami);
    return () => window.removeEventListener("keydown", handleKonami);
  }, [discoverEgg, playEasterEgg]);

  // Global Key Listener for Toggle (Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if not typing in input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      // D key for dark mode toggle
      if (e.key === "d" || e.key === "D") {
        if (!e.metaKey && !e.ctrlKey && !e.altKey) {
          e.preventDefault();
          playLightOn();
          toggleTheme();
        }
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
      // Number keys for navigation
      if (e.key === "1" && !e.metaKey && !e.ctrlKey) {
        router.push("/");
      }
      if (e.key === "2" && !e.metaKey && !e.ctrlKey) {
        router.push("/lab");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, toggleTheme]);

  // Welcome message
  const WELCOME_MESSAGE: HistoryItem = context === 'admin'
    ? {
        command: "",
        output: [
          { type: "system", content: "┌── idf-hub :: admin terminal ──" },
          { type: "text", content: "list — projects  │  add — new  │  status — stats" },
          { type: "text", content: "logout — sign out  │  site — back to site" },
          { type: "text", content: "type 'help' for all commands", cta: { label: "→ help", cmd: "help" } },
        ],
      }
    : {
        command: "",
        output: [
          { type: "system", content: "IDF OS v3.0" },
          { type: "text", content: "Welcome. Tap [→] to run commands.", cta: { label: "→ help", cmd: "help" } },
          { type: "text", content: "lab — projects  │  search — find  │  theme — toggle" },
          { type: "text", content: "admin — dashboard  │  whoami — auth status" },
        ],
      };

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        // On mobile we avoid forcing keyboard open immediately.
        if (shouldAutoFocusInput()) {
          inputRef.current?.focus();
        }
        if (isFirstOpen) {
          setHistory([WELCOME_MESSAGE]);
          setIsFirstOpen(false);
        }
        if (terminalBodyRef.current) {
          terminalBodyRef.current.scrollTop =
            terminalBodyRef.current.scrollHeight;
        }
      }, 100);
    } else {
      // Reset when closed
      setIsFirstOpen(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isFirstOpen]);

  // Auto-scroll
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history]);

  // State for ASCII animation frame
  const [asciiFrame, setAsciiFrame] = useState(0);
  const [lastEasterEgg, setLastEasterEgg] = useState<string | null>(null);

  // Mapping easter egg ID → ASCII art ID
  const getAsciiId = (eggId: string): string => {
    const mapping: Record<string, string> = {
      playbook: "playbook",
      ragnar: "ragnar",
    };
    return mapping[eggId] || eggId;
  };

  // Animate ASCII art for easter eggs
  useEffect(() => {
    const asciiId = getAsciiId(lastEasterEgg || "");
    if (lastEasterEgg && ASCII_ART[asciiId]) {
      const art = ASCII_ART[asciiId];
      const maxFrames = art.length; // 1 loop then stop
      const interval = setInterval(() => {
        setAsciiFrame((prev) => {
          if (prev >= maxFrames - 1) {
            setLastEasterEgg(null);
            return 0;
          }
          return prev + 1;
        });
      }, 250);
      return () => clearInterval(interval);
    }
  }, [lastEasterEgg]);

  // Helper to get ASCII art for an egg (with animation frames)
  const getAsciiArt = (eggId: string): string[] => {
    const art = ASCII_ART[getAsciiId(eggId)];
    if (!art || art.length === 0) return [];
    const frameIndex = asciiFrame % art.length;
    return art[frameIndex].map((line) => `   ${line}`);
  };

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
    setGameActive,
    getAsciiArt,
    context,
    getAuthUser: async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      return user ? { email: user.email } : null;
    },
    signOut: async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
    },
  });
  const submitCurrentInput = useCallback(() => {
    const value = input.trim();
    if (!value) return;

    playCommand();
    executeCommand(value);
    setInput("");
  }, [input, playCommand, executeCommand]);

  // Compute inline autocomplete suggestion (commands + project IDs + categories)
  const suggestion = (() => {
    if (!input || !input.trim()) return "";
    const inputLower = input.toLowerCase();
    const cmds = context === 'admin' ? ADMIN_COMMANDS : VALID_COMMANDS;

    // Multi-word: "open <partial-id>" or "search <partial-category-or-id>"
    const spaceIdx = inputLower.indexOf(" ");
    if (spaceIdx !== -1) {
      const cmd = inputLower.slice(0, spaceIdx);
      const partial = inputLower.slice(spaceIdx + 1);
      if (partial && OPEN_COMMANDS.includes(cmd)) {
        const match = completionData.ids.find(
          (id) => id.startsWith(partial) && id.length > partial.length,
        );
        if (match) return `${cmd} ${match}`;
      }
      if (partial && SEARCH_COMMANDS.includes(cmd)) {
        const pool = [...completionData.categories, ...completionData.ids];
        const match = pool.find(
          (c) => c.toLowerCase().startsWith(partial) && c.toLowerCase().length > partial.length,
        );
        if (match) return `${cmd} ${match.toLowerCase()}`;
      }
      return "";
    }

    // Single word: match commands
    return cmds.find(
      (cmd) => cmd.startsWith(inputLower) && cmd.length > inputLower.length,
    ) || "";
  })();

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      if (suggestion) {
        setInput(suggestion);
      }
    } else if (e.key === "Enter") {
      submitCurrentInput();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
        if (historyIndex === commandHistory.length - 1) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  if (!isOpen) return null;

  const executeQuickCommand = (cmd: string) => {
    const isDraftCommand = cmd.endsWith(" ");
    setInput(cmd);

    if (isDraftCommand) {
      requestAnimationFrame(() => inputRef.current?.focus());
      return;
    }

    setTimeout(() => executeCommand(cmd), 0);
  };

  return (
    <TerminalOverlay onClose={() => setIsOpen(false)}>
      <div
        className={styles.terminalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <TerminalHeader onClose={() => setIsOpen(false)} />

        <div className={styles.terminalBody} ref={terminalBodyRef}>
          {/* Snake Game */}
          {gameActive ? (
            <SnakeGame
              onExit={(score) => {
                setGameActive(false);
                setHistory((prev) => [
                  ...prev,
                  {
                    command: "snake",
                    output: [
                      { type: "system", content: "Game over." },
                      { type: score > 0 ? "success" : "text", content: `Final score: ${score}` },
                      { type: "text", content: "Type 'snake' to play again.", cta: { label: "→ play again", cmd: "snake" } },
                    ],
                  },
                ]);
              }}
            />
          ) : (
            <>
              {/* History */}
              {history.map((item, index) => (
                <div key={index} className={styles.outputArea}>
                  {item.command && (
                    <div className={styles.line}>
                      <span className={styles.prompt}>{">"}</span> {item.command}
                    </div>
                  )}
                  {item.output &&
                    item.output.map((out, i) => (
                      <div key={i} className={`${styles.line} ${styles[out.type]}`}>
                        {out.content}
                        {out.cta && (
                          <button
                            className={styles.ctaBtn}
                            onClick={() => executeQuickCommand(out.cta!.cmd)}
                          >
                            [{out.cta.label}]
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              ))}

              {/* Animated ASCII Art Overlay */}
              {lastEasterEgg && ASCII_ART[getAsciiId(lastEasterEgg)] && (
                <pre className={styles.asciiArt}>
                  {getAsciiArt(lastEasterEgg).join("\n")}
                </pre>
              )}
            </>
          )}
        </div>

        <TerminalQuickCommands context={context} onCommand={executeQuickCommand} />

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
