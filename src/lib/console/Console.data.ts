/** One row of the `idf.help()` listing. */
export interface ConsoleCommand {
  /** How the reader types it, parentheses included. */
  call: string;
  /** What it prints, in one line. */
  does: string;
}

/**
 * The console command index. Adding a method to the API means adding it here
 * too — `idf.help()` renders this list and nothing else.
 */
export const CONSOLE_COMMANDS: readonly ConsoleCommand[] = [
  { call: "idf.whoami()", does: "who built this, and where to find him" },
  { call: "idf.stack()", does: "what this site actually runs on" },
  { call: "idf.eggs()", does: "easter-egg progress — same store as the terminal" },
  { call: "idf.hint()", does: "one nudge toward something still hidden" },
  { call: "idf.help()", does: "this list" },
] as const;

/** One row of the `idf.stack()` table. */
export interface StackEntry {
  tool: string;
  role: string;
}

/**
 * The stack, kept honest against `package.json` — if a dependency leaves the
 * project it leaves this table too.
 */
export const CONSOLE_STACK: readonly StackEntry[] = [
  { tool: "Next.js 16", role: "framework, App Router + Turbopack" },
  { tool: "React 19", role: "UI runtime" },
  { tool: "TypeScript", role: "strict mode, no any" },
  { tool: "SCSS Modules", role: "styling, tokens in _variables.scss" },
  { tool: "Framer Motion", role: "state-driven animation" },
  { tool: "Three.js + R3F", role: "the 3D business card and lab scenes" },
  { tool: "Lucide React", role: "icons, 24px / 2px stroke" },
  { tool: "Storybook 10", role: "component library, served at /storybook" },
  { tool: "Jest + RTL", role: "tests, behaviour over implementation" },
  { tool: "Vercel", role: "hosting and analytics" },
] as const;

/** The identity card printed by `idf.whoami()`. */
export const CONSOLE_IDENTITY = {
  name: "Ivan Del Fatti",
  handle: "iDF",
  role: "Full-Stack Developer & UI/UX Designer",
  tagline: "Different angles. Better questions.",
  pitch:
    "Curious problem solver. Design is the tool, not the job title.",
} as const;

/** Where the banner points the reader next. */
export const CONSOLE_INVITE =
  "There is a terminal behind ⌘K / Ctrl+K with a lot more in it.";

/** Closing line of `idf.help()` — the same door, worded for a reader who
 * has already scrolled past the banner. */
export const CONSOLE_HELP_TAIL =
  "The terminal (⌘K / Ctrl+K) knows a great deal more than this list does.";

/**
 * Readable names for the social handles in `data/nav`, which stores them as
 * two-letter labels for the rails. The console has room to spell them out.
 */
export const SOCIAL_LABELS: Record<string, string> = {
  IG: "Instagram",
  LI: "LinkedIn",
  GH: "GitHub",
  FG: "Figma",
  FP: "FindPenguins",
};
