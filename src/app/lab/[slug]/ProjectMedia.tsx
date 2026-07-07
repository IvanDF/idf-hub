"use client";

import Lightbox from "@/components/molecules/lightbox";
import Image from "next/image";
import { useState } from "react";
import styles from "./ProjectDetail.module.scss";

interface ProjectMediaProps {
  frames: string[];
  title: string;
  fit: "cover" | "contain";
}

/**
 * Media grid for the project detail page. Every frame opens the zoomable
 * Lightbox. Client-side only for the viewer state; the grid markup matches
 * the previous server-rendered one.
 */
export default function ProjectMedia({ frames, title, fit }: ProjectMediaProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (frames.length === 0) return null;

  return (
    <>
      <div className={`${styles.media} ${frames.length > 1 ? styles.mediaMulti : ""}`}>
        {frames.map((src, i) => (
          <button
            key={src}
            type="button"
            // Opted out of the global cursor envelope: a difference-blend blob
            // over a photo reads as a broken negative, not as a highlight.
            data-local-magnetic="true"
            className={`${styles.mediaFrame} ${styles.mediaFrameClickable} ${
              i === 0 && frames.length > 1 ? styles.mediaFrameHero : ""
            }`}
            onClick={() => setOpenIndex(i)}
            aria-label={`Open ${title} frame ${i + 1} in the viewer`}
          >
            <Image
              src={src}
              alt={`${title} — frame ${i + 1}`}
              fill
              className={`${styles.mediaImg} ${
                fit === "cover" ? styles.mediaCover : styles.mediaContain
              }`}
              sizes={i === 0 ? "(max-width: 768px) 100vw, 860px" : "(max-width: 768px) 50vw, 430px"}
              priority={i === 0}
            />
            <span className={styles.mediaZoomHint} aria-hidden="true">
              +
            </span>
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <Lightbox
          images={frames}
          title={title}
          index={openIndex}
          onNavigate={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  );
}
