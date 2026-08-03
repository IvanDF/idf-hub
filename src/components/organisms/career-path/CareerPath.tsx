"use client";

import Text from "@/components/atoms/text";
import { CAREER } from "@/data/career";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import styles from "./CareerPath.module.scss";

const TOTAL = String(CAREER.length).padStart(2, "0");

/**
 * Scroll-driven career timeline: one full-viewport chapter per step, animated
 * into view as it scrolls. The giant year is the backdrop; highlights carry
 * the concrete work (migrations, systems, challenges) on recent roles.
 */
export default function CareerPath() {
  const reduceMotion = useReducedMotion();

  return (
    <ol className={styles.path}>
      {CAREER.map((step, i) => (
        <motion.li
          key={`${step.years}-${step.role}`}
          className={styles.step}
          data-current={step.current || undefined}
          initial={reduceMotion ? false : { opacity: 0, y: 56 }}
          whileInView={{ opacity: 1, y: 0 }}
          // once: true — a chapter fades in a single time and stays put. With
          // once:false the step reset to opacity:0 every time it left the
          // viewport; on mobile the address-bar show/hide resizes the viewport
          // and shifts the IntersectionObserver thresholds, so the re-entry
          // callback could fail to fire and the whole timeline vanished.
          viewport={{ amount: 0.2, once: true }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
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
        </motion.li>
      ))}
    </ol>
  );
}
