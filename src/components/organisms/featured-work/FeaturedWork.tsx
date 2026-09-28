import { PROJECTS } from "@/data/projects";
import { hrefForProject, type Project } from "@/types/project";
import Image from "next/image";
import Link from "next/link";
import styles from "./FeaturedWork.module.scss";

/** Showcase order comes from the data, so this file has no list to keep in step. */
const FEATURED = PROJECTS.filter((p) => p.featured).sort(
  (a, b) => a.featured! - b.featured!,
);

/**
 * Whether a project has a thumbnail worth showing at full width.
 *
 * Yggdrasil's is a 16x16 line glyph standing in for an image that was never
 * made, and it is drawn with `stroke="currentColor"` — loaded through an `img`
 * it is cut off from the page's CSS and resolves to black, so it would vanish
 * in dark mode on top of being far too small. Those slides go typographic
 * instead. See docs/project-assets.md.
 */
function hasHeroImage(project: Project) {
  return !project.media.thumbnail.endsWith(".svg");
}

/**
 * The Work showcase: the projects that carry the portfolio, one screen each.
 *
 * Deliberately not uniform. A systems project set as type and a compositing
 * project set as a photograph say more together than four identical cards
 * would, and the data already tells us which is which.
 *
 * Motion is the shared `data-reveal` mechanism rather than anything new, so the
 * scroll-driven CSS path and the JS fallback both cover it and the resting
 * state stays visible — see the note above the reveal rule in globals.scss.
 */
export default function FeaturedWork() {
  return (
    <div className={styles.showcase} data-featured-work="">
      {FEATURED.map((project, i) => {
        const hero = hasHeroImage(project);
        return (
          <section
            key={project.id}
            // The project id, not a showcase-specific one: the Work page scrolls
            // the visitor back to `#<id>` when they return from a detail page,
            // and a featured project is no longer in the list below to anchor it.
            id={project.id}
            className={styles.slide}
            data-reveal=""
            data-visual={hero ? "image" : "type"}
            aria-labelledby={`featured-${project.id}`}
          >
            <div className={styles.copy}>
              <span className={styles.index} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>

              <h3 className={styles.title} id={`featured-${project.id}`}>
                <Link
                  href={hrefForProject(project)}
                  className={styles.titleLink}
                >
                  {project.title}
                </Link>
              </h3>

              <p className={styles.blurb}>{project.description}</p>

              <p className={styles.meta}>
                <span>{project.category}</span>
                <span aria-hidden="true">·</span>
                <span>{project.year}</span>
              </p>
            </div>

            {hero && (
              <div
                className={styles.visual}
                data-fit={project.media.fit ?? "cover"}
                aria-hidden="true"
              >
                <Image
                  src={project.media.thumbnail}
                  alt=""
                  fill
                  sizes="(max-width: 700px) 100vw, 52vw"
                  className={styles.image}
                  // Only the first slide can be above the fold; the rest would
                  // compete with it for bandwidth on a cold load.
                  priority={i === 0}
                />
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
