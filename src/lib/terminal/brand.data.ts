import type { CommandOutput } from "@/types/terminal";

/**
 * The `brand` command, laid out the way a shell fetch tool does it: a mark on
 * the left, the facts on the right, one row at a time.
 *
 * TO ADD A NEW MARK: append an array of lines to `MARKS`. Keep every line the
 * same length and no wider than ART_WIDTH — the columns are built by padding,
 * so a ragged drawing drags the right-hand column with it. A test checks this.
 */

/** Column the facts start in. Must clear the widest line in MARKS. */
const ART_WIDTH = 20;

/**
 * Marks, drawn from the iDF identity. One is picked per run, so the command
 * is worth typing twice.
 */
export const MARKS: string[][] = [
  // The logo itself: the dot, and the hook beneath it.
  [
    "      ▄██▄      ",
    "     ██████     ",
    "      ▀██▀      ",
    "                ",
    "   ▄███████▄    ",
    "  ███▀   ▀███   ",
    "  ██▀     ▀██   ",
    "  ██▄     ▄██▄▄ ",
    "  ▀███▄▄████████",
    "    ▀▀▀▀▀   ▀███",
    "             ▀▀▀",
  ],
  // The initials, set solid.
  [
    "                ",
    "  ██  ███▄  ███ ",
    "  ▀▀  ██ ██ ██  ",
    "  ██  ██  █ ██▄ ",
    "  ██  ██ ██ ██  ",
    "  ██  ███▀  ██  ",
    "                ",
    "  ▄▄▄▄▄▄▄▄▄▄▄▄  ",
    "  ▀▀▀▀▀▀▀▀▀▀▀▀  ",
    "                ",
    "                ",
  ],
  // Fusion: two angles meeting, which is rather the point.
  [
    "                ",
    "     ◢██████◣   ",
    "    ██      ██  ",
    "   ██   ▄▄   ██ ",
    "   ██  ████  ██ ",
    "   ██   ▀▀   ██ ",
    "    ██      ██  ",
    "     ◥██████◤   ",
    "        ██      ",
    "      ▀▀▀▀▀▀    ",
    "                ",
  ],
];

/** The right-hand column. `assets` is gone: it only ever named itself. */
const FACTS: { text: string; tone: CommandOutput["type"] }[] = [
  { text: "iDF — BRAND IDENTITY", tone: "success" },
  { text: "──────────────────────────────────", tone: "system" },
  { text: "DRIVEN BY CURIOSITY.", tone: "text" },
  { text: "REFINED THROUGH DESIGN.", tone: "text" },
  { text: "──────────────────────────────────", tone: "system" },
  { text: "PALETTE", tone: "system" },
  { text: "■ Volta   #8b5cf6  primary accent", tone: "text" },
  { text: "■ Lario   #3b82f6  secondary / links", tone: "text" },
  { text: "■ Ink     #111827  dark text / bg", tone: "text" },
  { text: "■ Silk    #fafafa  light bg", tone: "text" },
  { text: "■ Slate   #64748b  muted", tone: "text" },
  { text: "──────────────────────────────────", tone: "system" },
  { text: "TYPE", tone: "system" },
  { text: "display   Josefin Sans 700 · wide", tone: "text" },
  { text: "code      Geist Mono 400 · 14px", tone: "text" },
];

/**
 * Zips a mark against the facts, padding the art column so the right-hand
 * side stays in line. Whichever column runs out first is padded with blanks.
 *
 * @param markIndex - Which mark to draw. Random when omitted.
 */
export function buildBrandOutput(markIndex?: number): CommandOutput[] {
  const mark =
    MARKS[markIndex ?? Math.floor(Math.random() * MARKS.length)] ?? MARKS[0];
  const rows = Math.max(mark.length, FACTS.length);
  const out: CommandOutput[] = [];

  for (let i = 0; i < rows; i++) {
    const art = (mark[i] ?? "").padEnd(ART_WIDTH);
    const fact = FACTS[i];
    out.push({
      // The tone follows the facts, since that is the half carrying meaning.
      type: fact?.tone ?? "text",
      content: `${art}${fact?.text ?? ""}`.trimEnd(),
      pre: true,
    });
  }

  return out;
}
