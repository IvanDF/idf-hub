import type { ReactNode } from 'react';

export type CommandOutput = {
  type: "text" | "error" | "success" | "system" | "link";
  content: string | ReactNode;
  cta?: { label: string; cmd: string };
};

export type HistoryItem = {
  command: string;
  output?: CommandOutput[];
};
