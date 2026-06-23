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
  { label: "Creative coding", note: "canvas, WebGL, particles" },
  { label: "Type & visual systems", note: "type as visual language" },
  { label: "Fitness & neuroscience", note: "the hardware side" },
  { label: "Exploration & photography", note: "capturing moments and places" },
];

const quotes = [
  {
    text: "Detail is not the details. It\u2019s the design.",
    author: "Charles Eames",
  },
  {
    text: "God is in the details.",
    author: "Mies van der Rohe",
  },
  {
    text: "Simplicity is complexity resolved.",
    author: "Constantin Brancusi",
  },
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
          <p className={styles.heroRole}>
            Driven by curiosity, <br />
            refined through design.
          </p>
        </div>

        <div className={styles.heroMeta}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Based</span>
            <span className={styles.metaValue}>Madrid, Spain</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Focus</span>
            <span className={styles.metaValue}>Solving problems</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Status</span>
            <span className={styles.metaValueAccent}>Available</span>
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

      {/* ── MANIFESTO ────────────────────────────────────────────────── */}
      <section className={styles.manifesto}>
        <p className={styles.manifestoText}>
          I build interactive web experiences with precision and personality.
          Not just functional — felt. The kind of interface that makes someone
          pause, notice, and remember.
        </p>
      </section>

      {/* ── GRID ─────────────────────────────────────────────────────── */}
      <section className={styles.grid}>
        {/* Interests block */}
        <div className={`${styles.cell} ${styles.cellInterests}`}>
          <span className={styles.cellLabel}>Interests</span>
          <ul className={styles.interestList}>
            {interests.map(({ label, note }) => (
              <li key={label} className={styles.interestItem}>
                <span className={styles.interestName}>{label}</span>
                <span className={styles.interestNote}>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Manifesto number */}
        <div className={`${styles.cell} ${styles.cellStat}`}>
          <span className={styles.statNumber}>
            <TextScramble text="10+" delay={600} />
          </span>
          <span className={styles.statLabel}>Years creating & solving</span>
        </div>

        {/* Quote blocks */}
        <div className={`${styles.cell} ${styles.cellQuote}`}>
          {quotes.map((q, i) => (
            <div key={i} className={styles.quoteBlock}>
              <blockquote className={styles.quote}>
                &ldquo;{q.text}&rdquo;
              </blockquote>
              <cite className={styles.quoteAuthor}>&mdash; {q.author}</cite>
            </div>
          ))}
        </div>

        {/* Stack block */}
        <div className={`${styles.cell} ${styles.cellStack}`}>
          <span className={styles.cellLabel}>Current stack</span>
          <div className={styles.stackGrid}>
            {[
              "Next.js",
              "React",
              "TypeScript",
              "SCSS",
              "Three.js",
              "Figma",
            ].map((tool) => (
              <span key={tool} className={styles.stackTag}>
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────── */}
      <section className={styles.contact}>
        <div className={styles.contactText}>
          <TextScramble
            as="p"
            text="WHAT PROBLEM"
            className={styles.contactHeading}
            delay={400}
          />
          <TextScramble
            as="p"
            text="DO YOU WANT TO SOLVE?"
            className={styles.contactHeading}
            delay={700}
          />
        </div>

        <div className={styles.contactLinks}>
          <a
            href="https://www.linkedin.com/in/ivandf/"
            target="_blank"
            rel="noreferrer"
            className={styles.contactLink}
          >
            LinkedIn ↗
          </a>
          <a
            href="https://github.com/IvanDF"
            target="_blank"
            rel="noreferrer"
            className={styles.contactLink}
          >
            GitHub ↗
          </a>
          <Link href="/lab" className={styles.contactLink}>
            Work ↗
          </Link>
        </div>
      </section>
    </main>
  );
}
