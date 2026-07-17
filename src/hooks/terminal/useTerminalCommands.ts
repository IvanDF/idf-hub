"use client";

import type React from "react";
import { useCallback } from "react";
import { EASTER_EGGS, TOTAL_EASTER_EGGS } from "@/lib/terminal/Terminal.constants";
import { EASTER_EGG_RESPONSES } from "@/lib/terminal/Terminal.data";
import type { CommandOutput, HistoryItem } from "@/types/terminal";
import { useAdminCommands } from "./useAdminCommands";
import { useSiteCommands } from "./useSiteCommands";

type UseTerminalCommandsOptions = {
  router: { push: (href: string) => void; prefetch: (href: string) => void };
  toggleTheme: () => void;
  playLightOn: () => void;
  playError: () => void;
  playEasterEgg: (id: string) => void;
  discoveredEggs: Set<string>;
  discoverEgg: (eggId: string) => void;
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
  setCommandHistory: React.Dispatch<React.SetStateAction<string[]>>;
  setHistoryIndex: React.Dispatch<React.SetStateAction<number>>;
  setLastEasterEgg: React.Dispatch<React.SetStateAction<string | null>>;
  setAsciiFrame: React.Dispatch<React.SetStateAction<number>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getAuthUser: () => Promise<{ email?: string | null } | null>;
  signOut: () => Promise<void>;
  setGameActive: React.Dispatch<React.SetStateAction<boolean>>;
  context?: "site" | "admin";
};

/**
 * Orchestrates terminal command execution.
 * Delegates to `useAdminCommands` or `useSiteCommands` after resolving easter eggs.
 */
export function useTerminalCommands({
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
  getAuthUser,
  signOut,
  setGameActive,
  context = "site",
}: UseTerminalCommandsOptions): {
  executeCommand: (cmdRaw: string) => Promise<void>;
} {
  const { handleAdminCommand } = useAdminCommands({ router, setIsOpen });
  const { handleSiteCommand } = useSiteCommands({
    router,
    toggleTheme,
    playLightOn,
    playError,
    discoveredEggs,
    setHistory,
    setIsOpen,
    setGameActive,
    getAuthUser,
    signOut,
    context,
  });

  const executeCommand = useCallback(
    async (cmdRaw: string) => {
      const normalizedInput = cmdRaw.trim().toLowerCase();
      const [rawCommand = "", ...args] = normalizedInput.split(/\s+/).filter(Boolean);
      const cmd = rawCommand.replace(/[!?.,;:]+$/g, "");

      let outputs: CommandOutput[] = [];
      let skipHistory = false;

      // Easter eggs — site context only, never platformOnly ones.
      // Match against both the first word (`cmd`) and the full normalised input
      // so that multi-word aliases like "fus ro dah" or "who are you" work too.
      const foundEgg =
        context !== "admin"
          ? EASTER_EGGS.find(
              (egg) =>
                !egg.platformOnly &&
                (egg.aliases.includes(cmd) || egg.aliases.includes(normalizedInput)),
            )
          : null;

      if (foundEgg) {
        // discoveredEggs is still the pre-discovery snapshot in this render
        const foundCount = discoveredEggs.has(foundEgg.id)
          ? discoveredEggs.size
          : discoveredEggs.size + 1;
        discoverEgg(foundEgg.id);
        setLastEasterEgg(foundEgg.id);
        setAsciiFrame(0);
        playEasterEgg(foundEgg.id);
        outputs = [
          ...(EASTER_EGG_RESPONSES[foundEgg.id] ?? [{ type: "success" as const, content: foundEgg.name }]),
          {
            type: "text",
            content: `⬡ ${foundCount}/${TOTAL_EASTER_EGGS} discovered`,
            cta: { label: "→ eggs", cmd: "eggs" },
          },
        ];

        // Fus Ro Dah: activate global voice overlay
        if (foundEgg.id === "fus_ro_dah") {
          window.dispatchEvent(new CustomEvent("fus:activate"));
        }

        // Cortex: the egg response is a loading beat, then open the test lab.
        if (foundEgg.id === "cortex") {
          router.prefetch("/cortex");
          setTimeout(() => {
            router.push("/cortex");
            setIsOpen(false);
          }, 600);
        }
      } else if (context === "admin") {
        const adminResult = await handleAdminCommand(cmd, args);
        if (adminResult.handled) {
          outputs = adminResult.outputs;
        } else {
          // Shared commands (theme, logout, whoami, brand, etc.) fall through to site handler
          const siteResult = await handleSiteCommand(cmd, args);
          outputs = siteResult.outputs;
          skipHistory = siteResult.skipHistory ?? false;
        }
      } else {
        const siteResult = await handleSiteCommand(cmd, args);
        outputs = siteResult.outputs;
        skipHistory = siteResult.skipHistory ?? false;
      }

      if (skipHistory) return;

      setHistory((prev) => [...prev, { command: cmdRaw, output: outputs }]);
      if (cmdRaw.trim()) {
        setCommandHistory((prev) => [...prev, cmdRaw]);
        setHistoryIndex(-1);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [context, router, setIsOpen, discoverEgg, discoveredEggs.size, setLastEasterEgg, setAsciiFrame, playEasterEgg, handleAdminCommand, handleSiteCommand],
  );

  return { executeCommand };
}
