"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Cortex.module.scss";

type Phase = "idle" | "waiting" | "go" | "tooSoon" | "result";

const MIN_DELAY_MS = 1400;
const MAX_DELAY_MS = 3800;

/**
 * Simple visual reaction-time test: wait for the pad to turn green, then tap.
 * Reports the last time and the best across the session. Timing uses
 * `performance.now()` for sub-millisecond, monotonic measurement.
 */
export default function ReactionTest() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [last, setLast] = useState<number | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const goAtRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => clearTimer, []);

  const arm = useCallback(() => {
    setPhase("waiting");
    const delay = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
    timerRef.current = setTimeout(() => {
      goAtRef.current = performance.now();
      setPhase("go");
    }, delay);
  }, []);

  const handlePad = useCallback(() => {
    switch (phase) {
      case "idle":
      case "result":
      case "tooSoon":
        arm();
        break;
      case "waiting":
        // Jumped the gun — cancel the pending "go" and flag it.
        clearTimer();
        setPhase("tooSoon");
        break;
      case "go": {
        const ms = Math.round(performance.now() - goAtRef.current);
        setLast(ms);
        setBest((prev) => (prev === null ? ms : Math.min(prev, ms)));
        setPhase("result");
        break;
      }
    }
  }, [phase, arm]);

  const padClass = {
    idle: styles.reactionIdle,
    waiting: styles.reactionWait,
    go: styles.reactionGo,
    tooSoon: styles.reactionIdle,
    result: styles.reactionResult,
  }[phase];

  const padLabel = {
    idle: "Tap to start",
    waiting: "Wait for green…",
    go: "TAP NOW",
    tooSoon: "Too soon — tap to retry",
    result: null,
  }[phase];

  return (
    <div className={styles.arena}>
      <div className={styles.arenaHead}>
        <span className={styles.arenaTitle}>Reaction</span>
        <span className={styles.arenaStat}>
          {best !== null ? `best ${best} ms` : "no runs yet"}
        </span>
      </div>

      <div className={styles.arenaBody}>
        <p className={styles.instruction}>
          When the pad turns green, tap as fast as you can. Simple visuomotor
          latency — the loop from photons to finger.
        </p>

        <button
          type="button"
          className={`${styles.reactionPad} ${padClass}`}
          onClick={handlePad}
          aria-label={padLabel ?? `Reaction time ${last} milliseconds`}
        >
          {phase === "result" ? (
            <>
              <span className={styles.bigStat}>
                {last}
                <span className={styles.bigStatUnit}>ms</span>
              </span>
              <span className={styles.arenaStat}>tap to go again</span>
            </>
          ) : (
            padLabel
          )}
        </button>
      </div>
    </div>
  );
}
