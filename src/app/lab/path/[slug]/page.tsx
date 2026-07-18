import Text from "@/components/atoms/text";
import { CAREER } from "@/data/career";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./page.module.scss";

const CHAPTERS = CAREER.filter(
  (s): s is typeof s & { slug: string; story: NonNullable<typeof s.story> } =>
    Boolean(s.slug && s.story),
);

export function generateStaticParams() {
  return CHAPTERS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const step = CHAPTERS.find((s) => s.slug === slug);
  if (!step) return {};
  return {
    title: `${step.role} · ${step.place}`,
    description: step.story.intro,
    alternates: { canonical: `/lab/path/${slug}` },
  };
}

/**
 * The exploded view of a career chapter: the phases, tasks and doubts behind
 * one line of the timeline. Content lives in `CAREER[].story`.
 */
export default async function CareerChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const step = CHAPTERS.find((s) => s.slug === slug);
  if (!step) notFound();

  const { story } = step;

  return (
    <main className={styles.container}>
      <Link href="/lab?view=career" className={styles.backLink}>
        {"←"} The Path
      </Link>

      <header className={styles.header}>
        <Text as="span" variant="label" className={styles.years}>
          {step.years}
        </Text>
        <Text as="h1" variant="h1" className={styles.role}>
          {step.role}
        </Text>
        <Text as="span" variant="label" className={styles.place}>
          {step.place}
        </Text>
        <Text as="p" variant="body" className={styles.intro}>
          {story.intro}
        </Text>
      </header>

      <section className={styles.phases} aria-label="Phases">
        {story.phases.map((phase, i) => (
          <div key={phase.title} className={styles.phase}>
            <div className={styles.phaseNum}>{String(i + 1).padStart(2, "0")}</div>
            <div className={styles.phaseBody}>
              <Text as="h2" variant="h2" className={styles.phaseTitle}>
                {phase.title}
              </Text>
              <Text as="p" variant="body" className={styles.phaseText}>
                {phase.body}
              </Text>
            </div>
          </div>
        ))}
      </section>

      {story.outcomes && (
        <section className={styles.outcomes} aria-label="Outcomes">
          <Text as="h2" variant="label" className={styles.sectionLabel}>
            What it left behind
          </Text>
          <ul className={styles.outcomeList}>
            {story.outcomes.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </section>
      )}

      {story.stack && (
        <footer className={styles.footer}>
          {story.stack.map((t) => (
            <Text as="span" key={t} variant="label" className={styles.stackTag}>
              {t}
            </Text>
          ))}
        </footer>
      )}
    </main>
  );
}
