import Text from "@/components/atoms/text";
import type { ProjectPlate } from "@/types/project";
import Image from "next/image";
import styles from "./ProjectDetail.module.scss";

interface PlateGridProps {
  plates: ProjectPlate[];
  title: string;
  /** Section heading — "The Plates" for photography, "Separations" for print. */
  heading: string;
  /** One line explaining what this set of artefacts is. */
  intro?: string;
}

/**
 * The pieces a finished image was built from, each labelled with the job it
 * does. Shows the working rather than only the result.
 *
 * @param plates - Source artefacts in the order they were produced.
 * @param title - Project title, used for image alt text.
 * @param heading - Section heading.
 * @param intro - Optional one-line framing under the heading.
 */
export default function PlateGrid({
  plates,
  title,
  heading,
  intro,
}: PlateGridProps) {
  if (plates.length === 0) return null;

  return (
    <section className={styles.plates} aria-label={heading}>
      <div className={styles.sectionHead}>
        <Text as="h2" variant="h2" className={styles.sectionTitle}>
          {heading}
        </Text>
        {intro && (
          <Text as="p" variant="mono" className={styles.sectionIntro}>
            {intro}
          </Text>
        )}
      </div>

      <ol className={styles.plateList}>
        {plates.map((plate, i) => (
          <li key={plate.src} className={styles.plate}>
            <div className={styles.plateFrame}>
              <Image
                src={plate.src}
                alt={`${title} — ${plate.label}`}
                fill
                className={styles.plateImg}
                sizes="(max-width: 768px) 100vw, 380px"
              />
            </div>
            <div className={styles.plateBody}>
              <span className={styles.plateNum}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <Text as="h3" variant="h3" className={styles.plateLabel}>
                  {plate.label}
                </Text>
                {plate.note && (
                  <Text as="p" variant="body" className={styles.plateNote}>
                    {plate.note}
                  </Text>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
