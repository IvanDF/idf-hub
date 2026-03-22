"use client";

import { useFutureMode } from "@/context/FutureModeContext";
import { useTheme } from "@/context/ThemeContext";
import {
  ASCII_BARNEY,
  ASCII_PLAYBOOK,
  ASCII_RAGNAR1,
  ASCII_RAGNAR2,
} from "@/design-system/ascii";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Terminal.module.scss";

type CommandOutput = {
  type: "text" | "error" | "success" | "system" | "link";
  content: string | React.ReactNode;
};

type HistoryItem = {
  command: string;
  output?: CommandOutput[];
};

// ASCII art for easter eggs
const ASCII_ART: Record<string, readonly (readonly string[])[]> = {
  barney: ASCII_BARNEY,
  playbook: ASCII_PLAYBOOK,
  ragnar: ASCII_RAGNAR1,
  ragnar2: ASCII_RAGNAR2,
  pickle_rick: [
    ["      ●      ", "    ╭───╮    ", "    │   │    ", "    ╰───╯    "],
    ["     \\●/     ", "    ╭─────╮  ", "    │     │  ", "    ╰──┬──╯  "],
  ],
  skol: [
    ["      ▲      ", "     ╱ ╲     ", "    ╱   ╲    ", "   ╱  ▼  ╲   "],
    ["      │      ", "     ╱ │     ", "    ╱  │     ", "   ╱   ▼     "],
  ],
  legendary: [
    [
      "   ┌─────────┐   ",
      "   │ LEGEN.. │   ",
      "   │ WAIT..  │   ",
      "   │ DARY!   │   ",
      "   └─────────┘   ",
    ],
    ["   ┌─────────┐   ", "   │  DARY!  │   ", "   └─────────┘   "],
  ],
  konami: [["    ↑ ↑ ↓ ↓    ", "    ← → ← →    ", "      B A       "]],
  valhalla: [
    [
      "  ╔═══════════╗  ",
      "  ║  ╭─────╮  ║  ",
      "  ║  │VALHA│  ║  ",
      "  ║  │LLA  │  ║  ",
      "  ║  ╰─────╯  ║  ",
      "  ╚═══════════╝  ",
    ],
  ],
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
    id: "suit_up",
    aliases: ["suit up"],
    hint: "Barney's famous catchphrase",
    category: "HIMYM",
    name: "Suit Up",
  },
  {
    id: "playbook",
    aliases: ["playbook"],
    hint: "Ted's legendary pickup line",
    category: "HIMYM",
    name: "The Playbook",
  },
  {
    id: "legendary",
    aliases: ["legendary"],
    hint: "The catchphrase before 'dary'",
    category: "HIMYM",
    name: "Legendary",
  },
  {
    id: "umbrella",
    aliases: ["umbrella"],
    hint: "Something yellow that shelters from rain",
    category: "HIMYM",
    name: "Yellow Umbrella",
  },

  // Rick and Morty
  {
    id: "pickle_rick",
    aliases: ["pickle rick"],
    hint: "Rick's most absurd invention",
    category: "R&M",
    name: "Pickle Rick",
  },
  {
    id: "wubba",
    aliases: ["wubba lubba dub dub"],
    hint: "Rick's cry for help",
    category: "R&M",
    name: "Wubba Lubba Dub Dub",
  },
  {
    id: "burp",
    aliases: ["burp"],
    hint: "Rick's signature sound",
    category: "R&M",
    name: "Burp",
  },
  {
    id: "science",
    aliases: ["science"],
    hint: "Rick's answer to everything",
    category: "R&M",
    name: "Science",
  },

  // Vikings
  {
    id: "ragnar",
    aliases: ["ragnar"],
    hint: "The question every king must answer",
    category: "Vikings",
    name: "Who Wants to be King",
  },
  {
    id: "aesir",
    aliases: ["aesir"],
    hint: "Ragnar's final words",
    category: "Vikings",
    name: "The Aesir",
  },
  {
    id: "skol",
    aliases: ["skol"],
    hint: "Viking way to say cheers",
    category: "Vikings",
    name: "Skål",
  },
  {
    id: "valhalla",
    aliases: ["valhalla"],
    hint: "Where warriors go after death",
    category: "Vikings",
    name: "Valhalla",
  },

  // Secret Features
  {
    id: "future_mode",
    aliases: ["zen"],
    hint: "Focus. Nothing else.",
    category: "Secret",
    name: "Future Mode",
  },
  {
    id: "theme_toggle",
    aliases: ["yoda"],
    hint: "The force has two of these",
    category: "Secret",
    name: "Theme Master",
  },
  {
    id: "time_machine",
    aliases: ["flux"],
    hint: "Marty's 1.21 of these",
    category: "Secret",
    name: "Time Traveler",
  },
  {
    id: "konami",
    aliases: ["konami"],
    hint: "The cheat code to end all cheat codes",
    category: "Secret",
    name: "Konami Code",
  },
];

