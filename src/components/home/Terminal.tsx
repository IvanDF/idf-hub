"use client";

import type { CommandOutput, HistoryItem } from "@/components/terminal";
import {
  TerminalHeader,
  TerminalInput,
  TerminalOverlay,
  TerminalQuickCommands,
} from "@/components/terminal";
import { useAudio } from "@/context/AudioContext";
import { useTheme } from "@/context/ThemeContext";
import { PROJECTS } from "@/data/projects";
import {
  ASCII_BARNEY,
  ASCII_PLAYBOOK,
  ASCII_RAGNAR1,
} from "@/design-system/ascii";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Terminal.module.scss";

// ASCII art for easter eggs
const ASCII_ART: Record<string, readonly (readonly string[])[]> = {
  legendary: ASCII_BARNEY,
  playbook: ASCII_PLAYBOOK,
  ragnar: ASCII_RAGNAR1,
  pickle_rick: [
    ["      ●      ", "    ╭───╮    ", "    │   │    ", "    ╰───╯    "],
    ["     \\●/     ", "    ╭─────╮  ", "    │     │  ", "    ╰──┬──╯  "],
  ],
  skol: [
    ["      ▲      ", "     ╱ ╲     ", "    ╱   ╲    ", "   ╱  ▼  ╲   "],
    ["      │      ", "     ╱ │     ", "    ╱  │     ", "   ╱   ▼     "],
  ],
  konami: [["    ↑ ↑ ↓ ↓    ", "    ← → ← →    ", "      B A       "]],
};
type EasterEgg = {
  id: string;
  aliases: string[];
  category: string;
  name: string;
  hint: string;
};

const EASTER_EGGS: EasterEgg[] = [
  // HIMYM
  {
    id: "playbook",
    aliases: ["playbook", "the playbook"],
    hint: "The book full of bad ideas... or are they?",
    category: "HIMYM",
    name: "The Playbook",
  },
  {
    id: "legendary",
    aliases: ["legendary", "legen", "wait for it", "dary"],
    hint: "The word Barney uses to describe his most outrageous plans... is gonna be...?",
    category: "HIMYM",
    name: "Legendary",
  },

  // Rick and Morty
  {
    id: "pickle_rick",
    aliases: ["pickle rick", "picklerick", "pickle"],
    hint: "Rick turned himself into a...?",
    category: "R&M",
    name: "Pickle Rick",
  },
  {
    id: "wubba",
    aliases: [
      "wubba lubba dub dub",
      "wubba lubba dub dub!",
      "wubba",
      "lubba",
      "dub dub",
    ],
    hint: "Rick’s chaotic catchphrase that hides pain.",
    category: "R&M",
    name: "Wubba Lubba Dub Dub",
  },

  // Vikings
  {
    id: "ragnar",
    aliases: ["ragnar", "ragnar lothbrok", "ragnar lodbrok"],
    hint: "“Don’t look back...” — said by which Viking?",
    category: "Vikings",
    name: "Who Wants to be King",
  },
  {
    id: "skol",
    aliases: ["skol", "skål", "skaal", "skol!"],
    hint: "Viking toast for “cheers.”",
    category: "Vikings",
    name: "Skål",
  },

  // Secret Features
  {
    id: "theme_toggle",
    aliases: ["yoda", "dark side", "light side", "theme", "toggle theme"],
    hint: "Two sides of the Force: light and dark.",
    category: "Secret",
    name: "Theme Master",
  },
  {
    id: "konami",
    aliases: [
      "konami",
      "up up down down left right left right b a",
      "↑ ↑ ↓ ↓ ← → ← → b a",
      "↑↑↓↓←→←→ba",
      "↑↑↓↓←→←→b a",
      "konami code",
      "konami cheat code",
    ],
    hint: "Classic cheat sequence: directions + B A.",
    category: "Secret",
    name: "Konami Code",
  },
];

const TOTAL_EASTER_EGGS = EASTER_EGGS.length;

// All valid commands for autocomplete (single-word commands only)
const VALID_COMMANDS = [
  "guide",
  "tour",
  "lab",
  "work",
  "projects",
  "home",
  "back",
  "clear",
  "theme",
  "time",
  "shortcuts",
  "keys",
  "eggs",
  "achievements",
  "whoami",
  "echo",
  "search",
  "find",
  "open",
  "exit",
  "close",
  "help",
  "-h",
  "konami",
  "legendary",
  "playbook",
  "ragnar",
  "skol",
];

