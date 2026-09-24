import type { YggForgeItem, YggLaw, YggMoment, YggRealm } from "@/types/yggdrasil";

export const YGG_REALMS: YggRealm[] = [
  {
    id: "ground",
    rune: "ᛟ",
    name: "The ground",
    layer: "roots",
    myth: "Othala — the inherited land",
    role: "A 2017 HP Elite x2 running Fedora Silverblue",
    detail:
      "An old 2-in-1 with an i5 and 8 GB of memory. The operating system is read-only and atomic: updates land as a new image, and the previous one is always a reboot away.",
  },
  {
    id: "trunk",
    rune: "ᛇ",
    name: "The trunk",
    layer: "trunk",
    myth: "Eihwaz — the yew that connects the worlds",
    role: "Rootless Podman containers under systemd, reachable over Tailscale",
    detail:
      "Every service is a container started by systemd, never by hand. A private mesh network is the only way in: nothing listens on the open internet.",
  },
  {
    id: "heimdallr",
    rune: "ᚺ",
    name: "Heimdallr",
    layer: "branches",
    myth: "The watchman of the gods",
    role: "Home Assistant",
    detail:
      "Runs the house. The robot vacuum cleans twice a day — on its own if nobody is home, after asking if someone is — and every alert from the system reaches the phone through it.",
  },
  {
    id: "urd",
    rune: "ᚢ",
    name: "Urd",
    layer: "branches",
    myth: "The Norn who keeps the well of what has been",
    role: "Sync server for the notes",
    detail:
      "The Obsidian vault syncs through it across laptop, phone and tablet. Notes are encrypted on each device before they leave it, so the server only ever holds ciphertext.",
  },
  {
    id: "verdandi",
    rune: "ᚹ",
    name: "Verðandi",
    layer: "branches",
    myth: "The Norn of what is becoming",
    role: "A bridge between the vault and the server",
    detail:
      "Keeps a readable copy of the notes on the server, so scripts and the assistant can read them, log a workout or tidy the inbox — and every change flows back to every device.",
  },
  {
    id: "ratatoskr",
    rune: "ᚱ",
    name: "Ratatoskr",
    layer: "branches",
    myth: "The squirrel that carries messages up and down the tree",
    role: "A Telegram assistant",
    detail:
      "One conversation instead of another app: today's training card, the session logged, ideas and book quotes saved, voice notes transcribed, and a short spoken message every morning.",
  },
  {
    id: "muninn",
    rune: "ᛗ",
    name: "Muninn",
    layer: "branches",
    myth: "Odin's raven of memory",
    role: "Backups",
    detail:
      "Every night the system is saved locally, and the full history of the notes is encrypted and pushed off-site. If it ever stops, the phone knows within two days.",
  },
  {
    id: "bragi",
    rune: "ᛒ",
    name: "Bragi",
    layer: "branches",
    myth: "The god of poetry and song",
    role: "Media server",
    detail: "A personal streaming library, reachable from any of my devices and from nowhere else.",
  },
  {
    id: "draupnir",
    rune: "ᛞ",
    name: "Draupnir",
    layer: "branches",
    myth: "Odin's ring that multiplies itself",
    role: "Price watcher",
    detail:
      "Checks a handful of shops every morning and speaks up only when something I want drops below the price I set.",
  },
];

export const YGG_LAWS: YggLaw[] = [
  {
    title: "One purpose per part",
    body: "If a script does two things, it becomes two scripts. If a file is not used, it is deleted.",
  },
  {
    title: "Nothing faces the internet",
    body: "Every service is reachable from my own devices over a private mesh, and from nowhere else.",
  },
  {
    title: "The host is sacred",
    body: "The base system stays read-only. Services live in containers that can be rebuilt from one repository.",
  },
  {
    title: "Write it down",
    body: "Every change gets an entry in the audit log: what changed, why, and what broke along the way.",
  },
];

export const YGG_DAY: YggMoment[] = [
  { time: "01:30", title: "Memory takes flight", body: "The notes' full history is encrypted and pushed off-site." },
  {
    time: "05:00",
    title: "The tree renews itself",
    body: "Security updates are applied. Open agent sessions are closed, and reopened where they left off after the reboot.",
  },
  {
    time: "08:30",
    title: "A voice in the morning",
    body: "Thirty spoken seconds: today's training, what fell behind, one priority, and the same closing line every day.",
  },
  { time: "09:07", title: "The ring counts", body: "Prices are checked. Silence, unless something is worth buying." },
  {
    time: "10:00",
    title: "The house breathes",
    body: "The robot cleans if nobody is home, and asks first if someone is. Again at six.",
  },
  {
    time: "Sun",
    title: "The weekly return",
    body: "What is waiting in the inbox, how the week went, and a choice: sort it myself or let the assistant propose.",
  },
];

export const YGG_FORGE: YggForgeItem[] = [
  {
    id: "tmux",
    name: "Volta & Lario",
    target: "tmux",
    body: "A transparent status bar with the Algiz rune, the current window in violet and the active pane edged in blue.",
    status: "ready",
    downloads: [{ label: "yggdrasil.tmux.conf", href: "/yggdrasil/forge/yggdrasil.tmux.conf" }],
  },
  {
    id: "obsidian",
    name: "Yggdrasil",
    target: "Obsidian",
    body: "E-ink paper in both modes, the tmux violet as the only accent, Josefin for text and a rune on every note.",
    status: "ready",
    downloads: [
      { label: "theme.css", href: "/yggdrasil/forge/obsidian-theme.css" },
      { label: "manifest.json", href: "/yggdrasil/forge/obsidian-manifest.json" },
    ],
  },
  {
    id: "nvim",
    name: "Yggdrasil",
    target: "Neovim",
    body: "The same palette in the editor, mapped the way tmux maps it: violet is what you are on, blue is the active boundary, stone is anything spent.",
    status: "ready",
    downloads: [
      { label: "yggdrasil.nvim.lua", href: "/yggdrasil/forge/yggdrasil.nvim.lua" },
    ],
  },
];

/**
 * The page's sections, as tmux windows. The status bar numbers them and
 * highlights the one you are in, so the bar is navigation rather than
 * decoration — and because one list drives both, a window cannot point at a
 * section that does not exist.
 */
export const YGG_SECTIONS: { n: number; id: string; label: string }[] = [
  { n: 1, id: "ygg-tree", label: "tree" },
  { n: 2, id: "ygg-laws", label: "laws" },
  { n: 3, id: "ygg-decisions", label: "decisions" },
  { n: 4, id: "ygg-day", label: "day" },
  { n: 5, id: "ygg-forge", label: "forge" },
];

/** Palette shared by every theme in the forge, in the order tmux uses it. */
export const YGG_PALETTE: { name: string; hex: string }[] = [
  { name: "volta", hex: "#8b5cf6" },
  { name: "volta light", hex: "#a78bfa" },
  { name: "volta mist", hex: "#c4b5fd" },
  { name: "lario", hex: "#60a5fa" },
  { name: "night", hex: "#0d1117" },
  { name: "ink", hex: "#1a1a2e" },
  { name: "stone", hex: "#64748b" },
  { name: "slate", hex: "#f3f4f6" },
];

/** Numbers shown in the status line, kept next to the data they describe. */
export const YGG_STATS: { label: string; value: string }[] = [
  { label: "services", value: String(YGG_REALMS.filter((r) => r.layer === "branches").length) },
  { label: "open ports", value: "0" },
  { label: "audit entries", value: "100+" },
];
