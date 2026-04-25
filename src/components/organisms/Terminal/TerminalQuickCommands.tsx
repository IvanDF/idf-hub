"use client";

import ShareCommandButton from "@/components/atoms/ShareCommandButton";
import styles from "./Terminal.module.scss";

export type QuickCommand = {
  label: string;
  command: string;
};

const SITE_COMMANDS: QuickCommand[] = [
  { label: "lab", command: "lab" },
  { label: "search", command: "search " },
  { label: "guide", command: "guide" },
  { label: "theme", command: "theme" },
  { label: "whoami", command: "whoami" },
  { label: "help", command: "help" },
];

const ADMIN_COMMANDS: QuickCommand[] = [
  { label: "list", command: "list" },
  { label: "add", command: "add" },
  { label: "status", command: "status" },
  { label: "theme", command: "theme" },
  { label: "logout", command: "logout" },
  { label: "site", command: "site" },
];

interface TerminalQuickCommandsProps {
  context?: 'site' | 'admin';
  onCommand: (command: string) => void;
}

export default function TerminalQuickCommands({
  context = 'site',
  onCommand,
}: TerminalQuickCommandsProps) {
  const commands = context === 'admin' ? ADMIN_COMMANDS : SITE_COMMANDS;
  return (
    <div className={styles.quickCommands} onClick={(e) => e.stopPropagation()}>
      {commands.map((cmd) => (
        <div key={cmd.command} className={styles.quickCommandGroup}>
          <button
            type="button"
            onClick={() => onCommand(cmd.command)}
          >
            {cmd.label}
          </button>
          <ShareCommandButton command={cmd.command} />
        </div>
      ))}
    </div>
  );
}

