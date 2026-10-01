"use client";

import { useAudio } from "@/context/AudioContext";
import type React from "react";
import { useCallback } from "react";
import { ADMIN_COMMANDS } from "@/lib/terminal/Terminal.constants";
import {
  COMMANDS,
  COMMAND_WORDS,
  findCommand,
} from "@/lib/terminal/Terminal.registry";
import { closestCommand } from "@/lib/terminal/Terminal.suggest";
import type {
  CommandContext,
  CommandOutput,
  HistoryItem,
  TerminalSkin,
} from "@/types/terminal";

type SiteCommandResult = {
  outputs: CommandOutput[];
  handled: boolean;
  /** When true the caller should skip pushing to history (e.g. clear, snake, exit). */
  skipHistory?: boolean;
};

type UseSiteCommandsOptions = {
  router: { push: (href: string) => void; prefetch: (href: string) => void };
  toggleTheme: () => void;
  playLightOn: () => void;
  playError: () => void;
  discoveredEggs: Set<string>;
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setGameActive: React.Dispatch<React.SetStateAction<boolean>>;
  setSkin: React.Dispatch<React.SetStateAction<TerminalSkin>>;
  getAuthUser: () => Promise<{ email?: string | null } | null>;
  signOut: () => Promise<void>;
  /** Drives the "did you mean" pool: admin typos get admin suggestions. */
  context?: "site" | "admin";
};

/** The beat between a command printing and the page changing under it. */
const NAVIGATE_DELAY_MS = 400;

/**
 * Runs a typed word against the command registry.
 *
 * This used to be a 45-case switch that decided both what a word meant and
 * what it did, next to a separate hand-written list that decided what help
 * showed — which is how ten commands ended up runnable and undocumented. The
 * registry owns both now, and this hook only assembles what the handlers need
 * and reports what came back.
 */
export function useSiteCommands({
  router,
  toggleTheme,
  playLightOn,
  playError,
  discoveredEggs,
  setHistory,
  setIsOpen,
  setGameActive,
  setSkin,
  getAuthUser,
  signOut,
  context = "site",
}: UseSiteCommandsOptions): {
  handleSiteCommand: (cmd: string, args: string[]) => Promise<SiteCommandResult>;
} {
  // Read straight from the provider rather than threading a callback down
  // through useTerminalCommands: this hook already sits inside AudioProvider.
  const { isEnabled: audioEnabled, toggleAudio, toggleMute, isMuted } = useAudio();

  const handleSiteCommand = useCallback(
    async (cmd: string, args: string[]): Promise<SiteCommandResult> => {
      // An empty line is a no-op, not an unknown command.
      if (cmd === "") return { outputs: [], handled: true, skipHistory: true };

      const entry = findCommand(cmd);

      if (!entry) {
        playError();
        const pool = context === "admin" ? ADMIN_COMMANDS : COMMAND_WORDS;
        const suggested = closestCommand(cmd, pool);
        // suggested === cmd means the word is in the pool but unhandled in
        // this context (e.g. an egg alias in admin) — a suggestion to retype
        // the same thing would be absurd.
        return {
          handled: true,
          outputs: [
            { type: "error", content: `Command not found: ${cmd}` },
            suggested && suggested !== cmd
              ? {
                  type: "text",
                  content: `Did you mean '${suggested}'?`,
                  cta: { label: `→ ${suggested}`, cmd: suggested },
                }
              : { type: "text", content: "Type 'help' for a list of commands." },
          ],
        };
      }

      const ctx: CommandContext = {
        args,
        commands: COMMANDS,
        discoveredEggs,
        // Prefetch immediately so the route loads while the message shows; the
        // pause is only a readable beat, not masking a fetch.
        go: (href) => {
          router.prefetch(href);
          setTimeout(() => {
            router.push(href);
            setIsOpen(false);
          }, NAVIGATE_DELAY_MS);
        },
        audio: {
          enabled: audioEnabled,
          muted: isMuted,
          toggleAudio,
          toggleMute,
        },
        theme: { toggle: toggleTheme, playLightOn },
        auth: { getUser: getAuthUser, signOut },
        router,
        setHistory,
        setIsOpen,
        setGameActive,
        setSkin,
      };

      const result = await entry.run(ctx);
      return { ...result, handled: true };
    },
    [
      router,
      toggleTheme,
      playLightOn,
      playError,
      discoveredEggs,
      setHistory,
      setIsOpen,
      setGameActive,
      setSkin,
      getAuthUser,
      signOut,
      context,
      audioEnabled,
      isMuted,
      toggleAudio,
      toggleMute,
    ],
  );

  return { handleSiteCommand };
}
