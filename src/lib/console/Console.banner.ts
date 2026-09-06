/**
 * The devtools greeting.
 *
 * `console.log` is deliberate here, not leftover debugging: this module *is*
 * the console-facing surface of the site, and it is the one place in the
 * codebase allowed to write to stdout in production.
 */
import { ASCII_IDF_FACE } from "@/lib/ascii";
import { CONSOLE_IDENTITY, CONSOLE_INVITE } from "@/lib/console/Console.data";
import { CONSOLE_RESET, CONSOLE_STYLE } from "@/lib/console/Console.styles";

/** The companion mark, first (and only) frame, as one printable block. */
const FACE = ASCII_IDF_FACE[0].join("\n");

/**
 * Prints the banner: the iDF companion in ASCII, the wordmark, the tagline
 * and the way in. Called once per page load by the DevConsole atom.
 */
export function printBanner(): void {
  console.log(`%c${FACE}`, CONSOLE_STYLE.logo);
  console.log(
    `%c${CONSOLE_IDENTITY.handle}%c  ${CONSOLE_IDENTITY.name} · ${CONSOLE_IDENTITY.role}`,
    CONSOLE_STYLE.wordmark,
    CONSOLE_STYLE.name,
  );
  console.log(`%c${CONSOLE_IDENTITY.tagline}`, CONSOLE_STYLE.tagline);
  console.log(
    `%cYou opened the console. Good instinct.%c\n%c${CONSOLE_INVITE}`,
    CONSOLE_STYLE.body,
    CONSOLE_RESET,
    CONSOLE_STYLE.muted,
  );
  console.log(
    `%c→ %cidf.help()%c for what lives down here.`,
    CONSOLE_STYLE.muted,
    CONSOLE_STYLE.command,
    CONSOLE_STYLE.muted,
  );
}
