import type { CommandEntry } from "@/types/terminal";
import { NAVIGATE_COMMANDS } from "./commands/navigate";
import { EXPLORE_COMMANDS } from "./commands/explore";
import { PLAY_COMMANDS } from "./commands/play";
import { SYSTEM_COMMANDS } from "./commands/system";

/**
 * Every command the terminal knows.
 *
 * This is the only list. Help, autocomplete, the "did you mean" pool and
 * execution all read from it, so a word cannot be runnable and undocumented at
 * the same time — which is exactly what ten of them were while a 45-case
 * switch and a hand-written help list were maintained side by side.
 *
 * The entries are grouped into one file per category only because the catalogue
 * had grown past the point where one file could be scanned; this assembly is
 * still the single source.
 */
export const COMMANDS: CommandEntry[] = [
  ...NAVIGATE_COMMANDS,
  ...EXPLORE_COMMANDS,
  ...PLAY_COMMANDS,
  ...SYSTEM_COMMANDS,
];

/**
 * Every word that reaches a command, built once.
 *
 * Also the "did you mean" pool: a typo can now only be corrected toward
 * something that actually runs, which was not guaranteed while the pool was
 * its own hand-written list.
 */
const BY_WORD = new Map<string, CommandEntry>(
  COMMANDS.flatMap((entry) =>
    [entry.name, ...(entry.aliases ?? [])].map((word) => [word, entry] as const),
  ),
);

export const COMMAND_WORDS: string[] = [...BY_WORD.keys()];

/** The entry a typed word reaches, or undefined. */
export function findCommand(word: string): CommandEntry | undefined {
  return BY_WORD.get(word);
}
