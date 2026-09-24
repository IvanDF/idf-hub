import { buildCheersOutput } from "@/lib/terminal/cheers.data";
import {
  EASTER_EGGS,
  TOTAL_EASTER_EGGS,
} from "@/lib/terminal/Terminal.constants";
import type { CommandOutput } from "@/types/terminal";

// Scribed glyphs, not emoji — the terminal speaks in mono type.
const CAT_ICON: Record<string, string> = {
  HIMYM: "◆",
  "R&M": "◇",
  Vikings: "†",
  Secret: "§",
  Skyrim: "‡",
  iDF: "◉",
  Neuro: "⬡",
  Travel: "⚑",
};
const EGG_CATEGORIES = ["HIMYM", "R&M", "Vikings", "Secret", "iDF", "Skyrim", "Neuro", "Travel"];

export function buildEggsOutput(discoveredEggs: Set<string>): CommandOutput[] {
  const discovered = discoveredEggs.size;
  const out: CommandOutput[] = [
    { type: "system", content: "── ACHIEVEMENTS ──" },
    { type: "text", content: `${discovered}/${TOTAL_EASTER_EGGS} discovered` },
    { type: "text", content: "" },
  ];
  for (const cat of EGG_CATEGORIES) {
    const catEggs = EASTER_EGGS.filter((e) => e.category === cat);
    const found = catEggs.filter((e) => discoveredEggs.has(e.id)).length;
    out.push({
      type: "text",
      content: `${CAT_ICON[cat]} ${cat} ${found}/${catEggs.length}`,
    });
    for (const egg of catEggs) {
      const isFound = discoveredEggs.has(egg.id);
      out.push({
        type: isFound ? "success" : "text",
        content: isFound ? `   ✓ ${egg.name}` : `   ? ${egg.hint}`,
      });
    }
    out.push({ type: "text", content: "" });
  }
  if (discovered === TOTAL_EASTER_EGGS) {
    out.push({ type: "success", content: "All achievements unlocked!" });
    out.push({ type: "system", content: "◈ The shell turns gold for you." });
  }
  return out;
}

/** Output lines for each easter egg, keyed by egg ID. */
export const EASTER_EGG_RESPONSES: Record<string, CommandOutput[]> = {
  playbook: [
    { type: "system", content: "The Playbook" },
    { type: "text", content: '"There is no such thing as bad ideas.' },
    { type: "text", content: '"Only really good ones that get ruined later."' },
  ],
  legendary: [
    { type: "success", content: "LEGENDARY!" },
    {
      type: "text",
      content: '"This is gonna be legend... wait for it... dary!"',
    },
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
  theme_toggle: [
    { type: "success", content: "Into the Void." },
    { type: "text", content: '"Luminous beings are we." - Yoda' },
  ],
  companion: [
    { type: "system", content: "iDF Companion" },
    {
      type: "text",
      content: "The fusion-4 face — logo interpolated onto itself.",
    },
    {
      type: "text",
      content: "Four paths. Infinite combinations. One identity.",
    },
  ],
  fus_ro_dah: [
    { type: "system", content: "FUS RO DAH — Unrelenting Force" },
    { type: "text", content: "The Greybeards stir in High Hrothgar." },
    {
      type: "text",
      content: "Microphone activating... speak the Thu'um, Dovahkiin.",
    },
    {
      type: "text",
      content: "fus (Force) · fus ro (Balance) · fus ro dah (Push)",
    },
  ],
  cortex: [
    { type: "system", content: "⬡ THE CORTEX LAB" },
    { type: "success", content: "Booting cognitive test suite..." },
    { type: "text", content: "Reaction · Stroop interference · Sequence memory." },
    { type: "text", content: "Three tests. Your brain vs. the machine." },
  ],
  cheers: buildCheersOutput(),
};

/** Output lines for the site `help` command. */
/** Output lines for the `guide` / `tour` command. */
export const GUIDE_OUTPUT: CommandOutput[] = [
  { type: "system", content: "QUICK TOUR" },
  {
    type: "text",
    content: "1) search [keyword] — find projects",
    cta: { label: "→ try it", cmd: "search shader" },
  },
  { type: "text", content: "2) open [id] — jump to a project" },
  {
    type: "text",
    content: "3) lab / home / time — quick nav",
    cta: { label: "→ go to lab", cmd: "lab" },
  },
  {
    type: "text",
    content: "4) theme — toggle dark/light",
    cta: { label: "→ explore lab", cmd: "lab" },
  },
  {
    type: "text",
    content: "5) sound — the site has a soundtrack, off by default",
    cta: { label: "→ turn it on", cmd: "sound" },
  },
];

/**
 * Output for the `sound` command. First call turns the soundtrack on, later
 * calls toggle the mute.
 *
 * @param wasEnabled - Whether audio was already on before the command ran.
 * @param wasMuted - Whether it was muted before the command ran.
 */
export function buildSoundOutput(
  wasEnabled: boolean,
  wasMuted: boolean,
): CommandOutput[] {
  if (!wasEnabled) {
    return [
      { type: "success", content: "Soundtrack on. It follows the route you are on." },
      { type: "text", content: "`sound` again to mute." },
    ];
  }
  return [
    {
      type: "success",
      content: wasMuted ? "Unmuted." : "Muted. The music keeps its place.",
    },
  ];
}

/**
 * Output for `ygg`. Reskinning the panel is the point, so the lines are short
 * — the change is the message. The link is the reason the command exists:
 * someone who likes the look should be one keystroke from where it came from.
 *
 * @param on - Whether the skin was just turned on or off.
 */
export function buildYggOutput(on: boolean): CommandOutput[] {
  if (!on) {
    return [{ type: "success", content: "Back to the house style." }];
  }
  return [
    { type: "success", content: "ᛉ  Yggdrasil — the palette my tmux runs on." },
    {
      type: "text",
      content: "Violet is what you are on, blue is the active edge, stone is spent.",
    },
    {
      type: "text",
      content: "The tmux, Neovim and Obsidian themes are on the project page.",
      cta: { label: "→ open it", cmd: "open yggdrasil" },
    },
    { type: "system", content: "`ygg` again to put it back." },
  ];
}

/** Output lines for the admin `help` command. */
export const ADMIN_HELP_OUTPUT: CommandOutput[] = [
  { type: "system", content: "┌── admin terminal ──" },
  {
    type: "text",
    content: "list — list projects",
    cta: { label: "→ run", cmd: "list" },
  },
  {
    type: "text",
    content: "add — add new project",
    cta: { label: "→ open form", cmd: "add" },
  },
  {
    type: "text",
    content: "status — show project stats",
    cta: { label: "→ run", cmd: "status" },
  },
  {
    type: "text",
    content: "logout — sign out",
    cta: { label: "→ run", cmd: "logout" },
  },
  {
    type: "text",
    content: "theme — toggle theme",
    cta: { label: "→ run", cmd: "theme" },
  },
  {
    type: "text",
    content: "whoami — auth status",
    cta: { label: "→ run", cmd: "whoami" },
  },
  {
    type: "text",
    content: "ping — API health check",
    cta: { label: "→ run", cmd: "ping" },
  },
  {
    type: "text",
    content: "brand — identity system",
    cta: { label: "→ open", cmd: "brand" },
  },
  {
    type: "text",
    content: "site — back to main site",
    cta: { label: "→ go", cmd: "site" },
  },
  { type: "text", content: "clear — clear terminal" },
];
