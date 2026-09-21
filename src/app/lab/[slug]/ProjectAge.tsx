"use client";

import { useSyncExternalStore } from "react";
import styles from "./ProjectDetail.module.scss";

interface ProjectAgeProps {
  /** Project date as `YYYY-MM`, or a bare `YYYY` when the month is unknown. */
  date: string;
  /** Oldest year in the archive — the left edge of the track. */
  from: number;
}

/**
 * ChatGPT's public launch, the moment the tooling around this work changed.
 * Anything started before it was built without an LLM in the loop.
 */
const LLM_ERA_START = "2022-11";

/** Months between a `YYYY-MM` string and a reference date. */
function monthsSince(date: string, now: Date): number {
  const [year, month] = date.split("-").map(Number);
  // A bare year is anchored mid-year so the marker never claims a precision
  // the data does not have.
  const monthIndex = Number.isFinite(month) ? month - 1 : 6;
  return (now.getFullYear() - year) * 12 + (now.getMonth() - monthIndex);
}

/** Which side of the LLM line a project falls on. */
function eraLabel(date: string): string {
  const normalised = date.length === 4 ? `${date}-06` : date;
  return normalised < LLM_ERA_START ? "pre-LLM" : "post-LLM";
}

/**
 * Places a project on the archive's timeline and marks which side of the LLM
 * line it falls on. The position is measured in the browser rather than at
 * build time, so a statically generated page never goes stale.
 *
 * @param date - Project date as `YYYY-MM` or `YYYY`.
 * @param from - First year of the archive, used as the track's left edge.
 */
/** Mount detector: `false` on the server pass, `true` once hydrated. */
const subscribeNever = () => () => {};

export default function ProjectAge({ date, from }: ProjectAgeProps) {
  // Deferred to the client: rendering a relative time on the server would
  // either mismatch on hydration or freeze at the moment of the build.
  const hydrated = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );

  if (!hydrated) return null;

  const now = new Date();
  const months = monthsSince(date, now);
  const span = monthsSince(`${from}-01`, now);
  // Oldest work sits at the left edge, today at the right.
  const position = span > 0 ? 1 - Math.min(Math.max(months / span, 0), 1) : 1;
  const era = eraLabel(date);

  return (
    <span className={styles.age}>
      <span className={styles.ageTrack} aria-hidden>
        <span
          className={styles.ageDot}
          // The one legitimate inline style here: the dot's offset is data,
          // not design, and cannot be expressed as a class.
          style={{ left: `${position * 100}%` }}
        />
      </span>
      <span className={styles.ageLabel} data-era={era}>
        {era}
      </span>
    </span>
  );
}
