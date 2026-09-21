import Text from "@/components/atoms/text";
import type { Project } from "@/types/project";
import ProjectMedia from "../ProjectMedia";
import styles from "../ProjectDetail.module.scss";

interface LabCaseProps {
  project: Project;
  frames: string[];
  /** CodePen owner and pen hash, when the work can be embedded live. */
  codepen: { user: string; hash: string } | null;
}

/**
 * Detail body for experiments and playground pieces. Short by design: the
 * thing runs at the top of the page, and the write-up is one paragraph about
 * what was being tested. An experiment that needs three sections of
 * explanation was not an experiment.
 *
 * @param project - The project being displayed.
 * @param frames - Deduplicated media paths for the screenshot grid.
 * @param codepen - Pen coordinates for the live embed, or null.
 */
export default function LabCase({ project, frames, codepen }: LabCaseProps) {
  const question = project.why ?? project.problem;
  const finding = project.solution;

  return (
    <>
      {codepen && (
        <section className={styles.embed}>
          {/* Live pen instead of screenshots: the work IS the interaction */}
          <iframe
            className={styles.embedFrame}
            src={`https://codepen.io/${codepen.user}/embed/${codepen.hash}?default-tab=result&theme-id=dark`}
            title={`${project.title} — live on CodePen`}
            loading="lazy"
            allowFullScreen
          />
        </section>
      )}

      {!codepen && (
        <ProjectMedia
          frames={frames}
          title={project.title}
          fit={project.media.fit ?? "contain"}
        />
      )}

      <section className={styles.experiment}>
        {question && (
          <div className={styles.experimentBlock}>
            <Text as="h2" variant="h2" className={styles.actTitle}>
              The question
            </Text>
            <Text as="p" variant="body" className={styles.actText}>
              {question}
            </Text>
          </div>
        )}
        {finding && (
          <div className={styles.experimentBlock}>
            <Text as="h2" variant="h2" className={styles.actTitle}>
              What came back
            </Text>
            <Text as="p" variant="body" className={styles.actText}>
              {finding}
            </Text>
          </div>
        )}
        {(project.highlights ?? []).length > 0 && (
          <ul className={styles.moveList}>
            {project.highlights!.map((h) => (
              <li key={h} className={styles.move}>
                <span className={styles.moveMark} aria-hidden>
                  →
                </span>
                <Text as="span" variant="body" className={styles.moveText}>
                  {h}
                </Text>
              </li>
            ))}
          </ul>
        )}
      </section>

      {codepen && frames.length > 0 && (
        <ProjectMedia
          frames={frames}
          title={project.title}
          fit={project.media.fit ?? "contain"}
        />
      )}
    </>
  );
}
