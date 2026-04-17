"use client";

import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAudio } from "@/context/AudioContext";
import { useTheme } from "@/context/ThemeContext";
import { createClient } from "@/lib/supabase/client";
import { ASCII_ART, ADMIN_COMMANDS, OPEN_COMMANDS, PROJECT_CATEGORIES, SEARCH_COMMANDS, VALID_COMMANDS } from "./Terminal.constants";
import type { HistoryItem } from "./Terminal.types";
import { TerminalHeader, TerminalInput, TerminalOverlay, TerminalQuickCommands } from "./index";
import SnakeGame from "./SnakeGame";
import TerminalHistoryItem from "./TerminalHistoryItem";
import { useTerminalCommands } from "./useTerminalCommands";
import { useTerminalInput } from "./useTerminalInput";
import { useTerminalKeyboard } from "./useTerminalKeyboard";
import styles from "./Terminal.module.scss";

/** Returns false on mobile (≤768 px) to avoid force-opening the software keyboard. */
function shouldAutoFocus(): boolean {
  return typeof window !== "undefined" && !window.matchMedia("(max-width: 768px)").matches;
}

/** Maps easter egg IDs to ASCII art keys where they differ. */
function getAsciiId(eggId: string): string {
  return ({ playbook: "playbook", ragnar: "ragnar" } as Record<string, string>)[eggId] ?? eggId;
}

export default function Terminal({ context = "site" }: { context?: "site" | "admin" }) {
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
  const [asciiFrame, setAsciiFrame] = useState(0);
  const [lastEasterEgg, setLastEasterEgg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { toggleTheme, superDarkMode } = useTheme();
  const { playType, playCommand, playError, playEasterEgg, playLightOn } = useAudio();

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
    if (saved) { try { setDiscoveredEggs(new Set(JSON.parse(saved))); } catch { /* ignore */ } }
  }, []);
  useEffect(() => {
    localStorage.setItem("idf-easter-eggs", JSON.stringify([...discoveredEggs]));
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

  useTerminalKeyboard({ isOpen, setIsOpen, toggleTheme, playLightOn, router, discoverEgg, playEasterEgg });

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
        if (prev >= art.length - 1) { setLastEasterEgg(null); return 0; }
        return prev + 1;
      });
    }, 250);
    return () => clearInterval(interval);
  }, [lastEasterEgg]);

  const WELCOME_MESSAGE: HistoryItem = context === "admin"
    ? { command: "", output: [
        { type: "system", content: "┌── idf-hub :: admin terminal ──" },
        { type: "text", content: "list — projects  │  add — new  │  status — stats" },
        { type: "text", content: "logout — sign out  │  site — back to site" },
        { type: "text", content: "type 'help' for all commands", cta: { label: "→ help", cmd: "help" } },
      ]}
    : { command: "", output: [
        { type: "system", content: "IDF OS v3.0" },
        { type: "text", content: "Welcome. Tap [→] to run commands.", cta: { label: "→ help", cmd: "help" } },
        { type: "text", content: "lab — projects  │  search — find  │  theme — toggle" },
        { type: "text", content: "admin — dashboard  │  whoami — auth status" },
      ]};

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (shouldAutoFocus()) inputRef.current?.focus();
        if (isFirstOpen) { setHistory([WELCOME_MESSAGE]); setIsFirstOpen(false); }
        if (terminalBodyRef.current) terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
      }, 100);
    } else {
      setIsFirstOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isFirstOpen]);

  useEffect(() => {
    if (terminalBodyRef.current) terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
  }, [history]);

  const { executeCommand } = useTerminalCommands({
    router, toggleTheme, playLightOn, playError, playEasterEgg,
    discoveredEggs, discoverEgg, setHistory, setCommandHistory,
    setHistoryIndex, setLastEasterEgg, setAsciiFrame, setIsOpen,
    getAsciiArt, context, setGameActive,
    getAuthUser: async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      return user ? { email: user.email } : null;
    },
    signOut: async () => { const supabase = createClient(); await supabase.auth.signOut(); },
  });

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
        const match = completionData.ids.find((id) => id.startsWith(partial) && id.length > partial.length);
        if (match) return `${cmd} ${match}`;
      }
      if (partial && SEARCH_COMMANDS.includes(cmd)) {
        const pool = [...completionData.categories, ...completionData.ids];
        const match = pool.find((c) => c.toLowerCase().startsWith(partial) && c.length > partial.length);
        if (match) return `${cmd} ${match.toLowerCase()}`;
      }
      return "";
    }
    return cmds.find((c) => c.startsWith(lo) && c.length > lo.length) ?? "";
  })();

  const { submitCurrentInput, handleInputKeyDown } = useTerminalInput({
    input, setInput, commandHistory, historyIndex, setHistoryIndex,
    suggestion, executeCommand, playCommand,
  });

  if (!isOpen) return null;

  const executeQuickCommand = (cmd: string) => {
    setInput(cmd);
    if (cmd.endsWith(" ")) { requestAnimationFrame(() => inputRef.current?.focus()); return; }
    setTimeout(() => executeCommand(cmd), 0);
  };

  return (
    <TerminalOverlay onClose={() => setIsOpen(false)}>
      <div className={styles.terminalContainer} onClick={(e) => e.stopPropagation()}>
        <TerminalHeader onClose={() => setIsOpen(false)} />

        <div className={styles.terminalBody} ref={terminalBodyRef}>
          {gameActive ? (
            <SnakeGame onExit={(score) => {
              setGameActive(false);
              setHistory((prev) => [...prev, {
                command: "snake",
                output: [
                  { type: "system", content: "Game over." },
                  { type: score > 0 ? "success" : "text", content: `Final score: ${score}` },
                  { type: "text", content: "Type 'snake' to play again.", cta: { label: "→ play again", cmd: "snake" } },
                ],
              }]);
            }} />
          ) : (
            <>
              {history.map((item, index) => (
                <TerminalHistoryItem key={index} item={item} onExecuteCommand={executeQuickCommand} />
              ))}
              {lastEasterEgg && ASCII_ART[getAsciiId(lastEasterEgg)] && (
                <pre className={styles.asciiArt}>{getAsciiArt(lastEasterEgg).join("\n")}</pre>
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
          onChange={(v) => { setInput(v); if (v.length > 0) playType(); }}
          onKeyDown={handleInputKeyDown}
          onSubmit={submitCurrentInput}
        />
      </div>
    </TerminalOverlay>
  );
}
