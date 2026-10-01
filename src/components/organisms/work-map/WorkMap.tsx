import { PROJECTS } from "@/data/projects";
import { AXIS_LABELS, layout, type MapAxis } from "@/lib/work-map/positions";
import { hrefForProject, labelFor } from "@/types/project";
import Link from "next/link";
import styles from "./WorkMap.module.scss";

/** Everything that is still live. The archive is its own place. */
const LIVE = PROJECTS.filter((p) => p.status === "live");

interface WorkMapProps {
  axis: MapAxis;
}

/**
 * The work as a place rather than a list.
 *
 * Deliberately server-rendered with no client JavaScript: the nodes are real
 * links in a real list, positioned by CSS custom properties. Tab reaches every
 * one of them, a screen reader gets an ordered list, and with JS off the map is
 * still the whole collection — the degradation is the markup, not a fallback
 * branch that has to be remembered.
 *
 * Both readings are derived from the project records (see lib/work-map).
 * Nothing is placed to fill space.
 */
export default function WorkMap({ axis }: WorkMapProps) {
  const nodes = layout(LIVE, axis);
  const labels = AXIS_LABELS[axis];

  return (
    <section className={styles.map} data-axis={axis} aria-label="Work map">
      <p className={styles.caption}>{labels.title}</p>

      <div className={styles.plane}>
        {/* Captions for the plane itself. Decorative: the list below carries
            the same information to assistive technology. */}
        <div className={styles.axes} aria-hidden="true">
          {axis === "discipline" ? (
            <>
              {labels.x.map((l, i) => (
                <span
                  key={l}
                  className={styles.axisX}
                  style={{ "--lane": i } as React.CSSProperties}
                >
                  {l}
                </span>
              ))}
              <span className={styles.axisTop}>{labels.y[0]}</span>
              <span className={styles.axisBottom}>{labels.y[1]}</span>
            </>
          ) : (
            <>
              <span className={styles.axisLeft}>2020</span>
              <span className={styles.axisRight}>2026</span>
            </>
          )}
        </div>

        <ul className={styles.nodes}>
          {nodes.map(({ project, x, y, weight, edge, landmark }) => (
            <li
              key={project.id}
              className={styles.node}
              data-edge={edge ?? undefined}
              data-landmark={landmark ? "true" : undefined}
              style={
                {
                  "--x": x,
                  "--y": y,
                  "--w": weight,
                } as React.CSSProperties
              }
            >
              <Link
                href={hrefForProject(project)}
                className={styles.dot}
                data-featured={project.featured ? "true" : undefined}
              >
                <span className={styles.label}>{project.title}</span>
                <span className={styles.blurb}>
                  {labelFor(project)} · {project.year}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
