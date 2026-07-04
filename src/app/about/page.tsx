import Text from "@/components/atoms/text";
import TextScramble from "@/components/atoms/text-scramble/TextScramble";
import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "About",
  description: "Ivan Del Fatti — Driven by curiosity, refined through design.",
};

const ticker = [
  "INTERACTIVE",
  "MOTION",
  "SYSTEMS",
  "CODE",
  "CRAFT",
  "DETAIL",
  "PLAY",
  "DESIGN",
  "FRONTEND",
  "CREATIVE",
  "PRECISION",
  "TYPOGRAPHY",
];

const interests = [
  { label: "Systems & visual thinking", note: "patterns, clarity, structure" },
  { label: "Fitness & human performance", note: "the hardware side" },
  { label: "Exploration & photography", note: "capturing moments and places" },
];

export default function AboutPage() {
  return (
    <main className={styles.page}>
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <TextScramble
            as="h1"
            text="IVAN DEL FATTI"
            className={styles.heroName}
            delay={100}
          />
          <Text as="h2" className={styles.heroRole}>
            DRIVEN BY CURIOSITY.<br />
            REFINED THROUGH DESIGN.
          </Text>
        </div>

        <div className={styles.heroMeta}>
          <div className={styles.metaItem}>
            <Text as="span" variant="label" className={styles.metaLabel}>Based</Text>
            <Text as="span" variant="body" className={styles.metaValue}>Madrid, Spain</Text>
          </div>
          <div className={styles.metaItem}>
            <Text as="span" variant="label" className={styles.metaLabel}>Focus</Text>
            <Text as="span" variant="body" className={styles.metaValue}>Solving problems</Text>
          </div>
          <div className={styles.metaItem}>
            <Text as="span" variant="label" className={styles.metaLabel}>Status</Text>
            <Text as="span" variant="body" className={styles.metaValueAccent}>Available</Text>
          </div>
        </div>
      </section>

      {/* ── TICKER ───────────────────────────────────────────────────── */}
      <div className={styles.tickerWrap} aria-hidden="true">
        <div className={styles.tickerTrack}>
          {[...ticker, ...ticker].map((word, i) => (
            <span key={i} className={styles.tickerItem}>
              {word} <span className={styles.tickerDot}>—</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── INTRO ────────────────────────────────────────────────────── */}
      <section className={styles.manifesto}>
        <Text as="p" variant="body" className={styles.manifestoText}>
          Driven by curiosity, refined through design. Exploring patterns,
          questioning assumptions, and solving problems from unexpected angles.
        </Text>
      </section>

      {/* ── GRID ─────────────────────────────────────────────────────── */}
      <section className={styles.grid}>
        {/* Interests block */}
        <div className={`${styles.cell} ${styles.cellInterests}`}>
          <Text as="span" variant="label" className={styles.cellLabel}>Interests</Text>
          <ul className={styles.interestList}>
            {interests.map(({ label, note }) => (
              <li key={label} className={styles.interestItem}>
                <Text as="span" variant="body" className={styles.interestName}>{label}</Text>
                <Text as="span" variant="label" className={styles.interestNote}>{note}</Text>
              </li>
            ))}
          </ul>
        </div>

        {/* Manifesto number */}
        <div className={`${styles.cell} ${styles.cellStat}`}>
          <span className={styles.statNumber}>
            <TextScramble text="10+" delay={600} />
          </span>
          <Text as="span" variant="label" className={styles.statLabel}>YEARS<br />OBSERVING PATTERNS</Text>
        </div>

        {/* Personal quote */}
        <div className={`${styles.cell} ${styles.cellQuote}`}>
          <blockquote className={styles.quote}>
            &ldquo;Good design starts where assumptions end.&rdquo;
          </blockquote>
        </div>

      </section>

      {/* ── BRAND TAGLINE ────────────────────────────────────────────── */}
      <section className={styles.tagline}>
        <div className={styles.taglineInner}>
          <TextScramble
            as="p"
            text="DIFFERENT ANGLES."
            className={styles.taglineLine}
            delay={200}
          />
          <TextScramble
            as="p"
            text="BETTER QUESTIONS."
            className={styles.taglineLineAccent}
            delay={800}
          />
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────── */}
      <section className={styles.contact}>
        <div className={styles.contactText}>
          <TextScramble
            as="p"
            text="WHAT'S THE REAL PROBLEM?"
            className={styles.contactHeading}
            delay={400}
          />
        </div>

        <div className={styles.contactLinks}>
          <a
            href="https://www.linkedin.com/in/ivandf/"
            target="_blank"
            rel="noreferrer"
            className={styles.contactLink}
          >
            LinkedIn {"↗︎"}
          </a>
          <a
            href="https://github.com/IvanDF"
            target="_blank"
            rel="noreferrer"
            className={styles.contactLink}
          >
            GitHub {"↗︎"}
          </a>
          <Link href="/lab" className={styles.contactLink}>
            Work {"↗︎"}
          </Link>
        </div>
      </section>
    </main>
  );
}
