"use client";

import Text from "@/components/atoms/text";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";
import styles from "./GalleryViewer.module.scss";

interface GalleryViewerProps {
  images: string[];
  projectTitle: string;
  mediaFit?: "cover" | "contain";
}

/**
 * Image gallery with thumbnail-strip navigation; renders a side-by-side compare layout for exactly two images.
 * Uses next/image with fill - objectFit must be passed via style prop (required for fill to work).
 * @param images - Array of image URLs to display
 * @param projectTitle - Used as alt text and fallback labels
 * @param mediaFit - Reserved for future use (currently defaults to "contain")
 */
export default function GalleryViewer({
  images,
  projectTitle,
}: GalleryViewerProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isCompareMode = images.length === 2;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }

    if (e.key === "ArrowRight") {
      setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  const currentImageName =
    images[selectedIndex].split("/").pop()?.split(".")[0]?.replace(/-/g, " ") ||
    projectTitle;

  if (!images || images.length === 0) return null;

  if (isCompareMode) {
    return (
      <div className={styles.galleryContainer}>
        <div className={styles.galleryHeader}>
          <Text as="h3" variant="h3">Project Lenses</Text>
          <Text as="span" variant="label">Compare A // B</Text>
        </div>

        <div className={styles.compareGrid}>
          {images.map((image, index) => (
            <figure key={`${image}-${index}`} className={styles.compareCard}>
              <figcaption className={styles.compareLabel}>
                {index === 0
                  ? "Frame A // Base Context"
                  : "Frame B // Focus View"}
              </figcaption>
              <div className={styles.compareImageWrap}>
                <Image
                  src={image}
                  alt={`${projectTitle} compare frame ${index + 1}`}
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  className={styles.imageContain}
                  priority={index === 0}
                />
              </div>
            </figure>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles.galleryContainer}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className={styles.galleryHeader}>
        <Text as="h3" variant="h3">Storyboard</Text>
        <Text as="span" variant="label">
          {(selectedIndex + 1).toString().padStart(2, "0")}
          {" // "}
          {images.length.toString().padStart(2, "0")}
        </Text>
      </div>

      <div className={styles.viewerLayout}>
        <div className={styles.stage}>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={styles.stageImageWrap}
            >
              <Image
                src={images[selectedIndex]}
                alt={`${projectTitle} - frame ${selectedIndex + 1}`}
                fill
                sizes="(max-width: 900px) 100vw, 75vw"
                className={styles.imageContain}
                priority={selectedIndex === 0}
              />
            </motion.div>
          </AnimatePresence>

          <Text as="span" variant="label" className={styles.stageBadge}>
            Focus Frame // {currentImageName}
          </Text>
        </div>

        <div className={styles.thumbnailStrip}>
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              className={`${styles.thumbnail} ${
                index === selectedIndex ? styles.active : ""
              }`}
              onClick={() => setSelectedIndex(index)}
              aria-label={`View frame ${index + 1}`}
            >
              <div className={styles.thumbPreview}>
                <Image
                  src={image}
                  alt={`${projectTitle} thumbnail ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className={styles.imageCover}
                />
              </div>
              <div className={styles.thumbInfo}>
                <Text as="span" variant="label">Frame {index + 1}</Text>
                <strong>
                  {image.split("/").pop()?.split(".")[0]?.replace(/-/g, " ") ||
                    "Detail"}
                </strong>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
