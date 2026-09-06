import { DESIGN_SYSTEM } from "@/styles/design-system";

/**
 * Console `%c` styles cannot read the page's CSS custom properties — devtools
 * renders them in its own context — so the brand tokens are resolved here at
 * compile time from the design system, and the mono stack is spelled out
 * rather than referencing `--font-geist-mono`.
 */
const MONO =
  '"Geist Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

/** The dark-theme variants read correctly on both light and dark devtools. */
export const CONSOLE_STYLE = {
  /** ASCII art block — tight leading so the glyph grid stays square. */
  logo: `color:${DESIGN_SYSTEM.color.voltaDark};font-family:${MONO};font-size:10px;line-height:10px;letter-spacing:0`,
  /** The "iDF" wordmark. */
  wordmark: `color:${DESIGN_SYSTEM.color.voltaDark};font-family:${MONO};font-size:20px;font-weight:700;letter-spacing:2px`,
  /** Full name, next to the wordmark. */
  name: `color:${DESIGN_SYSTEM.color.slateMuted};font-family:${MONO};font-size:12px`,
  /** The tagline — the one line that carries the brand. */
  tagline: `color:${DESIGN_SYSTEM.color.larioDark};font-family:${MONO};font-size:13px;font-style:italic`,
  /** Secondary copy: roles, counts, footnotes. */
  muted: `color:${DESIGN_SYSTEM.color.slateMuted};font-family:${MONO};font-size:11px`,
  /** Body copy in the console's own foreground colour. */
  body: `font-family:${MONO};font-size:12px`,
  /** A command the reader is meant to type back. */
  command: `color:${DESIGN_SYSTEM.color.voltaDark};font-family:${MONO};font-size:12px;font-weight:700`,
  /** Something found / unlocked. */
  success: `color:${DESIGN_SYSTEM.color.brandTeal};font-family:${MONO};font-size:12px`,
  /** Section heading inside a printed block. */
  heading: `color:${DESIGN_SYSTEM.color.voltaDark};font-family:${MONO};font-size:12px;font-weight:700;letter-spacing:1px`,
} as const;

/** Resets styling for the tail of a mixed `%c` string. */
export const CONSOLE_RESET = "font:inherit;color:inherit";
