import {
  ASCII_BARNEY,
  ASCII_IDF_FACE,
  ASCII_PLAYBOOK,
  ASCII_RAGNAR1,
} from "@/design-system/ascii";

// ASCII art for easter eggs
export const ASCII_ART: Record<string, readonly (readonly string[])[]> = {
  legendary: ASCII_BARNEY,
  playbook: ASCII_PLAYBOOK,
  ragnar: ASCII_RAGNAR1,
  companion: ASCII_IDF_FACE,
  pickle_rick: [
    ["      ●      ", "    ╭───╮    ", "    │   │    ", "    ╰───╯    "],
    ["     \●/     ", "    ╭─────╮  ", "    │     │  ", "    ╰──┬──╯  "],
  ],
  skol: [
    ["      ▲      ", "     ⼢ ⼣     ", "    ⼢   ⼣    ", "   ⼢  ▼  ⼣   "],
    ["      │      ", "     ⼢ │     ", "    ⼢  │     ", "   ⼢   ▼     "],
  ],
  konami: [["    ↑ ↑ ↓ ↓    ", "    ← → ← →    ", "      B A       "]],
};

export type EasterEgg = {
  id: string;
  aliases: string[];
  category: string;
  name: string;
  hint: string;
  /** If true, cannot be discovered by typing in the terminal — requires platform action */
  platformOnly?: boolean;
};

export const EASTER_EGGS: EasterEgg[] = [
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

  // Secret Features — platform-only (not discoverable by typing)
  {
    id: "theme_toggle",
    aliases: ["yoda", "dark side", "light side", "theme", "toggle theme"],
    hint: "Two sides of the Force: light and dark. Find the switch.",
    category: "Secret",
    name: "Theme Master",
    platformOnly: true,
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
    hint: "Classic cheat sequence — no terminal allowed. Fingers only.",
    category: "Secret",
    name: "Konami Code",
    platformOnly: true,
  },
  {
    id: "companion",
    aliases: ["companion", "face", "idf face", "fusion face", "who are you"],
    hint: "The iDF mark, seen from another angle. Made of brackets and angles.",
    category: "iDF",
    name: "iDF Companion",
  },
  {
    id: "fus_ro_dah",
    aliases: ["fus", "fus ro dah", "thu'um", "shout", "dragonborn", "skyrim", "dovahkiin"],
    hint: "The Greybeards whisper of a power hidden in words. Speak the ancient Thu'um.",
    category: "Skyrim",
    name: "Unrelenting Force",
  },
];

export const TOTAL_EASTER_EGGS = EASTER_EGGS.length;

// All valid commands for autocomplete (single-word commands only)
export const VALID_COMMANDS = [
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
  "admin",
  "logout",
  "exit",
  "close",
  "help",
  "-h",
  "snake",
  "play",
  "brand",
];

// Admin terminal commands
export const ADMIN_COMMANDS = [
  "help",
  "-h",
  "list",
  "add",
  "status",
  "logout",
  "theme",
  "site",
  "clear",
  "whoami",
  "ping",
  "brand",
];

// Commands that accept a second argument (for smart autocomplete)
export const SEARCH_COMMANDS = ["search", "find", "cerca", "ricerca"];
export const OPEN_COMMANDS = ["open", "apri"];

// Static category list for autocomplete fallback
export const PROJECT_CATEGORIES = [
  "dev",
  "vscode",
  "creative",
  "maker",
  "apple",
  "codepen",
  "experiment",
];

export const SHORTCUTS_INFO = [
  { key: "CMD+K", action: "Open Terminal" },
  { key: "D", action: "Toggle Dark/Light Mode" },
  { key: "1", action: "Go to Home" },
  { key: "2", action: "Go to Lab" },
  { key: "ESC", action: "Close/Exit" },
  { key: "?", action: "Show this help" },
];
