import Text from "@/components/atoms/text";
import type { Project } from "@/types/project";
import ProjectAge from "./ProjectAge";
import styles from "./ProjectDetail.module.scss";

interface ProjectHeaderProps {
  project: Project;
  /** Kind of work, shown instead of the raw category enum. */
  kind: string;
  /** First year of the archive, for the age track. */
  archiveFrom: number;
}

/**
 * Shared detail-page masthead: what kind of work this is, when it happened,
 * the title, and the one-paragraph framing.
 *
 * @param project - The project being displayed.
 * @param kind - Human label for the project's template.
 * @param archiveFrom - Oldest year across all projects.
 */
export default function ProjectHeader({
  project,
  kind,
  archiveFrom,
}: ProjectHeaderProps) {
  return (
    <header className={styles.header}>
      {/* Plain spans, not <Text>: these chips carry their own type styles, and
          Text's base class resets padding to 0 at the same specificity — so
          the cascade decided by source order and the chips lost their inset. */}
      <div className={styles.meta}>
        <span className={styles.metaChip}>{kind}</span>
        <span className={styles.metaSep} aria-hidden>
          /
        </span>
        <time className={styles.metaYear} dateTime={project.date ?? project.year}>
          {project.year}
        </time>
        <ProjectAge date={project.date ?? project.year} from={archiveFrom} />
        {project.status === "live" && <span className={styles.metaLive}>live</span>}
      </div>

      <Text as="h1" variant="h1" className={styles.title}>
        {project.title}
      </Text>
      <Text as="p" variant="mono" className={styles.lead}>
        {project.longDescription ?? project.description}
      </Text>
    </header>
  );
}
