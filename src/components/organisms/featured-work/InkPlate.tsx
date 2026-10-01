"use client";

import { BEATS, CLOSING, OPENING } from "@/data/work-story";
import { hrefForProject } from "@/types/project";
import Image from "next/image";
import { Fragment } from "react";
import Link from "next/link";
import { FEATURED, hasHeroImage } from "./FeaturedWork";
import styles from "./InkPlate.module.scss";

/** Splits a blurb into lines that can arrive one after another. */
function toLines(text: string, perLine = 46) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if ((line + word).length > perLine && line) {
      lines.push(line.trim());
      line = "";
    }
    line += `${word} `;
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

/**
 * The work as a told sequence, not a stack of four independent plates.
 *
 * An opening sets the question, a beat between each plate says why this one
 * follows the last, a thread draws itself down the left as you go, and a
 * closing hands you on. Those four things are what make it a story rather than
 * a list that happens to be vertical — the plates themselves barely changed.
 *
 * The copy lives in data/work-story.ts so it can be rewritten without touching
 * this file. It is a draft: the structure is the work, the words are Ivan's.
 *
 * Everything is drawn with the ink vocabulary the site already owns: the rule
 * above the title inks itself across as the plate enters, the image is wiped in
 * behind a mask rather than faded, and the blurb sets a line at a time. The
 * plate leaves by lifting and thinning, never by disappearing.
 */
export default function InkPlate() {
  return (
    <div className={styles.showcase} data-featured-work="">
      {/* The thread. Decorative — the beats carry the sequence in the text. */}
      <span className={styles.thread} aria-hidden="true" />

      <section className={styles.opening}>
        <p className={styles.openingLead}>{OPENING.lead}</p>
        <p className={styles.openingLine}>{OPENING.line}</p>
      </section>

      {FEATURED.map((project, i) => {
        const hero = hasHeroImage(project);
        const lines = toLines(project.description);
        const beat = BEATS.find((b) => b.before === project.id);
        return (
          <Fragment key={project.id}>
            {beat && <p className={styles.beat}>{beat.text}</p>}

          <section
            id={project.id}
            className={styles.plate}
            data-visual={hero ? "image" : "type"}
            aria-labelledby={`plate-${project.id}`}
          >
            <div className={styles.copy}>
              <span className={styles.rule} aria-hidden="true" />

              <span className={styles.index} aria-hidden="true">
                {String(i + 1).padStart(2, "0")} / {String(FEATURED.length).padStart(2, "0")}
              </span>

              <h3 className={styles.title} id={`plate-${project.id}`}>
                <Link href={hrefForProject(project)} className={styles.titleLink}>
                  {project.title}
                </Link>
              </h3>

              <p className={styles.blurb}>
                {/* Each line trails the one above it; the stagger is keyed off
                    :nth-child in the stylesheet, so no inline styling. */}
                {lines.map((line) => (
                  <span key={line} className={styles.line}>
                    {line}
                  </span>
                ))}
              </p>

              <p className={styles.meta}>
                <span>{project.category}</span>
                <span aria-hidden="true">·</span>
                <span>{project.year}</span>
                <span className={styles.go} aria-hidden="true">
                  read the case →
                </span>
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
                  sizes="(max-width: 700px) 100vw, 50vw"
                  className={styles.image}
                  priority={i === 0}
                />
              </div>
            )}
          </section>
          </Fragment>
        );
      })}

      <section className={styles.closing}>
        <p className={styles.closingLine}>{CLOSING.line}</p>
        <p className={styles.closingLead}>{CLOSING.lead}</p>
      </section>
    </div>
  );
}
