import type { ReactNode } from 'react';

export type CommandOutput = {
  type: "text" | "error" | "success" | "system" | "link";
  content: string | ReactNode;
};

export type HistoryItem = {
  command: string;
  output?: CommandOutput[];
};
