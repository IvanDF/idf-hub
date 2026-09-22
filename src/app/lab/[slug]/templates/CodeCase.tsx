import Text from "@/components/atoms/text";
import type { Project } from "@/types/project";
import ProjectMedia from "../ProjectMedia";
import styles from "../ProjectDetail.module.scss";

interface CodeCaseProps {
  project: Project;
  frames: string[];
}

/**
 * Detail body for engineering work. Leads with the brief, then spends most of
 * the page on the decision log: what was chosen, why, and what it cost.
 * Screenshots come last, because on a code project they are the evidence,
 * not the argument.
 *
 * @param project - The project being displayed.
 * @param frames - Deduplicated media paths for the screenshot grid.
 */
export default function CodeCase({ project, frames }: CodeCaseProps) {
  const brief = [
    project.why && { label: "The Idea", body: project.why },
    project.problem && { label: "The Problem", body: project.problem },
  ].filter(Boolean) as { label: string; body: string }[];

  const decisions = project.decisions ?? [];
  // `metrics` carries the facts worth stating flat — hardware, counts,
  // licence. The design and craft templates already surfaced them; this one
  // was dropping them on the floor.
  const runtime = [
    project.role && { label: "Role", value: project.role },
    project.duration && { label: "Duration", value: project.duration },
    project.status && { label: "Status", value: project.status },
    ...(project.metrics ?? []),
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      {runtime.length > 0 && (
        <dl className={styles.specBar}>
          {runtime.map(({ label, value }) => (
            <div key={label} className={styles.spec}>
              <dt className={styles.specLabel}>{label}</dt>
              <dd className={styles.specValue}>{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {brief.length > 0 && (
        <section className={styles.acts}>
          {brief.map((act, i) => (
            <div key={act.label} className={styles.act}>
              <div className={styles.actNum}>{String(i + 1).padStart(2, "0")}</div>
              <div className={styles.actBody}>
                <Text as="h2" variant="h2" className={styles.actTitle}>
                  {act.label}
                </Text>
                <Text as="p" variant="body" className={styles.actText}>
                  {act.body}
                </Text>
              </div>
            </div>
          ))}
        </section>
      )}

      {decisions.length > 0 && (
        <section className={styles.decisions} aria-label="Technical decisions">
          <div className={styles.sectionHead}>
            <Text as="h2" variant="h2" className={styles.sectionTitle}>
              Decisions
            </Text>
            <Text as="p" variant="mono" className={styles.sectionIntro}>
              Every one of these could have gone the other way. Here is the
              reasoning, and the bill.
            </Text>
          </div>

          <ol className={styles.decisionList}>
            {decisions.map((d) => (
              <li key={d.choice} className={styles.decision}>
                <Text as="h3" variant="h3" className={styles.decisionChoice}>
                  {d.choice}
                </Text>
                <Text as="p" variant="body" className={styles.decisionWhy}>
                  {d.why}
                </Text>
                {d.tradeoff && (
                  <p className={styles.decisionTradeoff}>
                    <span className={styles.tradeoffTag}>Trade-off</span>
                    {d.tradeoff}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      {project.solution && (
        <section className={styles.outcome}>
          <Text as="h2" variant="h2" className={styles.sectionTitle}>
            Outcome
          </Text>
          <Text as="p" variant="body" className={styles.actText}>
            {project.solution}
          </Text>
        </section>
      )}

      <ProjectMedia frames={frames} title={project.title} fit={project.media.fit ?? "contain"} />
    </>
  );
}
