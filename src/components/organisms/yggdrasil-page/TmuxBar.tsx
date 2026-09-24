"use client";

import { YGG_STATS } from "@/data/yggdrasil";
import { useClock } from "@/hooks/useClock";
import styles from "./YggdrasilPage.module.scss";

/** A tmux status line: the Algiz rune on the left, stats and clock on the right. */
export default function TmuxBar() {
  const time = useClock();

  return (
    <header className={styles.tmux} aria-label="Status line">
      <span className={styles.tmuxLeft}>
        <span aria-hidden="true">▎</span>
        <strong className={styles.tmuxRune}>ᛉ</strong>
        <span className={styles.tmuxWindow}>1 yggdrasil</span>
      </span>
      <span className={styles.tmuxRight}>
        {YGG_STATS.map((s) => (
          <span key={s.label} className={styles.tmuxStat}>
            {s.label} <b>{s.value}</b>
          </span>
        ))}
        <time className={styles.tmuxClock} suppressHydrationWarning>
          {time}
        </time>
        <span aria-hidden="true">ᚠ ▎</span>
      </span>
    </header>
  );
}
