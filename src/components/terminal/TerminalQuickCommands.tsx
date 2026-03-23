"use client";

import styles from "@/components/home/Terminal.module.scss";

export type QuickCommand = {
  label: string;
  command: string;
};

const DEFAULT_COMMANDS: QuickCommand[] = [
  { label: "help", command: "help" },
  { label: "theme", command: "theme" },
  { label: "projects", command: "projects" },
  { label: "eggs", command: "eggs" },
  { label: "whoami", command: "whoami" },
];

interface TerminalQuickCommandsProps {
  commands?: QuickCommand[];
  onCommand: (command: string) => void;
}

export default function TerminalQuickCommands({ 
  commands = DEFAULT_COMMANDS,
  onCommand 
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
