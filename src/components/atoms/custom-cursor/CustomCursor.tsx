"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./CustomCursor.module.scss";

// Magnetism only reads as "magnetic" on compact controls; on large surfaces
// (e.g. full-width list rows) it just drags the whole block around and forces
// the ink filter to re-run over the page every frame.
const MAX_MAGNET_WIDTH = 320;
const MAX_MAGNET_HEIGHT = 120;

type MagnetEntry = {
  el: HTMLElement;
  rect: DOMRect;
  eligible: boolean;
};

/**
 * CustomCursor Component
 *
 * Replaces the default system cursor with an interactive, animated cursor.
 * Uses Framer Motion's motion values for GPU-accelerated cursor tracking.
 * Live transform bindings stay in the motion style prop; static presentation
 * lives in the CSS module to keep the visual system consistent.
 * Features:
 * - Central dot that follows mouse instantly
 * - Outer blob with tight spring physics and a continuous wave morph
 * - Hover state (scales up)
 * - Click state (pulses)
 * - Disappears on touch devices
 */
export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const pathname = usePathname();

  // Mouse position state
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring physics for the blob: stiff enough to stay glued to the dot
  // (a soft spring here reads as page lag), soft enough to keep a hint
  // of organic overshoot.
  const springConfig = { damping: 32, stiffness: 750, mass: 0.8 };
  const blobX = useSpring(mouseX, springConfig);
  const blobY = useSpring(mouseY, springConfig);
  const activeMagnetRef = useRef<MagnetEntry | null>(null);

  useEffect(() => {
    // Only enable on desktop devices
    const isTouchDevice = window.matchMedia(
      "(hover: none) and (pointer: coarse)",
    ).matches;
    if (isTouchDevice) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsVisible(true);

    const resetMagnetElement = (entry: MagnetEntry | null) => {
      if (!entry?.eligible) return;
      entry.el.style.setProperty("translate", "0px 0px");
      entry.el.style.removeProperty("will-change");
    };

    const clearMagnetism = () => {
      resetMagnetElement(activeMagnetRef.current);
      activeMagnetRef.current = null;
    };

    const applyGlobalMagnetism = (e: MouseEvent) => {
      const source = e.target as HTMLElement | null;
      const candidate = source?.closest(
        "a, button, [role='button'], [data-magnetized='true']",
      ) as HTMLElement | null;

      // Keep local Magnetic components in control.
      if (!candidate || candidate.closest("[data-local-magnetic='true']")) {
        clearMagnetism();
        return;
      }

      let entry = activeMagnetRef.current;
      if (!entry || entry.el !== candidate) {
        resetMagnetElement(entry);
        // Measure once per candidate instead of every mousemove: reading the
        // rect after writing `translate` forces a synchronous layout per frame.
        const rect = candidate.getBoundingClientRect();
        entry = {
          el: candidate,
          rect,
          eligible:
            rect.width <= MAX_MAGNET_WIDTH && rect.height <= MAX_MAGNET_HEIGHT,
        };
        activeMagnetRef.current = entry;
        if (entry.eligible) {
          candidate.style.setProperty("will-change", "translate");
        }
      }

      if (!entry.eligible) return;

      const { rect } = entry;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const normalizedX = (e.clientX - centerX) / Math.max(rect.width, 1);
      const normalizedY = (e.clientY - centerY) / Math.max(rect.height, 1);
      const maxOffset = 10;
      const offsetX = Math.max(-1, Math.min(1, normalizedX)) * maxOffset;
      const offsetY = Math.max(-1, Math.min(1, normalizedY)) * maxOffset;

      entry.el.style.setProperty(
        "translate",
        `${offsetX.toFixed(2)}px ${offsetY.toFixed(2)}px`,
      );
    };

    // Unthrottled: motion values already coalesce to one render per frame,
    // and capping at 60fps made the dot stutter on high-refresh displays.
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      applyGlobalMagnetism(e);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      try {
        if (
          target.tagName === "A" ||
          target.tagName === "BUTTON" ||
          target.closest("a") ||
          target.closest("button") ||
          target.getAttribute("role") === "button" ||
          getComputedStyle(target).cursor === "pointer"
        ) {
          setIsHovering(true);
        } else {
          setIsHovering(false);
        }
      } catch {
        // Ignore errors from getComputedStyle on removed elements
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseleave", clearMagnetism);
    window.addEventListener("blur", clearMagnetism);
    // Cached rects go stale when the page scrolls under the pointer.
    window.addEventListener("scroll", clearMagnetism, {
      passive: true,
      capture: true,
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseleave", clearMagnetism);
      window.removeEventListener("blur", clearMagnetism);
      window.removeEventListener("scroll", clearMagnetism, { capture: true });
      clearMagnetism();
    };
  }, [mouseX, mouseY]);

  // Reset hover state on navigation
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHovering(false);
    setIsClicking(false);
  }, [pathname]);

  if (!isVisible) return null;

  return (
    <>
      {/* Central Dot (Instant Follow) */}
      <motion.div
        className={styles.cursorDot}
        style={{ translateX: mouseX, translateY: mouseY, x: "-50%", y: "-50%" }}
        animate={{
          scale: isClicking ? 0.8 : isHovering ? 0.5 : 1, // Shrink slightly on hover/click
        }}
        transition={{ duration: 0.1 }}
      />

      {/* Outer Blob (Spring Follow + Wave Morph) */}
      {/* Framer owns the outer transform (position/scale); the inner shape
          runs the CSS wave morph so the two never fight over `transform`. */}
      <motion.div
        className={styles.cursorBlob}
        style={{ translateX: blobX, translateY: blobY, x: "-50%", y: "-50%" }}
        animate={{
          scale: isClicking ? 0.8 : isHovering ? 1.5 : 1, // Expand on hover
          // Solid difference fill needs high opacity to read as a negative;
          // dropping it much lower fades the inversion into grey.
          opacity: isHovering ? 1 : 0.85,
        }}
        transition={{
          scale: { duration: 0.2 },
          opacity: { duration: 0.2 },
        }}
      >
        <div className={styles.blobShape} />
      </motion.div>
    </>
  );
}
