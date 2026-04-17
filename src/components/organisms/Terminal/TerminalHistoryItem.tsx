import type { HistoryItem } from "./Terminal.types";
import styles from "./Terminal.module.scss";

interface TerminalHistoryItemProps {
  item: HistoryItem;
  onExecuteCommand: (cmd: string) => void;
}

/** Renders a single terminal history entry (command + output lines). */
export default function TerminalHistoryItem({ item, onExecuteCommand }: TerminalHistoryItemProps) {
  return (
    <div className={styles.outputArea}>
      {item.command && (
        <div className={styles.line}>
          <span className={styles.prompt}>{">"}</span> {item.command}
        </div>
      )}
      {item.output?.map((out, i) => (
        <div key={i} className={`${styles.line} ${styles[out.type]}`}>
          {out.content}
          {out.cta && (
            <button className={styles.ctaBtn} onClick={() => onExecuteCommand(out.cta!.cmd)}>
              [{out.cta.label}]
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