export default function Terminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isFirstOpen, setIsFirstOpen] = useState(true);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [discoveredEggs, setDiscoveredEggs] = useState<Set<string>>(new Set());
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

  const SHORTCUTS_INFO = [
    { key: "CMD+K", action: "Open Terminal" },
    { key: "D", action: "Toggle Dark/Light Mode" },
    { key: "1", action: "Go to Home" },
    { key: "2", action: "Go to Lab" },
    { key: "ESC", action: "Close/Exit" },
    { key: "?", action: "Show this help" },
  ];

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
  const WELCOME_MESSAGE: HistoryItem = {
    command: "",
    output: [
      { type: "system", content: "IDF OS v3.0" },
      { type: "text", content: "Welcome." },
      { type: "text", content: "Type 'guide' for a quick tour." },
      { type: "text", content: "Try: search shader" },
      { type: "text", content: "Then: open gravity-well" },
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

  const executeCommand = useCallback(
    (cmdRaw: string) => {
      const normalizedInput = cmdRaw.trim().toLowerCase();
      const [rawCommand = "", ...args] = normalizedInput
        .split(/\s+/)
        .filter(Boolean);
      const cmd = rawCommand.replace(/[!?.,;:]+$/g, "");

      let outputs: CommandOutput[] = [];

      // Check for easter eggs first
      const foundEgg = EASTER_EGGS.find((egg) => egg.aliases.includes(cmd));
      if (foundEgg) {
        discoverEgg(foundEgg.id);
        setLastEasterEgg(foundEgg.id);
        setAsciiFrame(0);
        playEasterEgg(foundEgg.id);

        // Fun responses for each easter egg
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
      } else {
        // Standard commands
        switch (cmd) {
          case "help":
          case "?":
          case "-h":
            outputs = [
              { type: "system", content: "AVAILABLE COMMANDS:" },
              {
                type: "text",
                content:
                  "  guide / tour            - Quick platform walkthrough",
              },
              {
                type: "text",
                content: "  lab / work / projects    - Enter The Lab",
              },
              {
                type: "text",
                content: "  home / back             - Return to Home",
              },
              {
                type: "text",
                content: "  theme                  - Toggle light/dark mode",
              },
              {
                type: "text",
                content: "  time                   - Access Time Machine",
              },
              {
                type: "text",
                content: "  shortcuts / keys        - Show keyboard shortcuts",
              },
              {
                type: "text",
                content: "  eggs / achievements     - Easter eggs progress",
              },
              {
                type: "text",
                content: "  clear                  - Clear terminal",
              },
              {
                type: "text",
                content: "  whoami                 - Identity check",
              },
              {
                type: "text",
                content: "  echo [text]            - Echoes text back",
              },
              {
                type: "text",
                content: "  search [keyword]       - Search projects in lab",
              },
              {
                type: "text",
                content: "  open [project-id]      - Open project detail",
              },
              {
                type: "text",
                content: "  konami                 - Classic cheat code",
              },
              {
                type: "text",
                content: "  exit / close           - Close terminal",
              },
            ];
            break;

          case "guide":
          case "tour":
          case "start":
            outputs = [
              { type: "system", content: "NAVIGATION GUIDE" },
              {
                type: "text",
                content: "1) Discover projects with: search [keyword]",
              },
              {
                type: "text",
                content: "2) Open details with: open [project-id]",
              },
              {
                type: "text",
                content: "3) Jump quickly: lab, home, time",
              },
              {
                type: "text",
                content: "4) Theme toggle anytime: theme",
              },
              {
                type: "success",
                content: "Example: search shader",
              },
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

          case "konami":
            setLastEasterEgg("konami");
            setAsciiFrame(0);
            outputs = [
              { type: "system", content: "Konami Code" },
              ...getAsciiArt("konami").map((line) => ({
                type: "success" as const,
                content: line,
              })),
            ];
            break;

          case "whoami":
            outputs = [
              { type: "system", content: "User: Guest / Observer" },
              { type: "text", content: "Access Level: Read-Only" },
              { type: "text", content: "Mission: Explore the Digital Lab." },
            ];
            break;

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
      theme,
      toggleTheme,
      SHORTCUTS_INFO,
      discoverEgg,
      discoveredEggs.size,
      getAsciiArt,
      setLastEasterEgg,
      setAsciiFrame,
    ],
  );

  const submitCurrentInput = useCallback(() => {
    const value = input.trim();
    if (!value) return;

    playCommand();
    executeCommand(value);
    setInput("");
  }, [input, playCommand, executeCommand]);

  // Compute inline autocomplete suggestion
  const suggestion = (() => {
    if (!input || !input.trim()) return "";
    const inputLower = input.toLowerCase();
    return (
      VALID_COMMANDS.find(
        (cmd) => cmd.startsWith(inputLower) && cmd.length > inputLower.length,
      ) || ""
    );
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
        </div>

        <TerminalQuickCommands onCommand={executeQuickCommand} />

        <TerminalInput
          ref={inputRef}
          value={input}
          suggestion={suggestion}
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
