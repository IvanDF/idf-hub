"use client";

import { useCallback, useRef, useState } from "react";
import styles from "./Cortex.module.scss";

const COLORS = ["red", "green", "blue", "yellow"] as const;
type Color = (typeof COLORS)[number];

const TOTAL_TRIALS = 12;

/** One trial: the word to show and the ink it's actually printed in. */
type Trial = { word: Color; ink: Color };

function nextTrial(): Trial {
  const word = COLORS[Math.floor(Math.random() * COLORS.length)];
  // ~60% incongruent so the interference effect actually shows up.
  const incongruent = Math.random() < 0.6;
  let ink = word;
  if (incongruent) {
    const others = COLORS.filter((c) => c !== word);
    ink = others[Math.floor(Math.random() * others.length)];
  }
  return { word, ink };
}

/**
 * Stroop interference test: name the INK color, ignore the word. Tracks
 * accuracy and average response time across a fixed run — the classic demo
 * that reading is automatic and competes with color naming.
 */
export default function StroopTest() {
  const [running, setRunning] = useState(false);
  const [trial, setTrial] = useState<Trial | null>(null);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [totalMs, setTotalMs] = useState(0);
  const [done, setDone] = useState(false);
  const shownAtRef = useRef<number>(0);

  const start = useCallback(() => {
    setRunning(true);
    setDone(false);
    setIndex(0);
    setCorrect(0);
    setTotalMs(0);
    setTrial(nextTrial());
    shownAtRef.current = performance.now();
  }, []);

  const answer = useCallback(
    (choice: Color) => {
      if (!trial) return;
      const elapsed = performance.now() - shownAtRef.current;
      const isRight = choice === trial.ink;
      const nextIndex = index + 1;

      setTotalMs((ms) => ms + elapsed);
      if (isRight) setCorrect((c) => c + 1);

      if (nextIndex >= TOTAL_TRIALS) {
        setIndex(nextIndex);
        setRunning(false);
        setDone(true);
        setTrial(null);
        return;
      }
      setIndex(nextIndex);
      setTrial(nextTrial());
      shownAtRef.current = performance.now();
    },
    [trial, index],
  );

  const avgMs = index > 0 ? Math.round(totalMs / index) : 0;

  return (
    <div className={styles.arena}>
      <div className={styles.arenaHead}>
        <span className={styles.arenaTitle}>Stroop</span>
        <span className={styles.arenaStat}>
          {running ? `${index}/${TOTAL_TRIALS}` : `${TOTAL_TRIALS} trials`}
        </span>
      </div>

      <div className={styles.arenaBody}>
        {!running && !done && (
          <>
            <p className={styles.instruction}>
              A color word appears in a colored ink. Tap the button matching the{" "}
              <strong>ink</strong>, not the word. Your reading reflex will fight
              you — that gap is the effect.
            </p>
            <button type="button" className={styles.cta} onClick={start}>
              Start
            </button>
          </>
        )}

        {running && trial && (
          <>
            <span className={styles.stroopWord} data-ink={trial.ink}>
              {trial.word.toUpperCase()}
            </span>
            <div className={styles.stroopButtons}>
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={styles.stroopButton}
                  data-color={c}
                  onClick={() => answer(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </>
        )}

        {done && (
          <>
            <span className={styles.bigStat}>
              {Math.round((correct / TOTAL_TRIALS) * 100)}
              <span className={styles.bigStatUnit}>%</span>
            </span>
            <p className={styles.instruction}>
              {correct}/{TOTAL_TRIALS} correct · avg {avgMs} ms per answer
            </p>
            <button
              type="button"
              className={`${styles.cta} ${styles.ctaGhost}`}
              onClick={start}
            >
              Run again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
