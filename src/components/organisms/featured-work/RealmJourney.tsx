"use client";

import { hrefForProject } from "@/types/project";
import Image from "next/image";
import Link from "next/link";
import { FEATURED, hasHeroImage } from "./FeaturedWork";
import styles from "./RealmJourney.module.scss";

/**
 * The layer of the tree each project hangs from, read top-down like the myth
 * on /yggdrasil: branches carry what is visible, the trunk carries the work
 * that holds it up, the roots are where the craft comes from.
 */
const LAYER = ["branches", "trunk", "trunk", "roots"] as const;

/**
 * Variant C — the projects as realms on the world tree.
 *
 * Built on the depth trick behind HD-2D: three layers moving at different
 * rates, the far one blurred and dim, so scrolling reads as travelling through
 * a place rather than past a list. The realm name and the layer come from the
 * same vocabulary /yggdrasil already uses.
 */
export default function RealmJourney() {
  return (
    <div className={styles.journey} data-featured-work="">
      {FEATURED.map((project, i) => {
        const hero = hasHeroImage(project);
        return (
          <section
            key={project.id}
            id={project.id}
            className={styles.realm}
            data-layer={LAYER[i] ?? "trunk"}
            data-visual={hero ? "image" : "type"}
            aria-labelledby={`realm-${project.id}`}
          >
            {/* Far layer: scenery, never content. Blurred and slow. */}
            <div className={styles.far} aria-hidden="true">
              <span className={styles.farWord}>{LAYER[i] ?? "trunk"}</span>
            </div>

            {/* Mid layer: the image, drifting against the far layer. */}
            {hero && (
              <div
                className={styles.mid}
                data-fit={project.media.fit ?? "cover"}
                aria-hidden="true"
              >
                <Image
                  src={project.media.thumbnail}
                  alt=""
                  fill
                  sizes="(max-width: 700px) 100vw, 48vw"
                  className={styles.image}
                  priority={i === 0}
                />
              </div>
            )}

            {/* Near layer: everything that has to be read. */}
            <div className={styles.near}>
              <span className={styles.marker} aria-hidden="true">
                {String(i + 1).padStart(2, "0")} · {LAYER[i] ?? "trunk"}
              </span>

              <h3 className={styles.title} id={`realm-${project.id}`}>
                <Link href={hrefForProject(project)} className={styles.titleLink}>
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
          </section>
        );
      })}
    </div>
  );
}
