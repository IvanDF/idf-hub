import { hrefForProject, labelFor, type Project } from "@/types/project";
import Image from "next/image";
import Link from "next/link";
import styles from "./WorkDeck.module.scss";

/** Featured first, then the rest newest first: the deck opens on the strongest. */
const byNewestFirst = (a: Project, b: Project) =>
  (b.date ?? `${b.year}-06`).localeCompare(a.date ?? `${a.year}-06`);

/** Featured in their chosen order, then everything else newest first. */
export function orderForDeck(projects: Project[]): Project[] {
  return [
    ...projects.filter((p) => p.featured).sort((a, b) => a.featured! - b.featured!),
    ...projects.filter((p) => !p.featured).sort(byNewestFirst),
  ];
}

interface WorkDeckProps {
  /** The live work, already filtered by the page. */
  projects: Project[];
}

/**
 * A thumbnail worth showing at card size.
 *
 * Five projects still carry an icon SVG or /assets/placeholder.svg where a
 * screenshot belongs — listed as outstanding in docs/project-assets.md. Those
 * cards set their kind as type instead of stretching a 16x16 glyph across the
 * frame.
 */
function hasHeroImage(project: Project) {
  return !project.media.thumbnail.endsWith(".svg");
}

/**
 * The work as a deck you flip through.
 *
 * One mechanic everywhere: a horizontal scroll-snap strip. That is a swipe on
 * touch, a trackpad flick or a drag on desktop, and Tab + arrows from a
 * keyboard — all of it native, with no JavaScript and no gesture library. The
 * stacked look comes from `animation-timeline: view(x)`, so cards grow as they
 * reach the middle and settle back as they leave.
 *
 * Replaces the map, which failed on the two things that mattered: it had no
 * form on mobile beyond a list, and it turned visual work into abstract dots.
 * A stack of cards needs no legend, and the picture is the point.
 */
export default function WorkDeck({ projects }: WorkDeckProps) {
  const deck = orderForDeck(projects);

  if (!deck.length) return null;

  return (
    <section className={styles.deck} aria-label="Selected work">
      <p className={styles.hint} aria-hidden="true">
        <span className={styles.arrow}>←</span> swipe through the work{" "}
        <span className={styles.arrow}>→</span>
      </p>

      <ul className={styles.rail}>
        {deck.map((project, i) => {
          const hero = hasHeroImage(project);
          return (
            <li key={project.id} id={project.id} className={styles.slot}>
              <Link href={hrefForProject(project)} className={styles.card}>
                <span
                  className={styles.frame}
                  data-plate={hero ? undefined : "type"}
                  data-fit={project.media.fit ?? "cover"}
                >
                  {hero ? (
                    <Image
                      src={project.media.thumbnail}
                      alt=""
                      fill
                      sizes="(max-width: 700px) 86vw, 42vw"
                      className={styles.image}
                      priority={i < 2}
                    />
                  ) : (
                    <span className={styles.plateMark}>
                      {labelFor(project)}
                    </span>
                  )}
                </span>

                <span className={styles.body}>
                  <span className={styles.count}>
                    {String(i + 1).padStart(2, "0")} /{" "}
                    {String(deck.length).padStart(2, "0")}
                  </span>
                  <span className={styles.title}>{project.title}</span>
                  <span className={styles.blurb}>{project.description}</span>
                  <span className={styles.meta}>
                    {labelFor(project)} · {project.year}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
