import type { ReactNode } from 'react';

export type CommandOutput = {
  type: "text" | "error" | "success" | "system" | "link";
  content: string | ReactNode;
  cta?: { label: string; cmd: string };
  /**
   * Render the line as written, without wrapping. For output that draws in
   * columns — where a wrap at a word boundary would shear the layout in half.
   */
  pre?: boolean;
};

export type HistoryItem = {
  command: string;
  output?: CommandOutput[];
};

/**
 * A look the terminal panel can wear. Separate from the site theme: `theme`
 * flips light and dark everywhere, a skin only repaints this panel.
 */
export type TerminalSkin = "default" | "yggdrasil";

/**
 * Everything a command can reach. Passed in rather than closed over, because
 * the registry is a module-level constant and the handlers need hooks.
 */
export type CommandContext = {
  args: string[];
  /**
   * The whole catalogue, for the commands that render it. Passed in rather
   * than imported, because a command file importing the registry that
   * assembles it would close a cycle.
   */
  commands: CommandEntry[];
  discoveredEggs: Set<string>;
  /**
   * Navigate after a readable beat, closing the terminal on the way out.
   * Six commands repeated the same prefetch/setTimeout/push/close four-liner;
   * it lives here once.
   */
  go: (href: string) => void;
  audio: {
    enabled: boolean;
    muted: boolean;
    toggleAudio: () => void;
    toggleMute: () => void;
  };
  theme: { toggle: () => void; playLightOn: () => void };
  auth: {
    getUser: () => Promise<{ email?: string | null } | null>;
    signOut: () => Promise<void>;
  };
  router: { prefetch: (href: string) => void };
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setGameActive: React.Dispatch<React.SetStateAction<boolean>>;
  setSkin: React.Dispatch<React.SetStateAction<TerminalSkin>>;
};

export type CommandResult = {
  outputs: CommandOutput[];
  /** Skip pushing to history — for clear, snake, exit and the empty line. */
  skipHistory?: boolean;
};

export type CommandEntry = {
  /** The name shown in the listing. */
  name: string;
  /** Other spellings that reach the same command. */
  aliases?: string[];
  /** Argument placeholder, e.g. "[keyword]". */
  arg?: string;
  /** One line, shown in the full listing. */
  summary: string;
  /** The longer story, shown under `help <category>`. */
  detail?: string;
  category: "navigate" | "explore" | "play" | "system";
  /** A command to run straight from the listing. */
  cta?: { label: string; cmd: string };
  /**
   * Runnable but kept out of the listing. For translated spellings and the
   * aliases of aliases — `apri`, `ricerca` — which would double the length of
   * help without telling anyone anything new.
   */
  hidden?: boolean;
  /** What the command actually does. */
  run: (ctx: CommandContext) => CommandResult | Promise<CommandResult>;
};

