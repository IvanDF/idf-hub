"use client";

import Text from "@/components/atoms/text";
import { CAREER } from "@/data/career";
import Link from "next/link";
import styles from "./CareerPath.module.scss";

const TOTAL = String(CAREER.length).padStart(2, "0");

/**
 * Career timeline: one full-viewport chapter per step. The giant year is the
 * backdrop; highlights carry the concrete work (migrations, systems,
 * challenges) on recent roles. Chapters render statically visible — no
 * scroll-driven opacity, which on Safari/mobile could leave the
 * IntersectionObserver callback unfired and the text stuck invisible.
 */
export default function CareerPath() {
  return (
    <ol className={styles.path}>
      {CAREER.map((step, i) => (
        <li
          key={`${step.years}-${step.role}`}
          className={styles.step}
          data-current={step.current || undefined}
        >
          <span className={styles.watermark} aria-hidden="true">
            {step.years}
          </span>

          <div className={styles.stepInner}>
            <Text as="span" variant="label" className={styles.counter}>
              {String(i + 1).padStart(2, "0")} / {TOTAL}
            </Text>
            <Text as="span" variant="label" className={styles.years}>
              {step.years}
            </Text>
            <Text as="h3" variant="inherit" className={styles.role}>
              {step.role}
            </Text>
            <Text as="span" variant="label" className={styles.place}>
              {step.place}
            </Text>
            <Text as="p" variant="body" className={styles.note}>
              {step.note}
            </Text>

            {step.highlights && (
              <ul className={styles.highlights}>
                {step.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            )}

            {step.slug && step.story && (
              <Link
                href={`/lab/path/${step.slug}`}
                className={styles.explode}
                prefetch
              >
                {"⇲"} explode this chapter
              </Link>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
