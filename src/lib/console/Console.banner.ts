/**
 * The devtools greeting.
 *
 * `console.log` is deliberate here, not leftover debugging: this module *is*
 * the console-facing surface of the site, and it is the one place in the
 * codebase allowed to write to stdout in production.
 */
import { ASCII_IDF_FACE } from "@/lib/ascii";
import { widenAscii } from "@/lib/console/Console.ascii";
import { CONSOLE_IDENTITY, CONSOLE_INVITE } from "@/lib/console/Console.data";
import { CONSOLE_RESET, CONSOLE_STYLE } from "@/lib/console/Console.styles";

/**
 * Target width of the printed face.
 *
 * The art is 28x24 on a square grid. A console draws a character cell about
 * 0.6em wide but ~1.5em tall, so holding the intended proportions needs
 * 28 * (1.5 / 0.6) ≈ 68 columns. `line-height` is deliberately left alone in
 * the style: Safari's console ignores it, so leaning on it would make the
 * face correct in Chrome and squashed everywhere else.
 */
const FACE_COLUMNS = 68;

/** The companion mark, first (and only) frame, as one printable block. */
const FACE = widenAscii(ASCII_IDF_FACE[0], FACE_COLUMNS).join("\n");

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
