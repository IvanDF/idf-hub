import Text from "@/components/atoms/text";
import type { Project } from "@/types/project";
import ProjectMedia from "../ProjectMedia";
import styles from "../ProjectDetail.module.scss";

interface CraftCaseProps {
  project: Project;
  frames: string[];
}

/**
 * Detail body for systems and automations — workspaces, shortcuts, personal
 * infrastructure. These are judged by what they remove from a day, so the
 * page leads with what the system does rather than how it was built.
 *
 * @param project - The project being displayed.
 * @param frames - Deduplicated media paths for the screenshot grid.
 */
export default function CraftCase({ project, frames }: CraftCaseProps) {
  const moves = project.highlights ?? [];
  const brief = [
    project.why && { label: "The Itch", body: project.why },
    project.problem && { label: "The Friction", body: project.problem },
    project.solution && { label: "The Fix", body: project.solution },
  ].filter(Boolean) as { label: string; body: string }[];

  return (
    <>
      {moves.length > 0 && (
        <section className={styles.moves} aria-label="What it does">
          <div className={styles.sectionHead}>
            <Text as="h2" variant="h2" className={styles.sectionTitle}>
              What it does
            </Text>
          </div>
          <ul className={styles.moveList}>
            {moves.map((m) => (
              <li key={m} className={styles.move}>
                <span className={styles.moveMark} aria-hidden>
                  →
                </span>
                <Text as="span" variant="body" className={styles.moveText}>
                  {m}
                </Text>
              </li>
            ))}
          </ul>
        </section>
      )}

      <ProjectMedia
        frames={frames}
        title={project.title}
        fit={project.media.fit ?? "contain"}
      />

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

      {(project.metrics ?? []).length > 0 && (
        <dl className={styles.specBar}>
          {project.metrics!.map(({ label, value }) => (
            <div key={label} className={styles.spec}>
              <dt className={styles.specLabel}>{label}</dt>
              <dd className={styles.specValue}>{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </>
  );
}
