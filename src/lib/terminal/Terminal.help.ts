import { SHORTCUTS_INFO } from "@/lib/terminal/Terminal.constants";
import { GUIDE_OUTPUT, buildEggsOutput } from "@/lib/terminal/Terminal.data";
import type { CommandOutput } from "@/types/terminal";

/**
 * The terminal's command catalogue, and the two shapes of help built from it.
 *
 * There is one source of truth here on purpose. The help text used to be a
 * hand-written list that drifted from the switch statement that actually
 * handles the commands, and every alias took a line of its own — four entries
 * for `lab` / `work` / `projects` / `progetti` is most of why the listing felt
 * crowded. Aliases now travel with their command and only surface when you ask
 * about a category.
 */

export type HelpCategory = "navigate" | "explore" | "play" | "system";

interface CommandEntry {
  /** The name shown in the listing. */
  name: string;
  /** Other spellings that reach the same command. */
  aliases?: string[];
  /** Argument placeholder, e.g. "[keyword]". */
  arg?: string;
  /** One line, shown in the full listing. */
  summary: string;
  /** The longer story, shown under `help <category>`. */
  detail?: string;
  category: HelpCategory;
  /** A command to run straight from the listing. */
  cta?: { label: string; cmd: string };
}

/** What each category is for, in its own words. */
export const CATEGORY_BLURB: Record<HelpCategory, { title: string; line: string }> = {
  navigate: {
    title: "NAVIGATE",
    line: "Every page of the site, without touching the mouse.",
  },
  explore: {
    title: "EXPLORE",
    line: "Dig through the work, and the things hidden behind it.",
  },
  play: {
    title: "PLAY",
    line: "The parts that exist because they were fun to build.",
  },
  system: {
    title: "SYSTEM",
    line: "The terminal itself, and the session you are in.",
  },
};

export const COMMANDS: CommandEntry[] = [
  // ── Navigate ──────────────────────────────────────────────────────────────
  { name: "home", aliases: ["back"], summary: "the front page", category: "navigate",
    cta: { label: "→ open", cmd: "home" } },
  { name: "lab", aliases: ["work", "projects", "progetti"], summary: "selected projects",
    detail: "The Lab is the whole archive. Filter it by Code, Design, Craft or Lab once you are there.",
    category: "navigate", cta: { label: "→ open", cmd: "lab" } },
  { name: "about", aliases: ["me"], summary: "who iDF is", category: "navigate",
    cta: { label: "→ open", cmd: "about" } },
  { name: "career", summary: "ten years, no straight line", category: "navigate",
    cta: { label: "→ open", cmd: "career" } },
  { name: "time", summary: "the time machine", category: "navigate",
    cta: { label: "→ open", cmd: "time" } },

  // ── Explore ───────────────────────────────────────────────────────────────
  { name: "search", aliases: ["find"], arg: "[keyword]", summary: "find projects by anything",
    detail: "Matches titles, tags, stack and descriptions — try a technology rather than a name.",
    category: "explore", cta: { label: "→ try", cmd: "search shader" } },
  { name: "open", arg: "[id]", summary: "jump straight to a project",
    detail: "Takes a project id, which `search` prints beside each result.",
    category: "explore" },
  { name: "brand", summary: "identity system and companion", category: "explore",
    cta: { label: "→ run", cmd: "brand" } },
  { name: "brain", aliases: ["cortex"], summary: "a neuroscience fact, and a hidden lab",
    category: "explore", cta: { label: "→ run", cmd: "brain" } },
  { name: "eggs", aliases: ["achievements", "badges"], summary: "what you have found so far",
    detail: "The site hides a handful of things. This tracks which ones you have tripped over.",
    category: "explore" },
  { name: "hint", summary: "a nudge toward one you have missed", category: "explore",
    cta: { label: "→ run", cmd: "hint" } },
  { name: "guide", aliases: ["tour", "start"], summary: "the short tour", category: "explore",
    cta: { label: "→ start", cmd: "guide" } },

  // ── Play ──────────────────────────────────────────────────────────────────
  { name: "play", summary: "the arcade — snake and cortex tests", category: "play",
    cta: { label: "→ open", cmd: "play" } },
  { name: "snake", summary: "the game, directly", category: "play" },
  { name: "sound", aliases: ["audio", "music"], summary: "the soundtrack, off by default",
    detail: "First call turns it on, the next mutes it. The mix follows the route you are on.",
    category: "play", cta: { label: "→ turn it on", cmd: "sound" } },
  { name: "theme", summary: "dark and light", category: "play",
    cta: { label: "→ run", cmd: "theme" } },
  { name: "shout", summary: "???", category: "play" },

  // ── System ────────────────────────────────────────────────────────────────
  { name: "help", aliases: ["?", "-h"], arg: "[category]", summary: "this listing",
    detail: "`help` lists everything. `help explore` — or any category name — explains one.",
    category: "system" },
  { name: "shortcuts", aliases: ["keys"], summary: "keyboard shortcuts", category: "system" },
  { name: "share", arg: "[command]", summary: "a link that runs a command",
    detail: "Any command can travel as a URL: ?cmd=snake opens the site straight into the game.",
    category: "system", cta: { label: "→ copy link", cmd: "share snake" } },
  { name: "clear", summary: "empty the terminal", category: "system",
    cta: { label: "→ run", cmd: "clear" } },
  { name: "whoami", summary: "auth status", category: "system",
    cta: { label: "→ run", cmd: "whoami" } },
  { name: "admin", summary: "the admin panel", category: "system" },
  { name: "logout", summary: "sign out", category: "system" },
  { name: "exit", aliases: ["close"], summary: "close the terminal", category: "system" },
];

