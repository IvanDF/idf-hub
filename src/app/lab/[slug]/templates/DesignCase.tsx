import Text from "@/components/atoms/text";
import type { Project } from "@/types/project";
import PlateGrid from "../PlateGrid";
import ProductMockup from "../ProductMockup";
import ProjectMedia from "../ProjectMedia";
import styles from "../ProjectDetail.module.scss";

interface DesignCaseProps {
  project: Project;
  frames: string[];
}

/**
 * Detail body for design output — apparel, cases, print, composed images.
 * The artwork comes first and large: for this work the object is the
 * argument. Reasoning sits underneath as a short brief, and the variants and
 * separations that did not ship are shown as the working.
 *
 * @param project - The project being displayed.
 * @param frames - Deduplicated media paths, used when there is no mockup.
 */
export default function DesignCase({ project, frames }: DesignCaseProps) {
  const spec = [
    project.role && { label: "Role", value: project.role },
    ...(project.metrics ?? []),
  ].filter(Boolean) as { label: string; value: string }[];

  const brief = [
    project.why && { label: "The Idea", body: project.why },
    project.problem && { label: "The Brief", body: project.problem },
    project.solution && { label: "The Craft", body: project.solution },
  ].filter(Boolean) as { label: string; body: string }[];

  const hasMockup = Boolean(project.mockup);
  const plates = project.plates ?? [];

  return (
    <>
      {hasMockup && project.mockup && (
        <ProductMockup mockup={project.mockup} title={project.title} />
      )}

      {/* No product shell to mount the work on: show it as shot, full width */}
      {!hasMockup && (
        <ProjectMedia
          frames={frames}
          title={project.title}
          fit={project.media.fit ?? "contain"}
        />
      )}

      {spec.length > 0 && (
        <dl className={styles.specBar}>
          {spec.map(({ label, value }) => (
            <div key={label} className={styles.spec}>
              <dt className={styles.specLabel}>{label}</dt>
              <dd className={styles.specValue}>{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {brief.length > 0 && (
        <section className={styles.acts} data-reveal="">
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

      <PlateGrid
        plates={plates}
        title={project.title}
        heading={hasMockup ? "The Working" : "The Plates"}
        intro={
          hasMockup
            ? "Separations and directions behind the printed piece."
            : "Every frame that went into the final composite, and the job it does."
        }
      />

      {/* With a mockup above, the raw files still deserve a look on their own */}
      {hasMockup && frames.length > 0 && (
        <ProjectMedia
          frames={frames}
          title={project.title}
          fit={project.media.fit ?? "contain"}
        />
      )}
    </>
  );
}
