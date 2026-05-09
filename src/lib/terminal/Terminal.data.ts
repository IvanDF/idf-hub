import type { CommandOutput } from "@/types/terminal";

/** Output lines for each easter egg, keyed by egg ID. */
export const EASTER_EGG_RESPONSES: Record<string, CommandOutput[]> = {
  playbook: [
    { type: "system", content: "The Playbook" },
    { type: "text", content: '"There is no such thing as bad ideas.' },
    { type: "text", content: '"Only really good ones that get ruined later."' },
  ],
  legendary: [
    { type: "success", content: "LEGENDARY!" },
    { type: "text", content: '"This is gonna be legend... wait for it... dary!"' },
  ],
  pickle_rick: [
    { type: "success", content: "I turned myself into a pickle!" },
    { type: "text", content: '"Morty, I\'m a pickle!"' },
  ],
  wubba: [
    { type: "error", content: '"I am in great pain, please help me."' },
    { type: "text", content: "Rick's cry echoes through dimensions." },
  ],
  ragnar: [
    { type: "system", content: "Who Wants to be King?" },
    { type: "text", content: '"The temptation to leave everything behind."' },
    { type: "text", content: "- Ragnar Lothbrok" },
  ],
  skol: [
    { type: "success", content: "SKÅL!" },
    { type: "text", content: '"To the North, to the Viking gods!"' },
  ],
  theme_toggle: [
    { type: "success", content: "The Force has two sides." },
    { type: "text", content: '"Luminous beings are we." - Yoda' },
  ],
  konami: [
    { type: "system", content: "Konami Code" },
    { type: "success", content: "↑ ↑ ↓ ↓ ← → ← → B A" },
    { type: "text", content: '"The cheat code to end all cheat codes."' },
  ],
  companion: [
    { type: "system", content: "iDF Companion" },
    { type: "text", content: "The fusion-4 face — logo interpolated onto itself." },
    { type: "text", content: "Four paths. Infinite combinations. One identity." },
  ],
  fus_ro_dah: [
    { type: "system", content: "FUS RO DAH — Unrelenting Force" },
    { type: "text", content: "The Greybeards stir in High Hrothgar." },
    { type: "text", content: "Microphone activating... speak the Thu'um, Dovahkiin." },
    { type: "text", content: "fus (Force) · fus ro (Balance) · fus ro dah (Push)" },
  ],
};

/** Output lines for the site `help` command. */
export const HELP_OUTPUT: CommandOutput[] = [
  { type: "system", content: "── NAVIGATE ──" },
  { type: "text", content: "lab / work", cta: { label: "→ open", cmd: "lab" } },
  { type: "text", content: "home / back", cta: { label: "→ open", cmd: "home" } },
  { type: "text", content: "time — time machine", cta: { label: "→ open", cmd: "time" } },
  { type: "system", content: "── EXPLORE ──" },
  { type: "text", content: "search [keyword] — find projects", cta: { label: "→ try", cmd: "search shader" } },
  { type: "text", content: "open [id] — open a project" },
  { type: "system", content: "── SYSTEM ──" },
  { type: "text", content: "theme — toggle dark/light", cta: { label: "→ run", cmd: "theme" } },
  { type: "text", content: "whoami — auth status", cta: { label: "→ run", cmd: "whoami" } },
  { type: "text", content: "admin — admin panel", cta: { label: "→ open", cmd: "admin" } },
  { type: "text", content: "logout — sign out" },
  { type: "text", content: "clear — clear terminal", cta: { label: "→ run", cmd: "clear" } },
  { type: "system", content: "── FUN ──" },
  { type: "text", content: "snake / play — ASCII snake game 🐍", cta: { label: "→ play", cmd: "snake" } },
  { type: "text", content: "brand — identity system + companion", cta: { label: "→ run", cmd: "brand" } },
  { type: "text", content: "storybook / design — design system & component library", cta: { label: "→ open", cmd: "storybook" } },
  { type: "text", content: "guide / tour — platform tour", cta: { label: "→ start", cmd: "guide" } },
  { type: "text", content: "eggs — easter egg tracker" },
  { type: "text", content: "shortcuts / keys — keyboard shortcuts" },
  { type: "text", content: "shout — ???" },
  { type: "system", content: "── DEEP LINKS ──" },
  { type: "text", content: "Share commands via URL: ?cmd=[command]" },
  { type: "text", content: "Example: ?cmd=snake — launch snake directly", cta: { label: "→ copy link", cmd: "share snake" } },
];

/** Output lines for the `guide` / `tour` command. */
export const GUIDE_OUTPUT: CommandOutput[] = [
  { type: "system", content: "QUICK TOUR" },
  { type: "text", content: "1) search [keyword] — find projects", cta: { label: "→ try it", cmd: "search shader" } },
  { type: "text", content: "2) open [id] — jump to a project" },
  { type: "text", content: "3) lab / home / time — quick nav", cta: { label: "→ go to lab", cmd: "lab" } },
  { type: "text", content: "4) theme — toggle dark/light", cta: { label: "→ explore lab", cmd: "lab" } },
];

/** Output lines for the `brand` / `identity` command. */
export const BRAND_OUTPUT: CommandOutput[] = [
  { type: "system", content: "── iDF BRAND IDENTITY ──" },
  { type: "text", content: "Full-stack developer & digital craftsman" },
  { type: "text", content: "Specializing in interactive web experiences" },
  { type: "system", content: "── PALETTE ──" },
  { type: "success", content: "■ Volta   #8b5cf6  primary accent" },
  { type: "text", content: "■ Lario   #3b82f6  secondary / links" },
  { type: "text", content: "■ Ink     #111827  dark text / bg" },
  { type: "text", content: "■ Silk    #fafafa  light bg" },
  { type: "text", content: "■ Slate   #64748b  muted" },
  { type: "system", content: "── TYPE ──" },
  { type: "text", content: "display  Josefin Sans 700  ·  wide tracking" },
  { type: "text", content: "code     Geist Mono 400    ·  14px base" },
  { type: "system", content: "── ASSETS ──" },
  { type: "text", content: "brand guide →", cta: { label: "→ open /brand", cmd: "brand-page" } },
];

/** Output lines for the admin `help` command. */
export const ADMIN_HELP_OUTPUT: CommandOutput[] = [
  { type: "system", content: "┌── admin terminal ──" },
  { type: "text", content: "list — list projects", cta: { label: "→ run", cmd: "list" } },
  { type: "text", content: "add — add new project", cta: { label: "→ open form", cmd: "add" } },
  { type: "text", content: "status — show DB stats", cta: { label: "→ run", cmd: "status" } },
  { type: "text", content: "logout — sign out", cta: { label: "→ run", cmd: "logout" } },
  { type: "text", content: "theme — toggle theme", cta: { label: "→ run", cmd: "theme" } },
  { type: "text", content: "brand — identity system", cta: { label: "→ open", cmd: "brand" } },
  { type: "text", content: "site — back to main site", cta: { label: "→ go", cmd: "site" } },
  { type: "text", content: "clear — clear terminal" },
];
