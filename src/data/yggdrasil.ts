import type { YggForgeItem, YggLaw, YggMoment, YggRealm } from "@/types/yggdrasil";

/**
 * The services, in the reading order of the Nine Realms map: the seat of rule
 * first (Ásgarðr), then story and song (Álfheimr), what provides (Vanaheimr),
 * the well at the root (Niflheim) and what is kept but no longer lives
 * (Helheimr). The grouping is documentation, not architecture: nothing is
 * merged, every service keeps its own unit and its one purpose.
 *
 * Sourced from the server's own documents, which are the thing that is kept
 * current: `docs/system.xml` for what each service is and `docs/realms.md`
 * for where it belongs. Runes come from `system.xml`, not from memory, two of
 * them were wrong here for months.
 */
export const YGG_REALMS: YggRealm[] = [
  {
    id: "ground",
    rune: "ᛟ",
    name: "The ground",
    layer: "roots",
    myth: "Othala · the inherited land",
    role: "A 2017 HP Elite x2 running Fedora Silverblue",
    detail:
      "An old 2-in-1 with an i5 and 8 GB of memory. The operating system is read-only and atomic: updates land as a new image, and the previous one is always a reboot away.",
  },
  {
    id: "trunk",
    rune: "ᛇ",
    name: "The trunk",
    layer: "trunk",
    myth: "Eihwaz · the yew that connects the worlds",
    role: "Rootless Podman containers under systemd, reachable over Tailscale",
    detail:
      "Every service is a container started by systemd, never by hand. A private mesh network is the only way in: nothing listens on the open internet.",
  },
  {
    id: "heimdallr",
    rune: "ᚨ",
    name: "Heimdallr",
    layer: "branches",
    myth: "The watchman who sees all",
    role: "Home Assistant",
    detail:
      "Runs the house. The robot vacuum cleans twice a day, on its own if nobody is home and after asking if someone is, and every alert from the system reaches the phone through it.",
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
    id: "mimir",
    rune: "ᛗ",
    name: "Mímir",
    layer: "branches",
    myth: "The well Óðinn gave an eye to drink from",
    role: "A place for what I work out about myself",
    detail:
      "Nothing to tick off, no streaks, no score. It asks one question in the morning, and at night hands back one of my own earlier answers at random, because something you realise once and never return to is something you have lost.",
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
  {
    id: "kvasir",
    rune: "ᚲ",
    name: "Kvasir",
    layer: "branches",
    myth: "Brewed from the truce of the gods, the wisest of beings",
    role: "The brand, kept honest",
    detail:
      "Reads my public profiles against what I have actually written down about the work, and drafts the difference. Run by hand and never on a timer: it is counsel, not a cron job.",
  },
  {
    id: "bragi",
    rune: "ᚷ",
    name: "Bragi",
    layer: "branches",
    myth: "The god of poetry and song",
    role: "Media server",
    detail: "A personal streaming library, reachable from any of my devices and from nowhere else.",
  },
  {
    id: "edda",
    rune: "ᛖ",
    name: "Edda",
    layer: "branches",
    myth: "The books in which the myths survived",
    role: "Audiobooks and ebooks",
    detail:
      "A library whose files I actually hold. Apple locks purchases to Apple and Kindle trades one lock for another; here the app is the replaceable part, so changing phone does not move the shelf.",
  },
  {
    id: "saga",
    rune: "ᛊ",
    name: "Sága",
    layer: "branches",
    myth: "She who drinks with Óðinn, and keeps the telling",
    role: "Reading, and what gets highlighted",
    detail:
      "The audiobook server tracks a position in time and cannot annotate a text, so reading lives here instead. Highlights do not stay in the reader: once a day they land in my notes, one page per book, under whatever I had already written there.",
  },
  {
    id: "njord",
    rune: "ᛚ",
    name: "Njord",
    layer: "branches",
    myth: "The god of sea and wind, a Vanir",
    role: "Torrents, behind a mandatory tunnel",
    detail:
      "The client has no network of its own: it borrows the VPN container's, so if the tunnel drops there is nothing left to leak through. It starts when I ask and shuts itself down after an hour of quiet, because this machine is also a laptop.",
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
      "Keeps a readable copy of the notes on the server, so scripts and the assistant can read them, log a workout or tidy the inbox, and every change flows back to every device.",
  },
  {
    id: "fulla",
    rune: "ᚠ",
    name: "Fulla",
    layer: "branches",
    myth: "She who carries Frigg's casket, and knows what is in it",
    role: "The password vault",
    detail:
      "The master password never leaves the device, so the server only ever stores ciphertext. There is no admin panel to break into, by choice, and every client keeps an encrypted copy: the vault still opens when the server is down.",
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
    title: "Backups are not optional",
    body: "Automatic, encrypted, with a retention policy. Local protects me from myself, off-site protects me from the building.",
  },
  {
    title: "Write it down",
    body: "Every change gets an entry in the audit log: what changed, why, and what broke along the way.",
  },
];

export const YGG_DAY: YggMoment[] = [
  {
    time: "00:52",
    title: "The raven remembers",
    body: "The whole machine is saved to an encrypted archive on disk, with a second copy on a card.",
  },
  { time: "01:30", title: "Memory takes flight", body: "The notes' full history is encrypted and pushed off-site." },
  {
    time: "05:00",
    title: "The tree renews itself",
    body: "Security updates are applied. Open agent sessions are closed, and reopened where they left off after the reboot.",
  },
  {
    time: "08:30",
    title: "A voice in the morning",
    body: "Thirty spoken seconds: today's training, what fell behind, one priority, and a nudge outward that is never the same two weeks running. Then one question, which I can answer from the lock screen.",
  },
  { time: "09:07", title: "The ring counts", body: "Prices are checked. Silence, unless something is worth buying." },
  {
    time: "10:00",
    title: "The house breathes",
    body: "The robot cleans if nobody is home, and asks first if someone is. Again at six.",
  },
  {
    time: "21:30",
    title: "The echo",
    body: "One thing I worked out weeks ago, picked at random and handed back to me. It can only ever quote me to myself, which is the whole point.",
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
 * decoration, and because one list drives both, a window cannot point at a
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

/**
 * Numbers shown in the status line, kept next to the data they describe.
 *
 * The audit count is the one figure here that cannot be derived, so it is the
 * one that goes stale: it is the last §number in the server's own audit log,
 * read from `audit.md` rather than remembered. It said "100+" while the log
 * was at 154.
 */
export const YGG_STATS: { label: string; value: string }[] = [
  { label: "services", value: String(YGG_REALMS.filter((r) => r.layer === "branches").length) },
  { label: "open ports", value: "0" },
  { label: "audit entries", value: "154" },
];
