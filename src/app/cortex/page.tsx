"use client";

import {
  MemoryTest,
  ReactionTest,
  StroopTest,
} from "@/components/organisms/cortex";
import Link from "next/link";
import { useState } from "react";
import styles from "@/components/organisms/cortex/Cortex.module.scss";

const TESTS = [
  {
    id: "reaction",
    name: "Reaction",
    hint: "How fast does photons-to-finger fire?",
  },
  {
    id: "stroop",
    name: "Stroop",
    hint: "Name the ink, not the word.",
  },
  {
    id: "memory",
    name: "Memory",
    hint: "Repeat a growing pattern.",
  },
] as const;

type TestId = (typeof TESTS)[number]["id"];

/**
 * Hidden "cortex lab" — three real cognitive tests, reached via the terminal
 * `cortex` / `brain` commands. A nod to Ivan's neuroscience reading, framed as
 * play rather than a portfolio piece.
 */
export default function CortexPage() {
  const [active, setActive] = useState<TestId>("reaction");

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <span className={styles.eyebrow}>⬡ Cortex Lab — you found it</span>
        <h1 className={styles.title}>Test your brain</h1>
        <p className={styles.lede}>
          I read a lot about how minds work, so here are three genuine cognitive
          tasks from the literature. Not a benchmark — a mirror. Notice how each
          one feels from the inside.
        </p>
      </header>

      <div className={styles.picker} role="tablist" aria-label="Cognitive tests">
        {TESTS.map((t, i) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active === t.id}
            className={styles.pickerTab}
            onClick={() => setActive(t.id)}
          >
            <span className={styles.pickerIndex}>0{i + 1}</span>
            <span className={styles.pickerName}>{t.name}</span>
            <span className={styles.pickerHint}>{t.hint}</span>
          </button>
        ))}
      </div>

      {active === "reaction" && <ReactionTest />}
      {active === "stroop" && <StroopTest />}
      {active === "memory" && <MemoryTest />}

      <footer className={styles.footer}>
        <p className={styles.footerNote}>
          Results stay in your browser and reset on reload — nothing is stored or
          sent. Different angles, better questions: what would you measure next?
        </p>
        <Link href="/" className={styles.backLink}>
          &lt; back to surface
        </Link>
      </footer>
    </main>
  );
}
