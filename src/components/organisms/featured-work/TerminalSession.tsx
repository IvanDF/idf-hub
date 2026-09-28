"use client";

import TextScramble from "@/components/atoms/text-scramble";
import { hrefForProject } from "@/types/project";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FEATURED, hasHeroImage } from "./FeaturedWork";
import styles from "./TerminalSession.module.scss";

/**
 * Variant B — the showcase as a tmux session.
 *
 * Each project is a window; the status line at the foot tracks which one you
 * are reading, the way the bar on /yggdrasil already does for that page's
 * sections. Titles resolve out of noise through the TextScramble atom instead
 * of fading, which is the site's own way of making text arrive.
 */
export default function TerminalSession() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    // Which window is under the reading line. Cheap and honest: no animation
    // depends on this, it only labels the bar — if it never fires, the bar
    // simply keeps pointing at the first window.
    const sections = FEATURED.map((p) => document.getElementById(p.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!sections.length || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = sections.indexOf(visible.target as HTMLElement);
        if (index >= 0) setActive(index);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.25, 0.5] },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.session} data-featured-work="">
      {FEATURED.map((project, i) => {
        const hero = hasHeroImage(project);
        return (
          <section
            key={project.id}
            id={project.id}
            className={styles.window}
            data-visual={hero ? "image" : "type"}
            aria-labelledby={`win-${project.id}`}
          >
            <p className={styles.prompt} aria-hidden="true">
              <span className={styles.user}>idf</span>
              <span className={styles.sep}>@</span>
              <span className={styles.host}>lab</span>
              <span className={styles.sep}>:</span>
              <span className={styles.path}>~/work</span>
              <span className={styles.dollar}>$</span>
              <span className={styles.command}>open {project.id}</span>
            </p>

            <div className={styles.pane}>
              <h3 className={styles.title} id={`win-${project.id}`}>
                <Link href={hrefForProject(project)} className={styles.titleLink}>
                  <TextScramble text={project.title} />
                </Link>
              </h3>

              <p className={styles.blurb}>{project.description}</p>

              <dl className={styles.facts}>
                <div>
                  <dt>category</dt>
                  <dd>{project.category.toLowerCase()}</dd>
                </div>
                <div>
                  <dt>year</dt>
                  <dd>{project.year}</dd>
                </div>
                {project.stack?.length ? (
                  <div>
                    <dt>stack</dt>
                    <dd>{project.stack.slice(0, 3).join(", ")}</dd>
                  </div>
                ) : null}
              </dl>

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
                    sizes="(max-width: 700px) 100vw, 46vw"
                    className={styles.image}
                    priority={i === 0}
                  />
                </div>
              )}
            </div>
          </section>
        );
      })}

      {/* The status line. Sticky rather than fixed so it belongs to the
          showcase and leaves with it. */}
      <div className={styles.statusBar} aria-hidden="true">
        <span className={styles.sessionName}>work</span>
        <span className={styles.windows}>
          {FEATURED.map((project, i) => (
            <span
              key={project.id}
              className={styles.win}
              data-current={i === active || undefined}
            >
              {i}:{project.id.split("-")[0]}
              {i === active ? "*" : ""}
            </span>
          ))}
        </span>
        <span className={styles.clock}>
          {String(active + 1).padStart(2, "0")}/{String(FEATURED.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
