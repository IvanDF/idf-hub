export type CommandOutput = {
  type: "text" | "error" | "success" | "system" | "link";
  content: string | React.ReactNode;
};

export type HistoryItem = {
  command: string;
  output?: CommandOutput[];
};
