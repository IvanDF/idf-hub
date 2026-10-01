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

/**
 * What these renderers need off a command. Structural, not an import of the
 * registry's own type: the registry imports this file for `buildHelpOutput`,
 * so importing back would close a cycle.
 */
interface HelpEntry {
  name: string;
  aliases?: string[];
  arg?: string;
  summary: string;
  detail?: string;
  category: HelpCategory;
  cta?: { label: string; cmd: string };
  /** Runnable but kept out of the listing. */
  hidden?: boolean;
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

const ORDER: HelpCategory[] = ["navigate", "explore", "play", "system"];

/** `name [arg]`, without the alias noise. */
function label(c: HelpEntry): string {
  return c.arg ? `${c.name} ${c.arg}` : c.name;
}

/**
 * The full listing: everything, one line per command, grouped by category.
 * Aliases are held back — they are what made this wall of text.
 */
export function buildHelpOutput(commands: HelpEntry[]): CommandOutput[] {
  const out: CommandOutput[] = [];

  for (const category of ORDER) {
    const { title, line } = CATEGORY_BLURB[category];
    out.push({ type: "system", content: `── ${title} ── ${line}` });

    for (const c of commands.filter((x) => x.category === category && !x.hidden)) {
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
export function buildCategoryHelp(
  category: HelpCategory,
  commands: HelpEntry[],
): CommandOutput[] {
  const { title, line } = CATEGORY_BLURB[category];
  const out: CommandOutput[] = [
    { type: "system", content: `── ${title} ──` },
    { type: "text", content: line },
  ];

  for (const c of commands.filter((x) => x.category === category && !x.hidden)) {
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
