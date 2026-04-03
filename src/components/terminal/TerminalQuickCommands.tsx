"use client";

import styles from "@/components/home/Terminal.module.scss";

export type QuickCommand = {
  label: string;
  command: string;
};

const DEFAULT_COMMANDS: QuickCommand[] = [
  { label: "home", command: "home" },
  { label: "lab", command: "lab" },
  { label: "guide", command: "guide" },
  { label: "help", command: "help" },
  { label: "search", command: "search " },
  { label: "theme", command: "theme" },
  { label: "whoami", command: "whoami" },
];

interface TerminalQuickCommandsProps {
  commands?: QuickCommand[];
  onCommand: (command: string) => void;
}

export default function TerminalQuickCommands({
  commands = DEFAULT_COMMANDS,
  onCommand,
}: TerminalQuickCommandsProps) {
  return (
    <div className={styles.quickCommands} onClick={(e) => e.stopPropagation()}>
      {commands.map((cmd) => (
        <button
          key={cmd.command}
          type="button"
          onClick={() => onCommand(cmd.command)}
        >
          {cmd.label}
        </button>
      ))}
    </div>
  );
}
