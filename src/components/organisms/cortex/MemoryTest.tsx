"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Cortex.module.scss";

const PADS = ["red", "green", "blue", "yellow"] as const;
type Pad = (typeof PADS)[number];

type Phase = "idle" | "showing" | "input" | "over";

const LIT_MS = 420;
const GAP_MS = 220;

/**
 * Sequence-memory test (Simon-style): watch a growing pattern, then repeat it.
 * The level reached is a rough proxy for visuospatial working-memory span,
 * which tops out for most people around 7±2 steps.
 */
export default function MemoryTest() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [sequence, setSequence] = useState<Pad[]>([]);
  const [lit, setLit] = useState<Pad | null>(null);
  const [best, setBest] = useState(0);
  const inputPosRef = useRef(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };
  useEffect(() => clearTimers, []);

  const playback = useCallback((seq: Pad[]) => {
    setPhase("showing");
    setLit(null);
    seq.forEach((pad, i) => {
      const onAt = i * (LIT_MS + GAP_MS) + GAP_MS;
      timersRef.current.push(setTimeout(() => setLit(pad), onAt));
      timersRef.current.push(setTimeout(() => setLit(null), onAt + LIT_MS));
    });
    const totalMs = seq.length * (LIT_MS + GAP_MS) + GAP_MS;
    timersRef.current.push(
      setTimeout(() => {
        inputPosRef.current = 0;
        setPhase("input");
      }, totalMs),
    );
  }, []);

  const start = useCallback(() => {
    clearTimers();
    const first: Pad[] = [PADS[Math.floor(Math.random() * PADS.length)]];
    setSequence(first);
    playback(first);
  }, [playback]);

  const flash = useCallback((pad: Pad) => {
    setLit(pad);
    timersRef.current.push(setTimeout(() => setLit(null), 160));
  }, []);

  const handlePad = useCallback(
    (pad: Pad) => {
      if (phase !== "input") return;
      flash(pad);

      if (pad !== sequence[inputPosRef.current]) {
        setPhase("over");
        setBest((b) => Math.max(b, sequence.length - 1));
        return;
      }

      inputPosRef.current += 1;
      if (inputPosRef.current >= sequence.length) {
        // Round cleared — extend the sequence and replay after a beat.
        const next: Pad[] = [
          ...sequence,
          PADS[Math.floor(Math.random() * PADS.length)],
        ];
        setBest((b) => Math.max(b, sequence.length));
        timersRef.current.push(
          setTimeout(() => {
            setSequence(next);
            playback(next);
          }, 520),
        );
      }
    },
    [phase, sequence, flash, playback],
  );

  const level = phase === "over" ? Math.max(0, sequence.length - 1) : sequence.length;

  return (
    <div className={styles.arena}>
      <div className={styles.arenaHead}>
        <span className={styles.arenaTitle}>Memory</span>
        <span className={styles.arenaStat}>
          {best > 0 ? `best level ${best}` : "no runs yet"}
        </span>
      </div>

      <div className={styles.arenaBody}>
        {phase === "idle" && (
          <>
            <p className={styles.instruction}>
              Watch the pattern light up, then repeat it. Each round adds one
              step. How long a sequence can your working memory hold?
            </p>
            <button type="button" className={styles.cta} onClick={start}>
              Start
            </button>
          </>
        )}

        {(phase === "showing" || phase === "input") && (
          <>
            <p className={styles.instruction}>
              {phase === "showing" ? "Watch…" : `Repeat — level ${level}`}
            </p>
            <div className={styles.memoryGrid}>
              {PADS.map((pad) => (
                <button
                  key={pad}
                  type="button"
                  className={styles.memoryPad}
                  data-color={pad}
                  data-lit={lit === pad}
                  disabled={phase !== "input"}
                  onClick={() => handlePad(pad)}
                  aria-label={pad}
                />
              ))}
            </div>
          </>
        )}

        {phase === "over" && (
          <>
            <span className={styles.bigStat}>{level}</span>
            <p className={styles.instruction}>
              levels remembered. Most people stall between 5 and 9.
            </p>
            <button
              type="button"
              className={`${styles.cta} ${styles.ctaGhost}`}
              onClick={start}
            >
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
