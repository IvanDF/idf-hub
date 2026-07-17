"use client";

import { CAREER } from "@/data/career";
import { useRef, useState } from "react";
import styles from "./WorkFork.module.scss";

interface WorkForkProps {
  liveCount: number;
  archivedCount: number;
  onPick: (view: "career" | "lab") => void;
}

// Content parallax inside the card, in px at full lean. The card itself is
// beyond the global magnet's size gate (moving surfaces this big re-runs the
// ink filter every frame), so the magnetic feel comes from the content.
const PARALLAX_X = 14;
const PARALLAX_Y = 10;

/**
 * Fork entrance for the Work page: two separate cards — The Path (career) and
 * The Lab (side projects). Hover/focus grows a card, reveals its extra
 * details, and the content leans magnetically toward the cursor; on touch the
 * cards stack with details always visible.
 */
export default function WorkFork({ liveCount, archivedCount, onPick }: WorkForkProps) {
  const [hover, setHover] = useState<"path" | "lab" | null>(null);
  const pathInnerRef = useRef<HTMLDivElement>(null);
  const labInnerRef = useRef<HTMLDivElement>(null);

  const innerFor = (side: "path" | "lab") =>
    side === "path" ? pathInnerRef.current : labInnerRef.current;

  const handleMove =
    (side: "path" | "lab") => (e: React.MouseEvent<HTMLButtonElement>) => {
      const inner = innerFor(side);
      if (!inner) return;
      // Re-measured per move on purpose: the card is resizing under the
      // pointer while it expands, so a cached rect would skew the lean.
      const rect = e.currentTarget.getBoundingClientRect();
      const nx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      const ny = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      inner.style.translate = `${(nx * PARALLAX_X).toFixed(1)}px ${(ny * PARALLAX_Y).toFixed(1)}px`;
    };

  const handleLeave = (side: "path" | "lab") => () => {
    innerFor(side)?.style.removeProperty("translate");
    setHover(null);
  };

  return (
    <div className={styles.fork} data-hover={hover ?? undefined}>
      <button
        type="button"
        data-no-stamp="true"
        className={`${styles.panel} ${styles.path}`}
        onMouseEnter={() => setHover("path")}
        onMouseMove={handleMove("path")}
        onMouseLeave={handleLeave("path")}
        onFocus={() => setHover("path")}
        onBlur={() => setHover(null)}
        onClick={() => onPick("career")}
      >
        <div className={styles.inner} ref={pathInnerRef}>
          <span className={styles.index}>01</span>
          <span className={styles.title}>The Path</span>
          <span className={styles.sub}>Career — ten years, no straight line</span>
          <ul className={styles.details}>
            <li>race control → waiter → IT Manager</li>
            <li>Como → Milano → Madrid</li>
            <li>one pivot, zero shortcuts</li>
          </ul>
          <span className={styles.meta}>{CAREER.length} chapters ↗︎</span>
        </div>
      </button>

      <button
        type="button"
        data-no-stamp="true"
        className={`${styles.panel} ${styles.lab}`}
        onMouseEnter={() => setHover("lab")}
        onMouseMove={handleMove("lab")}
        onMouseLeave={handleLeave("lab")}
        onFocus={() => setHover("lab")}
        onBlur={() => setHover(null)}
        onClick={() => onPick("lab")}
      >
        <div className={styles.inner} ref={labInnerRef}>
          <span className={styles.index}>02</span>
          <span className={styles.title}>The Lab</span>
          <span className={styles.sub}>Side projects — after hours</span>
          <ul className={styles.details}>
            <li>code · design · craft · experiments</li>
            <li>one terminal, several secrets</li>
            <li>everything here was built for fun</li>
          </ul>
          <span className={styles.meta}>
            {liveCount} live · {archivedCount} archived ↗︎
          </span>
        </div>
      </button>
    </div>
  );
}
