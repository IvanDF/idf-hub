/**
 * The `window.idf` console API.
 *
 * As with the banner, `console.log` is the product here rather than a debug
 * leftover — these functions exist to print.
 */
import {
  CONSOLE_COMMANDS,
  CONSOLE_IDENTITY,
  CONSOLE_HELP_TAIL,
  CONSOLE_STACK,
  SOCIAL_LABELS,
} from "@/lib/console/Console.data";
import { CONSOLE_STYLE } from "@/lib/console/Console.styles";
import {
  EASTER_EGGS,
  TOTAL_EASTER_EGGS,
} from "@/lib/terminal/Terminal.constants";
import { socials } from "@/data/nav";
import type { IdfConsoleApi } from "@/types/console";

/** Same key the Terminal writes to — the two views share one progress store. */
const EGG_STORAGE_KEY = "idf-easter-eggs";
/** Character width of the printed progress bar. */
const BAR_WIDTH = 20;
/** Column width that keeps the command list aligned in a mono console. */
const CALL_COLUMN = 16;

/**
 * Reads the terminal's discovered-egg set, tolerating absent, unparsable or
 * stale storage — ids of retired eggs are dropped so the counter can never
 * read above the total.
 */
function readDiscoveredEggs(): Set<string> {
  try {
    const saved = window.localStorage.getItem(EGG_STORAGE_KEY);
    if (!saved) return new Set();
    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return new Set();
    const validIds = new Set(EASTER_EGGS.map((e) => e.id));
    return new Set(
      parsed.filter(
        (id): id is string => typeof id === "string" && validIds.has(id),
      ),
    );
  } catch {
    return new Set();
  }
}

/** Renders `found/total` as a filled bar of block glyphs. */
function progressBar(found: number, total: number): string {
  const filled = total === 0 ? 0 : Math.round((found / total) * BAR_WIDTH);
  return "█".repeat(filled) + "░".repeat(BAR_WIDTH - filled);
}

/** Prints a `⬡ SECTION` rule above a block of output. */
function heading(label: string): void {
  console.log(`%c⬡ ${label}`, CONSOLE_STYLE.heading);
}

/** `idf.help()` — the command index, aligned in two columns. */
function help(): void {
  heading("CONSOLE");
  for (const { call, does } of CONSOLE_COMMANDS) {
    console.log(
      `%c${call.padEnd(CALL_COLUMN)}%c${does}`,
      CONSOLE_STYLE.command,
      CONSOLE_STYLE.muted,
    );
  }
  console.log(`%c${CONSOLE_HELP_TAIL}`, CONSOLE_STYLE.muted);
}

/** `idf.whoami()` — the identity card and the ways to reach it. */
function whoami(): void {
  heading("WHOAMI");
  console.log(
    `%c${CONSOLE_IDENTITY.name}%c  ${CONSOLE_IDENTITY.role}`,
    CONSOLE_STYLE.body,
    CONSOLE_STYLE.muted,
  );
  console.log(`%c${CONSOLE_IDENTITY.tagline}`, CONSOLE_STYLE.tagline);
  console.log(`%c${CONSOLE_IDENTITY.pitch}`, CONSOLE_STYLE.muted);
  for (const { href, label } of socials) {
    console.log(
      `%c${(SOCIAL_LABELS[label] ?? label).padEnd(CALL_COLUMN)}%c${href}`,
      CONSOLE_STYLE.command,
      CONSOLE_STYLE.muted,
    );
  }
}

/** `idf.stack()` — what the site runs on, as a devtools table. */
function stack(): void {
  heading("STACK");
  console.table([...CONSOLE_STACK]);
}

/** `idf.eggs()` — progress, then a row per egg with a clue for the missing. */
function eggs(): void {
  const discovered = readDiscoveredEggs();
  const found = discovered.size;
  heading("ACHIEVEMENTS");
  console.log(
    `%c${progressBar(found, TOTAL_EASTER_EGGS)} ${found}/${TOTAL_EASTER_EGGS}`,
    found === TOTAL_EASTER_EGGS ? CONSOLE_STYLE.success : CONSOLE_STYLE.body,
  );
  console.table(
    EASTER_EGGS.map((egg) => {
      const isFound = discovered.has(egg.id);
      return {
        egg: isFound ? egg.name : "???",
        category: egg.category,
        status: isFound ? "✓ found" : "· hidden",
        clue: isFound ? "—" : egg.hint,
      };
    }),
  );
  if (found === TOTAL_EASTER_EGGS) {
    console.log("%cAll of them. The terminal shell turns gold for you.", CONSOLE_STYLE.success);
    return;
  }
  console.log(
    `%c→ %cidf.hint()%c for one nudge at a time.`,
    CONSOLE_STYLE.muted,
    CONSOLE_STYLE.command,
    CONSOLE_STYLE.muted,
  );
}

/** `idf.hint()` — one random nudge toward an egg that is still hidden. */
function hint(): void {
  const discovered = readDiscoveredEggs();
  const hidden = EASTER_EGGS.filter((egg) => !discovered.has(egg.id));
  heading("HINT");
  if (hidden.length === 0) {
    console.log(
      "%cNothing left to hint — you found them all.",
      CONSOLE_STYLE.success,
    );
    return;
  }
  const egg = hidden[Math.floor(Math.random() * hidden.length)];
  console.log(`%c${egg.hint}`, CONSOLE_STYLE.body);
  console.log(
    `%ccategory: ${egg.category} · ${hidden.length} still hidden`,
    CONSOLE_STYLE.muted,
  );
}

/**
 * Builds the frozen `window.idf` object. Frozen so a curious visitor can read
 * and call it but not reshape the thing they are inspecting.
 */
export function createConsoleApi(): IdfConsoleApi {
  return Object.freeze({ help, whoami, stack, eggs, hint });
}