const ORDER: HelpCategory[] = ["navigate", "explore", "play", "system"];

/** `name [arg]`, without the alias noise. */
function label(c: CommandEntry): string {
  return c.arg ? `${c.name} ${c.arg}` : c.name;
}

/**
 * The full listing: everything, one line per command, grouped by category.
 * Aliases are held back — they are what made this wall of text.
 */
export function buildHelpOutput(): CommandOutput[] {
  const out: CommandOutput[] = [];

  for (const category of ORDER) {
    const { title, line } = CATEGORY_BLURB[category];
    out.push({ type: "system", content: `── ${title} ── ${line}` });

    for (const c of COMMANDS.filter((x) => x.category === category)) {
      out.push({
        type: "text",
        content: `${label(c).padEnd(18)} ${c.summary}`,
        ...(c.cta ? { cta: c.cta } : {}),
      });
    }
  }

  out.push({
    type: "system",
    content: "`help [category]` for one of navigate · explore · play · system",
  });
  return out;
}

/** Whether a word names a category. */
export function isHelpCategory(word: string): word is HelpCategory {
  return (ORDER as string[]).includes(word);
}

/**
 * One category, in depth: what it is for, then each command with its aliases
 * and the longer note where there is one.
 */
export function buildCategoryHelp(category: HelpCategory): CommandOutput[] {
  const { title, line } = CATEGORY_BLURB[category];
  const out: CommandOutput[] = [
    { type: "system", content: `── ${title} ──` },
    { type: "text", content: line },
  ];

  for (const c of COMMANDS.filter((x) => x.category === category)) {
    out.push({
      type: "success",
      content: label(c),
      ...(c.cta ? { cta: c.cta } : {}),
    });
    out.push({ type: "text", content: `  ${c.detail ?? c.summary}` });
    if (c.aliases?.length) {
      out.push({ type: "text", content: `  also: ${c.aliases.join(", ")}` });
    }
  }

  return out;
}

/**
 * The commands that only ever print something. Keeping them together here
 * leaves the command hook to the ones with consequences — routing, auth,
 * audio, the game.
 *
 * @param cmd - The command word, already lowercased.
 * @param args - Everything after it.
 * @param discoveredEggs - Needed by the egg tracker.
 * @returns Lines to print, or null when this is not an informational command.
 */
export function buildInfoOutput(
  cmd: string,
  args: string[],
  discoveredEggs: Set<string>,
): CommandOutput[] | null {
  switch (cmd) {
    case "help":
    case "?":
    case "-h": {
      // `help` lists everything; `help explore` explains one category.
      const topic = args[0]?.toLowerCase();
      return topic && isHelpCategory(topic) ? buildCategoryHelp(topic) : buildHelpOutput();
    }

    case "guide":
    case "tour":
    case "start":
      return GUIDE_OUTPUT;

    case "eggs":
    case "easter":
    case "achievements":
    case "badges":
      return buildEggsOutput(discoveredEggs);

    case "shortcuts":
    case "keys":
      return [
        { type: "system", content: "KEYBOARD SHORTCUTS:" },
        ...SHORTCUTS_INFO.map((s) => ({
          type: "text" as const,
          content: `  ${s.key.padEnd(20)} - ${s.action}`,
        })),
      ];

    default:
      return null;
  }
}
