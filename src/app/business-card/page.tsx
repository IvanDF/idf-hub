"use client";

import Text from "@/components/atoms/text";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";

/** Loaded client-side only — Three.js requires browser APIs. */
const BusinessCard3D = dynamic(
  () => import("@/components/organisms/business-card-3d").then((m) => m.BusinessCard3D),
  { ssr: false },
);

/** Duration in milliseconds for the flip haptic pulse — intentionally brief. */
const FLIP_HAPTIC_MS = 10;

// One entry per persona; a variant needs its textures exported to
// /public/assets/business-cards/{id}-front.svg and {id}-back.svg.
// To add e.g. "photo": drop the two SVGs and append { id: "photo", ... }.
const VARIANTS = [
  { id: "normal", label: "General" },
  { id: "code", label: "Dev" },
  { id: "design", label: "Design" },
] as const;

type CardStyle = (typeof VARIANTS)[number]["id"];

function isValidStyle(s: string | null): s is CardStyle {
  return VARIANTS.some((v) => v.id === s);
}

/**
 * Business card landing page.
 * Renders the selected iDF business card variant as an interactive 3D scene.
 *
 * Query params:
 *   type (alias: style) — "normal" | "code" | "design"  (default: "normal")
 *
 * Example: /business-card?type=design
 */
export default function BusinessCardPage() {
  const searchParams = useSearchParams();

  const rawStyle = searchParams.get("type") ?? searchParams.get("style");
  const activeStyle: CardStyle = isValidStyle(rawStyle) ? rawStyle : "normal";

  const [isFlipped, setIsFlipped] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
    setHintVisible(false);
    if ("vibrate" in navigator) navigator.vibrate(FLIP_HAPTIC_MS);
  };

  return (
    // data-cursor-native: the blob envelope difference-inverts whatever it
    // adopts — on the 3D card that negated the whole artwork.
    <div className={styles.stage} data-cursor-native="true">
      {/* 3D Canvas — keyed on style to remount on variant change */}
      <div className={styles.canvasWrap}>
        <BusinessCard3D
          key={activeStyle}
          style={activeStyle}
          isFlipped={isFlipped}
          onFlip={handleFlip}
          reducedMotion={reducedMotion}
        />
      </div>

      {/* Tap-to-flip hint — disappears after first flip */}
      {hintVisible && (
        <Text as="p" variant="body" className={styles.hint} aria-hidden="true">
          tap to flip
        </Text>
      )}

      {/* Back to main site */}
      <Link href="/" className={styles.backLink}>
        ← iDF
      </Link>
    </div>
  );
}
