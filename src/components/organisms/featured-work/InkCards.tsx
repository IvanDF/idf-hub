"use client";

import { hrefForProject, labelFor, type Project } from "@/types/project";
import Image from "next/image";
import Link from "next/link";
import { hasHeroImage } from "./FeaturedWork";
import styles from "./InkCards.module.scss";

interface InkCardsProps {
  /** The live work that is not in the showcase, already filtered. */
  projects: Project[];
  /** Continues the showcase numbering instead of restarting at 01. */
  startIndex: number;
}

/**
 * The middle step of the descent: the same plate, at half the weight.
 *
 * These carry the ink frame and the typography of the full plates above and
 * differ only in scale and density — two to a row instead of one to a screen.
 * That is the whole idea: the hierarchy steps down rather than switching to a
 * table, so there is no seam between the curated work and the rest of it.
 */
export default function InkCards({ projects, startIndex }: InkCardsProps) {
  if (!projects.length) return null;

  return (
    <div className={styles.grid} role="list">
      {projects.map((project, i) => (
        <Link
          key={project.id}
          id={project.id}
          role="listitem"
          href={hrefForProject(project)}
          className={styles.card}
          data-reveal=""
        >
          {/* Five projects still carry an SVG icon or /assets/placeholder.svg
              where a screenshot should be — they are listed as outstanding in
              docs/project-assets.md. Rendering those stretched their glyph
              across the frame and read as a broken image, so they get the same
              typographic treatment the Yggdrasil plate gets. */}
          <span
            className={styles.frame}
            data-plate={hasHeroImage(project) ? undefined : "type"}
            aria-hidden="true"
          >
            {hasHeroImage(project) ? (
              <Image
                src={project.media.thumbnail}
                alt=""
                fill
                sizes="(max-width: 700px) 100vw, 34vw"
                className={styles.image}
              />
            ) : (
              <span className={styles.plateMark}>{labelFor(project)}</span>
            )}
          </span>

          <span className={styles.head}>
            <span className={styles.num} aria-hidden="true">
              {String(startIndex + i).padStart(2, "0")}
            </span>
            <span className={styles.title}>{project.title}</span>
          </span>

          <span className={styles.desc}>{project.description}</span>

          <span className={styles.meta}>
            <span>{labelFor(project)}</span>
            <span aria-hidden="true">·</span>
            <span>{project.year}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
