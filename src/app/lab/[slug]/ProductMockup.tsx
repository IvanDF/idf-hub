"use client";

import type { ProjectMockup } from "@/types/project";
import Image from "next/image";
import { useState } from "react";
import styles from "./ProjectDetail.module.scss";

interface ProductMockupProps {
  mockup: ProjectMockup;
  title: string;
}

/**
 * Seam colour for a given garment. The outline has to read against the
 * fabric, not against the page, so it is derived from the colourway: dark
 * seams on a light shirt, light seams on a dark one. Black seams on a black
 * tee would erase the silhouette entirely.
 *
 * @param hex - Garment colour as `#rrggbb`.
 */
function seamColor(hex: string): { edge: string; seam: string } {
  const int = parseInt(hex.replace("#", ""), 16);
  const [r, g, b] = [(int >> 16) & 255, (int >> 8) & 255, int & 255];
  // Rec. 601 luma is enough to pick a side here; full sRGB linearisation
  // would not change the answer for any realistic garment colour.
  const light = (r * 299 + g * 587 + b * 114) / 1000 > 140;
  return light
    ? { edge: "rgb(0 0 0 / 38%)", seam: "rgb(0 0 0 / 14%)" }
    : { edge: "rgb(255 255 255 / 30%)", seam: "rgb(255 255 255 / 12%)" };
}

/**
 * Tee silhouette drawn as a path so the garment colour is a fill, not an
 * asset. Body, sleeves and collar in one outline; the print area is placed
 * over it in the DOM.
 */
function TeeShell({ color }: { color: string }) {
  const { edge, seam } = seamColor(color);

  return (
    <svg
      className={styles.shell}
      viewBox="0 0 400 440"
      role="presentation"
      aria-hidden
    >
      <path
        d="M148 28 L104 44 L24 86 L60 158 L104 138 L104 412 Q200 424 296 412 L296 138 L340 158 L376 86 L296 44 L252 28 Q200 62 148 28 Z"
        fill={color}
        stroke={edge}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Collar ribbing — the detail that stops the shape reading as a sign */}
      <path
        d="M148 28 Q200 62 252 28"
        fill="none"
        stroke={edge}
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Seams, kept faint: they suggest a garment without competing with art */}
      <path
        d="M104 138 L104 412 M296 138 L296 412"
        fill="none"
        stroke={seam}
        strokeWidth="2"
      />
    </svg>
  );
}

/**
 * Phone shell: rounded body, camera island, side buttons. The artwork sits
 * inside the body's inset, clipped by the same radius.
 */
function PhoneShell() {
  return (
    <svg
      className={styles.shell}
      viewBox="0 0 260 520"
      role="presentation"
      aria-hidden
    >
      <rect
        x="14"
        y="10"
        width="232"
        height="500"
        rx="38"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        opacity="0.55"
      />
      <rect
        x="150"
        y="34"
        width="76"
        height="76"
        rx="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.35"
      />
      <circle cx="172" cy="58" r="11" fill="currentColor" opacity="0.3" />
      <circle cx="204" cy="58" r="11" fill="currentColor" opacity="0.3" />
      <circle cx="172" cy="88" r="11" fill="currentColor" opacity="0.3" />
      <path
        d="M10 118 L10 154 M10 172 L10 208"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}

/**
 * Presents flat print artwork on an in-browser product shell — a garment or
 * a phone case — rather than as a floating PNG. Nothing is photographed: the
 * shells are vector, so they theme with the page and the colourway is a
 * switch instead of a second render.
 *
 * @param mockup - Shell kind, colourways, and the artwork frames to place.
 * @param title - Project title, used for image alt text.
 */
export default function ProductMockup({ mockup, title }: ProductMockupProps) {
  const colorways = mockup.colorways ?? [];
  const [colorway, setColorway] = useState(colorways[0]?.value ?? "#151515");
  const isTee = mockup.kind === "tee";

  return (
    <section className={styles.mockupSection} aria-label="Product mockups">
      <div className={styles.mockupGrid}>
        {mockup.frames.map((frame) => (
          <figure key={frame.src} className={styles.mockup}>
            <div
              className={isTee ? styles.mockupStageTee : styles.mockupStagePhone}
            >
              {isTee ? <TeeShell color={colorway} /> : <PhoneShell />}
              <div
                className={
                  isTee
                    ? frame.placement === "full"
                      ? styles.printAreaTeeFull
                      : styles.printAreaTeeChest
                    : styles.printAreaPhone
                }
              >
                <Image
                  src={frame.src}
                  alt={`${title} — ${frame.label}`}
                  fill
                  className={isTee ? styles.printImage : styles.printImagePhone}
                  sizes="(max-width: 768px) 80vw, 340px"
                />
              </div>
            </div>
            <figcaption className={styles.mockupCaption}>{frame.label}</figcaption>
          </figure>
        ))}
      </div>

      {colorways.length > 1 && (
        <div className={styles.colorways}>
          <span className={styles.colorwaysLabel}>Garment</span>
          <div className={styles.swatches} role="group" aria-label="Garment colour">
            {colorways.map((c) => (
              <button
                key={c.value}
                type="button"
                className={`${styles.swatch} ${
                  c.value === colorway ? styles.swatchActive : ""
                }`}
                onClick={() => setColorway(c.value)}
                aria-pressed={c.value === colorway}
                aria-label={c.label}
                title={c.label}
              >
                <span
                  className={styles.swatchChip}
                  // Data-driven colour: it comes from the project, not the theme.
                  style={{ background: c.value }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
