"use client";

import { YGG_SECTIONS, YGG_STATS } from "@/data/yggdrasil";
import { useClock } from "@/hooks/useClock";
import { useEffect, useState } from "react";
import styles from "./YggdrasilPage.module.scss";

/**
 * A tmux status line: the Algiz rune, the page's sections as numbered windows,
 * then stats and the clock.
 *
 * The windows are navigation, not decoration — the one you are reading is
 * highlighted the way tmux highlights the current window, and clicking one
 * jumps to that section.
 *
 * Tracked with an IntersectionObserver rather than a scroll handler: the
 * browser reports the crossings itself, so nothing runs on every frame of a
 * scroll. That matters here more than most places, given what a scroll
 * listener plus a filter once did to this site.
 */
export default function TmuxBar() {
  const time = useClock();
  const [active, setActive] = useState(YGG_SECTIONS[0].id);

  useEffect(() => {
    const sections = YGG_SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;

    // A section counts as the one being read once its heading has passed the
    // line, so the current window is the last one above it.
    const LINE = () => window.innerHeight * 0.3;

    const pick = () => {
      const passed = sections.filter((el) => el.getBoundingClientRect().top <= LINE());
      setActive((passed[passed.length - 1] ?? sections[0]).id);
    };

    // Recomputed from all five positions rather than from the entries alone:
    // the observer only reports what crossed, and at the top of the page
    // nothing is inside the band at all — reading only the crossings left the
    // highlight stuck wherever it had last been.
    const observer = new IntersectionObserver(pick, {
      rootMargin: "0px 0px -70% 0px",
      threshold: 0,
    });

    sections.forEach((el) => observer.observe(el));
    pick(); // settle on the right window before the first crossing
    return () => observer.disconnect();
  }, []);

  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  return (
    <header className={styles.tmux} aria-label="Status line">
      <span className={styles.tmuxLeft}>
        <span aria-hidden="true">▎</span>
        <strong className={styles.tmuxRune}>ᛉ</strong>

        <nav className={styles.tmuxWindows} aria-label="Sections">
          {YGG_SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={styles.tmuxWindow}
              data-current={s.id === active ? "true" : undefined}
              aria-current={s.id === active ? "true" : undefined}
              onClick={() => jump(s.id)}
            >
              {s.n} {s.label}
            </button>
          ))}
        </nav>
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