const TOTAL_EASTER_EGGS = EASTER_EGGS.length;

export default function Terminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isFirstOpen, setIsFirstOpen] = useState(true);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [discoveredEggs, setDiscoveredEggs] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { toggleTheme, theme } = useTheme();
  const { toggleFutureMode, isFutureMode } = useFutureMode();

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

  const SHORTCUTS_INFO = [
    { key: "CMD+K", action: "Open Terminal" },
    { key: "D", action: "Toggle Dark/Light Mode" },
    { key: "CMD+SHIFT+F", action: "Toggle Future Mode" },
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
  }, [isOpen, router, toggleTheme]);

  // Welcome message
  const WELCOME_MESSAGE: HistoryItem = {
    command: "",
    output: [
      { type: "system", content: "IDF OS v3.0" },
      { type: "text", content: "Welcome." },
      { type: "text", content: "Type 'help' for commands." },
    ],
  };

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
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
      suit_up: "barney",
      playbook: "playbook",
      ragnar: "ragnar",
      valhalla: "ragnar2",
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
      const cmd = cmdRaw.trim().toLowerCase();
      const args = cmdRaw.trim().split(" ").slice(1);

      let outputs: CommandOutput[] = [];

      // Check for easter eggs first
      const foundEgg = EASTER_EGGS.find((egg) => egg.aliases.includes(cmd));
      if (foundEgg) {
        discoverEgg(foundEgg.id);
        setLastEasterEgg(foundEgg.id);
        setAsciiFrame(0);

        // Fun responses for each easter egg
        const responses: Record<string, CommandOutput[]> = {
          suit_up: [
            { type: "system", content: "Suit Up" },
            {
              type: "text",
              content: '"Every time you suit up, you\'re at your best."',
            },
            { type: "text", content: "- Barney Stinson" },
          ],
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
          umbrella: [
            { type: "system", content: "Yellow Umbrella" },
            {
              type: "text",
              content: "Something yellow that shelters from rain.",
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
          burp: [
            { type: "success", content: "*BURRRRRP*" },
            { type: "text", content: '"Wubba lubba dub dub, Morty!"' },
          ],
          science: [
            { type: "success", content: "Science!" },
            {
              type: "text",
              content: '"Rick Sanchez - The smartest man in the universe."',
            },
          ],
          ragnar: [
            { type: "system", content: "Who Wants to be King?" },
            {
              type: "text",
              content: '"The temptation to leave everything behind."',
            },
            { type: "text", content: "- Ragnar Lothbrok" },
          ],
          aesir: [
            { type: "system", content: '"The Aesir will welcome me home."' },
            { type: "text", content: "Ragnar's final words before death." },
          ],
          skol: [
            { type: "success", content: "SKÅL!" },
            { type: "text", content: '"To the North, to the Viking gods!"' },
          ],
          valhalla: [
            { type: "system", content: "Valhalla awaits the brave." },
            {
              type: "text",
              content: '"A warrior\'s paradise, an eternity of glory."',
            },
          ],
          future_mode: [
            { type: "success", content: "Future Mode activated." },
            { type: "text", content: "Nothing else matters." },
          ],
          yoda: [
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
            outputs = [
              { type: "system", content: "AVAILABLE COMMANDS:" },
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
                content: "  future / zen           - Toggle Future Mode",
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
                content: "  exit / close           - Close terminal",
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

          case "future":
          case "zen":
            toggleFutureMode();
            outputs = [
              {
                type: "success",
                content: isFutureMode ? "Deactivated." : "Future Mode.",
              },
            ];
            break;

          case "yoda":
          case "dark side":
          case "light side":
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

          case "exit":
          case "close":
            setIsOpen(false);
            return;

          case "":
            break;

          default:
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
      toggleFutureMode,
      isFutureMode,
      SHORTCUTS_INFO,
      discoverEgg,
      discoveredEggs.size,
      getAsciiArt,
      setLastEasterEgg,
      setAsciiFrame,
    ],
  );

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(input);
      setInput("");
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

  return (
    <div className={styles.overlay} onClick={() => setIsOpen(false)}>
      <div
        className={styles.terminalContainer}
        ref={containerRef}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
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

        {/* Input Area */}
        <div className={styles.inputArea}>
          <span className={styles.prompt}>{">"}</span>
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
}
