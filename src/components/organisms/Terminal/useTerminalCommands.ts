"use client";

import type { CommandOutput, HistoryItem } from "./Terminal.types";
import {
  EASTER_EGGS,
  SHORTCUTS_INFO,
  TOTAL_EASTER_EGGS,
} from "./Terminal.constants";
import { PROJECTS } from "@/data/projects";
import { useCallback } from "react";
import type React from "react";

type UseTerminalCommandsOptions = {
  router: { push: (href: string) => void };
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
  getAsciiArt: (eggId: string) => string[];
  getAuthUser: () => Promise<{ email?: string | null } | null>;
  signOut: () => Promise<void>;
  setGameActive: React.Dispatch<React.SetStateAction<boolean>>;
  context?: 'site' | 'admin';
};

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
  getAsciiArt,
  getAuthUser,
  signOut,
  setGameActive,
  context = 'site',
}: UseTerminalCommandsOptions): { executeCommand: (cmdRaw: string) => Promise<void> } {
  const executeCommand = useCallback(
    async (cmdRaw: string) => {
      const normalizedInput = cmdRaw.trim().toLowerCase();
      const [rawCommand = "", ...args] = normalizedInput
        .split(/\s+/)
        .filter(Boolean);
      const cmd = rawCommand.replace(/[!?.,;:]+$/g, "");

      let outputs: CommandOutput[] = [];
      let handled = false;

      // Check for easter eggs first (site context only, never platformOnly ones)
      const foundEgg = context !== 'admin'
        ? EASTER_EGGS.find((egg) => !egg.platformOnly && egg.aliases.includes(cmd))
        : null;
      if (foundEgg) {
        discoverEgg(foundEgg.id);
        setLastEasterEgg(foundEgg.id);
        setAsciiFrame(0);
        playEasterEgg(foundEgg.id);

        const responses: Record<string, CommandOutput[]> = {
          playbook: [
            { type: "system", content: "The Playbook" },
            { type: "text", content: '"There is no such thing as bad ideas.' },
            {
              type: "text",
              content: '"Only really good ones that get ruined later."',
            },
          ],
          legendary: [
            { type: "success", content: "LEGENDARY!" },
            {
              type: "text",
              content: '"This is gonna be legend... wait for it... dary!"',
            },
          ],
          pickle_rick: [
            { type: "success", content: "I turned myself into a pickle!" },
            { type: "text", content: '"Morty, I\'m a pickle!"' },
          ],
          wubba: [
            { type: "error", content: '"I am in great pain, please help me."' },
            { type: "text", content: "Rick's cry echoes through dimensions." },
          ],
          ragnar: [
            { type: "system", content: "Who Wants to be King?" },
            {
              type: "text",
              content: '"The temptation to leave everything behind."',
            },
            { type: "text", content: "- Ragnar Lothbrok" },
          ],
          skol: [
            { type: "success", content: "SKÅL!" },
            { type: "text", content: '"To the North, to the Viking gods!"' },
          ],
          theme_toggle: [
            { type: "success", content: "The Force has two sides." },
            { type: "text", content: '"Luminous beings are we." - Yoda' },
          ],
          konami: [
            { type: "system", content: "Konami Code" },
            { type: "success", content: "↑ ↑ ↓ ↓ ← → ← → B A" },
            {
              type: "text",
              content: '"The cheat code to end all cheat codes."',
            },
          ],
        };

        outputs = responses[foundEgg.id] || [
          { type: "success", content: foundEgg.name },
        ];
        handled = true;
      }

      // Admin-context-only commands
      if (!handled && context === 'admin') {
        switch (cmd) {
          case "help":
          case "-h":
            outputs = [
              { type: "system", content: "┌── admin terminal ──" },
              { type: "text", content: "list — list projects", cta: { label: "→ run", cmd: "list" } },
              { type: "text", content: "add — add new project", cta: { label: "→ open form", cmd: "add" } },
              { type: "text", content: "status — show DB stats", cta: { label: "→ run", cmd: "status" } },
              { type: "text", content: "logout — sign out", cta: { label: "→ run", cmd: "logout" } },
              { type: "text", content: "theme — toggle theme", cta: { label: "→ run", cmd: "theme" } },
              { type: "text", content: "brand — identity system", cta: { label: "→ open", cmd: "brand" } },
              { type: "text", content: "site — back to main site", cta: { label: "→ go", cmd: "site" } },
              { type: "text", content: "clear — clear terminal" },
            ];
            handled = true;
            break;

          case "list": {
            try {
              const res = await fetch('/api/projects');
              const projects = await res.json();
              outputs = [
                { type: "system", content: `${projects.length} projects in DB` },
                ...projects.slice(0, 15).map((p: { id: string; title: string; status?: string; year: string }) => ({
                  type: "text" as const,
                  content: `${p.id.padEnd(28)} ${p.year}  ${p.status ?? '—'}`,
                })),
                ...(projects.length > 15 ? [{ type: "text" as const, content: `  ... and ${projects.length - 15} more` }] : []),
              ];
            } catch {
              outputs = [{ type: "error", content: "Failed to fetch projects" }];
            }
            handled = true;
            break;
          }

          case "add":
            outputs = [{ type: "success", content: "Opening add form..." }];
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('terminal:admin:add'));
            }, 300);
            handled = true;
            break;

          case "status": {
            try {
              const res = await fetch('/api/projects');
              const projects = await res.json();
              const live = projects.filter((p: { status?: string }) => p.status === 'live').length;
              const inProgress = projects.filter((p: { status?: string }) => p.status === 'in-progress').length;
              const archived = projects.filter((p: { status?: string }) => p.status === 'archived').length;
              outputs = [
                { type: "system", content: "── DB STATUS ──" },
                { type: "success", content: `total:       ${projects.length}` },
                { type: "text", content: `live:        ${live}` },
                { type: "text", content: `in-progress: ${inProgress}` },
                { type: "text", content: `archived:    ${archived}` },
              ];
            } catch {
              outputs = [{ type: "error", content: "Failed to reach API" }];
            }
            handled = true;
            break;
          }

          case "site":
            outputs = [{ type: "success", content: "← Returning to site..." }];
            setTimeout(() => { router.push('/'); setIsOpen(false); }, 700);
            handled = true;
            break;

          case "ping":
            outputs = [{ type: "success", content: "pong. DB is alive." }];
            handled = true;
            break;
        }
      }

      // Shared / site commands (skip if already handled)
      if (!handled) {
        switch (cmd) {
          case "help":
          case "?":
          case "-h":
            outputs = [
              { type: "system", content: "── NAVIGATE ──" },
              { type: "text", content: "lab / work", cta: { label: "→ open", cmd: "lab" } },
              { type: "text", content: "home / back", cta: { label: "→ open", cmd: "home" } },
              { type: "text", content: "time — time machine", cta: { label: "→ open", cmd: "time" } },
              { type: "system", content: "── EXPLORE ──" },
              { type: "text", content: "search [keyword] — find projects", cta: { label: "→ try", cmd: "search shader" } },
              { type: "text", content: "open [id] — open a project" },
              { type: "system", content: "── SYSTEM ──" },
              { type: "text", content: "theme — toggle dark/light", cta: { label: "→ run", cmd: "theme" } },
              { type: "text", content: "whoami — auth status", cta: { label: "→ run", cmd: "whoami" } },
              { type: "text", content: "admin — admin panel", cta: { label: "→ open", cmd: "admin" } },
              { type: "text", content: "logout — sign out" },
              { type: "text", content: "clear — clear terminal", cta: { label: "→ run", cmd: "clear" } },
              { type: "system", content: "── FUN ──" },
              { type: "text", content: "snake / play — ASCII snake game 🐍", cta: { label: "→ play", cmd: "snake" } },
              { type: "text", content: "brand — identity system + companion", cta: { label: "→ run", cmd: "brand" } },
              { type: "text", content: "guide / tour — platform tour", cta: { label: "→ start", cmd: "guide" } },
              { type: "text", content: "eggs — easter egg tracker" },
              { type: "text", content: "shortcuts / keys — keyboard shortcuts" },
            ];
            break;

          case "guide":
          case "tour":
          case "start":
            outputs = [
              { type: "system", content: "QUICK TOUR" },
              { type: "text", content: "1) search [keyword] — find projects", cta: { label: "→ try it", cmd: "search shader" } },
              { type: "text", content: "2) open [id] — jump to a project" },
              { type: "text", content: "3) lab / home / time — quick nav", cta: { label: "→ go to lab", cmd: "lab" } },
              { type: "text", content: "4) theme — toggle dark/light", cta: { label: "→ explore lab", cmd: "lab" } },
            ];
            break;

          case "eggs":
          case "easter":
          case "achievements":
          case "badges":
            const discovered = discoveredEggs.size;
            outputs = [
              { type: "system", content: "🏆 ACHIEVEMENTS" },
              {
                type: "text",
                content: `${discovered}/${TOTAL_EASTER_EGGS} discovered`,
              },
              { type: "text", content: "" },
            ];

            const categories = ["HIMYM", "R&M", "Vikings", "Secret"];
            categories.forEach((cat) => {
              const catEggs = EASTER_EGGS.filter((e) => e.category === cat);
              const foundInCat = catEggs.filter((e) =>
                discoveredEggs.has(e.id),
              ).length;
              const catIcon =
                cat === "HIMYM"
                  ? "💜"
                  : cat === "R&M"
                    ? "🌀"
                    : cat === "Vikings"
                      ? "⚔️"
                      : "🔐";
              outputs.push({
                type: "text",
                content: `${catIcon} ${cat} ${foundInCat}/${catEggs.length}`,
              });

              catEggs.forEach((egg) => {
                const isFound = discoveredEggs.has(egg.id);
                if (isFound) {
                  outputs.push({
                    type: "success" as const,
                    content: `   ✓ ${egg.name}`,
                  });
                } else {
                  outputs.push({
                    type: "text" as const,
                    content: `   ? ${egg.hint}`,
                  });
                }
              });
              outputs.push({ type: "text", content: "" });
            });

            if (discovered === TOTAL_EASTER_EGGS) {
              outputs.push({
                type: "success",
                content: "🎉 All achievements unlocked!",
              });
            }
            break;

          case "shortcuts":
          case "keys":
            outputs = [
              { type: "system", content: "KEYBOARD SHORTCUTS:" },
              ...SHORTCUTS_INFO.map((s) => ({
                type: "text" as const,
                content: `  ${s.key.padEnd(20)} - ${s.action}`,
              })),
            ];
            break;

          case "portfolio":
          case "work":
          case "projects":
          case "progetti":
          case "lab":
          case "experiments":
            outputs = [{ type: "success", content: "Accessing The Lab..." }];
            setTimeout(() => {
              router.push("/lab");
              setIsOpen(false);
            }, 800);
            break;

          case "home":
          case "back":
            outputs = [{ type: "success", content: "Returning Home..." }];
            setTimeout(() => {
              router.push("/");
              setIsOpen(false);
            }, 800);
            break;

          case "clear":
            setHistory([]);
            return;
          case "theme":
          case "yoda":
          case "dark side":
          case "light side":
            playLightOn();
            toggleTheme();
            const themeMsg = ["Dark.", "Light.", "Switched."];
            outputs = [
              {
                type: "success",
                content: themeMsg[Math.floor(Math.random() * themeMsg.length)],
              },
            ];
            break;

          case "time":
          case "flux":
            outputs = [{ type: "success", content: "Time Machine..." }];
            setTimeout(() => {
              router.push("/time-machine");
              setIsOpen(false);
            }, 800);
            break;

          case "admin": {
            const user = await getAuthUser();
            if (user?.email) {
              outputs = [
                { type: "system", content: `Logged in as ${user.email}` },
                { type: "success", content: "→ Opening admin dashboard..." },
              ];
            } else {
              outputs = [
                { type: "system", content: "Accessing admin panel..." },
                { type: "success", content: "→ /admin" },
                { type: "text", content: "demo: morty@c-137.com / wubbalubbadubdub" },
              ];
            }
            setTimeout(() => {
              router.push("/admin");
              setIsOpen(false);
            }, 900);
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
              setTimeout(async () => {
                await signOut();
                setIsOpen(false);
              }, 800);
            }
            break;
          }

          case "whoami": {
            const user = await getAuthUser();
            if (user?.email) {
              const isDemo = user.email === "morty@c-137.com";
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
                {
                  type: "text",
                  content: "Try: search shader, search vscode, search design",
                },
                {
                  type: "text",
                  content: "Oppure: cerca shader",
                },
              ];
              break;
            }

            const matches = PROJECTS.filter((project) => {
              const tags = project.tags.join(" ").toLowerCase();
              return (
                project.id.toLowerCase().includes(query) ||
                project.title.toLowerCase().includes(query) ||
                project.description.toLowerCase().includes(query) ||
                project.category.toLowerCase().includes(query) ||
                tags.includes(query)
              );
            });

            if (matches.length === 0) {
              outputs = [
                { type: "error", content: `No matches for '${query}'` },
                { type: "text", content: "Tip: use broader keywords." },
              ];
              break;
            }

            outputs = [
              { type: "success", content: `${matches.length} match(es) found` },
              ...matches.slice(0, 6).map((project) => ({
                type: "text" as const,
                content: `- ${project.id} | ${project.title}`,
                cta: { label: "→ open", cmd: "open " + project.id },
              })),
              {
                type: "text",
                content: "Use: open [project-id] to jump directly.",
              },
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

            const target = PROJECTS.find(
              (project) => project.id.toLowerCase() === targetId,
            );

            if (!target) {
              outputs = [
                { type: "error", content: `Project not found: ${targetId}` },
                { type: "text", content: "Tip: run search first." },
              ];
              break;
            }

            outputs = [
              { type: "success", content: `Opening ${target.title}...` },
            ];
            setTimeout(() => {
              router.push(`/lab/${target.id}`);
              setIsOpen(false);
            }, 450);
            break;
          }

          case "brand":
          case "identity":
            outputs = [
              { type: "system", content: "── iDF BRAND IDENTITY ──" },
              { type: "text",   content: "         ◉                 ◉" },
              { type: "text",   content: "        /|\\               /|\\" },
              { type: "text",   content: "       / | \\             / | \\" },
              { type: "text",   content: "      |  |  \\___________/  |  |" },
              { type: "text",   content: "      |  |                 |  |" },
              { type: "text",   content: "       \\ |_________________| /" },
              { type: "text",   content: "        \\_____fusion-4_____/" },
              { type: "system", content: "── PALETTE ──" },
              { type: "success", content: "■ Volta   #8b5cf6  primary accent" },
              { type: "text",   content: "■ Lario   #3b82f6  secondary / links" },
              { type: "text",   content: "■ Ink     #111827  dark text / bg" },
              { type: "text",   content: "■ Silk    #fafafa  light bg" },
              { type: "text",   content: "■ Slate   #64748b  muted" },
              { type: "system", content: "── TYPE ──" },
              { type: "text",   content: "display  Josefin Sans 700  ·  wide tracking" },
              { type: "text",   content: "code     Geist Mono 400    ·  14px base" },
              { type: "system", content: "── ASSETS ──" },
              { type: "text",   content: "brand guide →", cta: { label: "→ open /brand", cmd: "brand-page" } },
            ];
            break;

          case "brand-page":
            outputs = [{ type: "success", content: "Opening brand guide..." }];
            setTimeout(() => { router.push('/brand'); setIsOpen(false); }, 400);
            break;

          case "snake":
          case "play":
            setGameActive(true);
            return;

          case "exit":
          case "close":
            setIsOpen(false);
            return;

          case "":
            break;

          default:
            playError();
            outputs = [
              { type: "error", content: `Command not found: ${cmd}` },
              { type: "text", content: "Type 'help' for a list of commands." },
            ];
        }
      }

      setHistory((prev) => [...prev, { command: cmdRaw, output: outputs }]);
      if (cmdRaw.trim()) {
        setCommandHistory((prev) => [...prev, cmdRaw]);
        setHistoryIndex(-1);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      context,
      toggleTheme,
      discoverEgg,
      discoveredEggs.size,
      getAsciiArt,
      setLastEasterEgg,
      setAsciiFrame,
    ],
  );

  return { executeCommand };
}
