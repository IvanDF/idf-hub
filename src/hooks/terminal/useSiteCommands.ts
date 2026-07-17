"use client";

import { PROJECTS } from "@/data/projects";
import type React from "react";
import { useCallback } from "react";
import { ADMIN_COMMANDS, EASTER_EGGS, SHORTCUTS_INFO, VALID_COMMANDS } from "@/lib/terminal/Terminal.constants";
import { PLAY_OUTPUT, buildBrainOutput } from "@/lib/terminal/Terminal.brain";
import { BRAND_OUTPUT, GUIDE_OUTPUT, HELP_OUTPUT, buildEggsOutput } from "@/lib/terminal/Terminal.data";
import { closestCommand } from "@/lib/terminal/Terminal.suggest";
import type { CommandOutput, HistoryItem } from "@/types/terminal";

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
  getAuthUser: () => Promise<{ email?: string | null } | null>;
  signOut: () => Promise<void>;
  /** Drives the "did you mean" pool: admin typos get admin suggestions. */
  context?: "site" | "admin";
};

/**
 * Handles all site-context terminal commands and shared commands (auth, search, open, etc.).
 * Returns `handleSiteCommand` for use by the main command orchestrator.
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
  getAuthUser,
  signOut,
  context = "site",
}: UseSiteCommandsOptions): {
  handleSiteCommand: (cmd: string, args: string[]) => Promise<SiteCommandResult>;
} {
  const handleSiteCommand = useCallback(
    async (cmd: string, args: string[]): Promise<SiteCommandResult> => {
      let outputs: CommandOutput[] = [];

      switch (cmd) {
        case "help":
        case "?":
        case "-h":
          outputs = HELP_OUTPUT;
          break;

        case "guide":
        case "tour":
        case "start":
          outputs = GUIDE_OUTPUT;
          break;

        case "eggs":
        case "easter":
        case "achievements":
        case "badges":
          outputs = buildEggsOutput(discoveredEggs);
          break;

        case "shortcuts":
        case "keys":
          outputs = [
            { type: "system", content: "KEYBOARD SHORTCUTS:" },
            ...SHORTCUTS_INFO.map((s) => ({ type: "text" as const, content: `  ${s.key.padEnd(20)} - ${s.action}` })),
          ];
          break;

        case "portfolio":
        case "work":
        case "projects":
        case "progetti":
        case "lab":
        case "experiments":
          outputs = [{ type: "success", content: "Accessing The Lab..." }];
          // Prefetch immediately so the route loads while the message shows;
          // the pause is only a readable beat, not masking a fetch.
          router.prefetch("/lab");
          setTimeout(() => { router.push("/lab"); setIsOpen(false); }, 400);
          break;

        case "home":
        case "back":
          outputs = [{ type: "success", content: "Returning Home..." }];
          router.prefetch("/");
          setTimeout(() => { router.push("/"); setIsOpen(false); }, 400);
          break;

        case "about":
        case "chi":
        case "me":
          outputs = [{ type: "success", content: "About Ivan Del Fatti..." }];
          router.prefetch("/about");
          setTimeout(() => { router.push("/about"); setIsOpen(false); }, 400);
          break;

        case "clear":
          setHistory([]);
          return { outputs: [], handled: true, skipHistory: true };

        case "theme":
        case "yoda":
        case "dark side":
        case "light side":
          playLightOn();
          toggleTheme();
          outputs = [{ type: "success", content: ["Dark.", "Light.", "Switched."][Math.floor(Math.random() * 3)] }];
          break;

        case "time":
        case "flux":
          outputs = [{ type: "success", content: "Time Machine..." }];
          router.prefetch("/time-machine");
          setTimeout(() => { router.push("/time-machine"); setIsOpen(false); }, 400);
          break;

        case "admin": {
          // Prefetch before the auth round-trip so the dashboard loads in
          // parallel with the /api/auth/me call instead of after it.
          router.prefetch("/admin");
          const user = await getAuthUser();
          outputs = user?.email
            ? [
                { type: "system", content: `Logged in as ${user.email}` },
                { type: "success", content: "→ Opening admin dashboard..." },
              ]
            : [
                { type: "system", content: "Accessing admin panel..." },
                { type: "success", content: "→ /admin" },
                { type: "text", content: "demo: admin@idf.dev / wubbalubbadubdub" },
              ];
          setTimeout(() => { router.push("/admin"); setIsOpen(false); }, 400);
          break;
        }

        case "logout": {
          const logoutUser = await getAuthUser();
          if (!logoutUser?.email) {
            outputs = [{ type: "error", content: "Not logged in." }];
          } else {
            outputs = [
              { type: "system", content: `Signing out ${logoutUser.email}...` },
              { type: "success", content: "Session terminated." },
            ];
            setTimeout(async () => { await signOut(); setIsOpen(false); }, 400);
          }
          break;
        }

        case "whoami": {
          const user = await getAuthUser();
          if (user?.email) {
            const isDemo = user.email === "admin@idf.dev";
            outputs = [
              { type: "system", content: `User: ${user.email}` },
              {
                type: "success",
                content: isDemo
                  ? "Access Level: C-137 (Morty-level — session-only, wubba lubba dub dub)"
                  : "Access Level: Admin (full access)",
              },
              { type: "text", content: 'Type "admin" to open the dashboard.' },
            ];
          } else {
            outputs = [
              { type: "system", content: "User: Guest / Observer" },
              { type: "text", content: "Access Level: Read-Only" },
              { type: "text", content: 'Type "admin" to access the admin panel.' },
            ];
          }
          break;
        }

        case "echo":
          outputs = [{ type: "text", content: args.join(" ") }];
          break;

        case "search":
        case "find":
        case "cerca":
        case "ricerca": {
          const query = args.join(" ").trim().toLowerCase();
          if (!query) {
            outputs = [
              { type: "system", content: "SEARCH USAGE" },
              { type: "text", content: "search [keyword]" },
              { type: "text", content: "Try: search shader, search vscode, search design" },
              { type: "text", content: "Oppure: cerca shader" },
            ];
            break;
          }
          const matches = PROJECTS.filter((p) => {
            const tags = p.tags.join(" ").toLowerCase();
            return (
              p.id.toLowerCase().includes(query) ||
              p.title.toLowerCase().includes(query) ||
              p.description.toLowerCase().includes(query) ||
              p.category.toLowerCase().includes(query) ||
              tags.includes(query)
            );
          });
          outputs = matches.length === 0
            ? [
                { type: "error", content: `No matches for '${query}'` },
                { type: "text", content: "Tip: use broader keywords." },
              ]
            : [
                { type: "success", content: `${matches.length} match(es) found` },
                ...matches.slice(0, 6).map((p) => ({
                  type: "text" as const,
                  content: `- ${p.id} | ${p.title}`,
                  cta: { label: "→ open", cmd: "open " + p.id },
                })),
                { type: "text", content: "Use: open [project-id] to jump directly." },
              ];
          break;
        }

        case "open":
        case "apri": {
          const targetId = args.join(" ").trim().toLowerCase();
          if (!targetId) {
            outputs = [
              { type: "system", content: "OPEN USAGE" },
              { type: "text", content: "open [project-id]" },
              { type: "text", content: "apri [project-id]" },
            ];
            break;
          }
          const target = PROJECTS.find((p) => p.id.toLowerCase() === targetId);
          if (!target) {
            outputs = [
              { type: "error", content: `Project not found: ${targetId}` },
              { type: "text", content: "Tip: run search first." },
            ];
            break;
          }
          outputs = [{ type: "success", content: `Opening ${target.title}...` }];
          router.prefetch(`/lab/${target.id}`);
          setTimeout(() => { router.push(`/lab/${target.id}`); setIsOpen(false); }, 400);
          break;
        }

        case "brand":
        case "identity":
          outputs = BRAND_OUTPUT;
          break;

        case "brain":
          outputs = buildBrainOutput();
          break;

        case "hint": {
          const hidden = EASTER_EGGS.filter((e) => !discoveredEggs.has(e.id));
          if (hidden.length === 0) {
            outputs = [
              { type: "success", content: "Nothing left to hint — you found them all." },
            ];
            break;
          }
          const egg = hidden[Math.floor(Math.random() * hidden.length)];
          outputs = [
            { type: "system", content: "⟁ HINT" },
            { type: "text", content: egg.hint },
            { type: "text", content: `category: ${egg.category} · ${hidden.length} still hidden` },
          ];
          break;
        }

        case "snake":
          setGameActive(true);
          return { outputs: [], handled: true, skipHistory: true };

        case "play": {
          const game = args[0];
          if (game === "snake") {
            setGameActive(true);
            return { outputs: [], handled: true, skipHistory: true };
          }
          if (game === "cortex" || game === "brain") {
            outputs = [{ type: "success", content: "Booting the cortex lab..." }];
            router.prefetch("/cortex");
            setTimeout(() => { router.push("/cortex"); setIsOpen(false); }, 400);
            break;
          }
          outputs = PLAY_OUTPUT;
          break;
        }

        case "exit":
        case "close":
          setIsOpen(false);
          return { outputs: [], handled: true, skipHistory: true };

        case "":
          return { outputs: [], handled: true, skipHistory: true };

        default: {
          playError();
          const pool = context === "admin" ? ADMIN_COMMANDS : VALID_COMMANDS;
          const suggested = closestCommand(cmd, pool);
          // suggested === cmd means the word is in the pool but unhandled in
          // this context (e.g. an egg alias in admin) — a suggestion to retype
          // the same thing would be absurd.
          outputs = [
            { type: "error", content: `Command not found: ${cmd}` },
            suggested && suggested !== cmd
              ? {
                  type: "text",
                  content: `Did you mean '${suggested}'?`,
                  cta: { label: `→ ${suggested}`, cmd: suggested },
                }
              : { type: "text", content: "Type 'help' for a list of commands." },
          ];
        }
      }

      return { outputs, handled: true };
    },
    [router, toggleTheme, playLightOn, playError, discoveredEggs, setHistory, setIsOpen, setGameActive, getAuthUser, signOut, context],
  );

  return { handleSiteCommand };
}
