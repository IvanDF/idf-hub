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
