import type { ProjectMockup } from "@/types/project";
import Image from "next/image";
import styles from "./ProjectDetail.module.scss";

interface ProductMockupProps {
  mockup: ProjectMockup;
  title: string;
}

/**
 * Presentation frame for design output shown on a product — a garment, a
 * case, a printed piece.
 *
 * The frames are supplied as finished images; nothing here draws the product.
 * A mockup is a photograph or a render the designer made, and a silhouette
 * approximated in code would misrepresent the work. This component only
 * stages what it is given: sizing, captions, and the grid.
 *
 * Expected image: the artwork already composited onto the product, on a
 * transparent or neutral background. Portrait or square reads best.
 *
 * @param mockup - Shell kind and the finished mockup frames to present.
 * @param title - Project title, used for image alt text.
 */
export default function ProductMockup({ mockup, title }: ProductMockupProps) {
  if (mockup.frames.length === 0) return null;

  return (
    <section className={styles.mockupSection} aria-label="Product mockups">
      <div className={styles.mockupGrid}>
        {mockup.frames.map((frame) => (
          <figure key={frame.src} className={styles.mockup}>
            <div
              className={styles.mockupStage}
              data-kind={mockup.kind}
            >
              <Image
                src={frame.src}
                alt={`${title} — ${frame.label}`}
                fill
                className={styles.mockupImage}
                sizes="(max-width: 768px) 90vw, 420px"
              />
            </div>
            <figcaption className={styles.mockupCaption}>
              {frame.label}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
