"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import type { MotionStyle } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./CustomCursor.module.scss";

// Magnetism (translating the hovered element) only reads as "magnetic" on
// controls, not on large surfaces: full-width list rows dragged around force
// the ink filter to re-run over the page every frame. The cap must still
// admit wide CTAs (e.g. the ~470px time-machine action) — only row-scale
// elements are excluded. The blob envelope has no such cost, so it applies
// to every interactive element regardless of size.
const MAX_MAGNET_WIDTH = 480;
const MAX_MAGNET_HEIGHT = 120;

// Keep in sync with $size-cursor-ring in the SCSS variables.
const BLOB_SIZE = 40;
// Breathing room the blob adds around an enveloped control.
const ENVELOPE_PAD = 6;

type MagnetEntry = {
  el: HTMLElement;
  rect: DOMRect;
  eligible: boolean;
  radius: string;
  // Last magnet offset written to the element, so re-measures of its rect can
  // subtract the translate we introduced ourselves.
  ox: number;
  oy: number;
};

type Envelope = {
  width: number;
  height: number;
  radius: string;
  /** Compact controls melt the dot away; on large surfaces it stays visible
   *  so the pointer position never gets lost inside the inversion. */
  compact: boolean;
};

const envelopeFor = (
  rect: DOMRect,
  radius: string,
  compact: boolean,
): Envelope => ({
  width: rect.width + ENVELOPE_PAD * 2,
  height: rect.height + ENVELOPE_PAD * 2,
  // Square controls read better with the squircle default than with a
  // hairline 0px corner.
  radius: radius === "0px" ? "12px" : radius,
  compact,
});

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
  // iPadOS-style pointer adoption: while a compact control is hovered the
  // blob stretches to the control's box and the dot melts into it.
  const [envelope, setEnvelope] = useState<Envelope | null>(null);
  // Contextual affordance drawn in place of the dot: "+" over a zoomable image,
  // "−" inside the open lightbox. Any element carrying `data-cursor-glyph`
  // sets it, as long as the pointer is not adopting a control.
  const [glyph, setGlyph] = useState<string | null>(null);
  const glyphRef = useRef<string | null>(null);

  const pathname = usePathname();

  // Mouse position state
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring physics for the blob: stiff enough to stay glued to the dot
  // (a soft spring here reads as page lag), soft enough to keep a hint
  // of organic overshoot. Driven manually so the target can switch between
  // the pointer and the center of an enveloped control.
  const springConfig = { damping: 32, stiffness: 750, mass: 0.8 };
  const blobX = useSpring(-100, springConfig);
  const blobY = useSpring(-100, springConfig);
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

    // Re-reads the control's rect (minus our own translate) and re-targets
    // envelope + blob. Used after clicks that swap content, and whenever the
    // enveloped control resizes under the pointer (e.g. the Work fork cards
    // growing on hover — the envelope used to stay frozen at entry size).
    const remeasureEntry = (entry: MagnetEntry) => {
      if (activeMagnetRef.current !== entry) return;
      const raw = entry.el.getBoundingClientRect();
      entry.rect = new DOMRect(
        raw.x - entry.ox,
        raw.y - entry.oy,
        raw.width,
        raw.height,
      );
      setEnvelope(envelopeFor(entry.rect, entry.radius, entry.eligible));
      blobX.set(entry.rect.left + entry.rect.width / 2 + entry.ox);
      blobY.set(entry.rect.top + entry.rect.height / 2 + entry.oy);
    };

    // One observer for whichever control is currently enveloped; it batches
    // per frame, so a 0.5s flex-grow transition tracks smoothly.
    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            const entry = activeMagnetRef.current;
            if (entry) remeasureEntry(entry);
          })
        : null;

    const clearMagnetism = () => {
      resizeObserver?.disconnect();
      resetMagnetElement(activeMagnetRef.current);
      activeMagnetRef.current = null;
      setEnvelope(null);
    };

    const setGlyphFor = (source: HTMLElement | null, enveloping: boolean) => {
      // The envelope wins: adopting a control (e.g. the lightbox close button)
      // must not also paint a "−" over it.
      const next = enveloping
        ? null
        : (source?.closest("[data-cursor-glyph]") as HTMLElement | null)?.getAttribute(
            "data-cursor-glyph",
          ) ?? null;
      if (next !== glyphRef.current) {
        glyphRef.current = next;
        setGlyph(next);
      }
    };

    // Applies magnetism and returns the blob's target point: the (parallax-
    // shifted) center of an enveloped control, or the pointer itself.
    const applyGlobalMagnetism = (e: MouseEvent): { x: number; y: number } => {
      const pointer = { x: e.clientX, y: e.clientY };
      const source = e.target as HTMLElement | null;
      const candidate = source?.closest(
        "a, button, [role='button'], [data-magnetized='true']",
      ) as HTMLElement | null;

      // Keep local Magnetic components in control, and stay plain over
      // surfaces that opt out entirely (e.g. the 3D business card, where the
      // difference-inversion would negate the whole artwork).
      if (
        !candidate ||
        candidate.closest("[data-local-magnetic='true']") ||
        candidate.closest("[data-cursor-native='true']")
      ) {
        clearMagnetism();
        return pointer;
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
          radius: getComputedStyle(candidate).borderRadius,
          ox: 0,
          oy: 0,
        };
        activeMagnetRef.current = entry;
        if (entry.eligible) {
          candidate.style.setProperty("will-change", "translate");
        }
        setEnvelope(envelopeFor(rect, entry.radius, entry.eligible));
        // Track size changes of the adopted control (hover-grow cards etc.)
        resizeObserver?.disconnect();
        resizeObserver?.observe(candidate);
      }

      const { rect } = entry;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Large surfaces get the envelope but not the translate: the blob
      // parks on their center while the element stays put.
      if (!entry.eligible) return { x: centerX, y: centerY };

      const normalizedX = (e.clientX - centerX) / Math.max(rect.width, 1);
      const normalizedY = (e.clientY - centerY) / Math.max(rect.height, 1);
      const maxOffset = 10;
      const offsetX = Math.max(-1, Math.min(1, normalizedX)) * maxOffset;
      const offsetY = Math.max(-1, Math.min(1, normalizedY)) * maxOffset;

      entry.ox = offsetX;
      entry.oy = offsetY;
      entry.el.style.setProperty(
        "translate",
        `${offsetX.toFixed(2)}px ${offsetY.toFixed(2)}px`,
      );

      // The blob rides the control: same center, same magnet parallax.
      return { x: centerX + offsetX, y: centerY + offsetY };
    };

    // Unthrottled: motion values already coalesce to one render per frame,
    // and capping at 60fps made the dot stutter on high-refresh displays.
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      const target = applyGlobalMagnetism(e);
      blobX.set(target.x);
      blobY.set(target.y);
      setGlyphFor(e.target as HTMLElement | null, activeMagnetRef.current !== null);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => {
      setIsClicking(false);
      // A click can swap the control's content (PLAY -> PAUSE), so re-measure
      // the enveloped rect once the DOM has settled.
      const entry = activeMagnetRef.current;
      if (!entry) return;
      requestAnimationFrame(() => remeasureEntry(entry));
    };

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
      glyphRef.current = null;
    };
  }, [mouseX, mouseY, blobX, blobY]);

  // Reset hover state on navigation
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHovering(false);
    setIsClicking(false);
    setEnvelope(null);
    setGlyph(null);
    glyphRef.current = null;
  }, [pathname]);

  if (!isVisible) return null;

  return (
    <>
      {/* Central Dot (Instant Follow) — melts into compact enveloped controls,
          stays visible inside large ones (or the pointer position gets lost in
          the inversion), and steps aside for the contextual glyph. */}
      <motion.div
        className={styles.cursorDot}
        style={{ translateX: mouseX, translateY: mouseY, x: "-50%", y: "-50%" }}
        animate={{
          scale: envelope
            ? envelope.compact
              ? 0
              : 0.5
            : glyph
              ? 0
              : isClicking
                ? 0.8
                : isHovering
                  ? 0.5
                  : 1,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Contextual glyph (Instant Follow) — the affordance the blob carries:
          "+" to zoom into an image, "−" to leave the open viewer. Blended as a
          negative like the dot so it reads on any background. Framer owns the
          follow transform; the reveal uses the independent CSS `scale`
          property (see the module) so the two never fight over `transform`. */}
      <motion.div
        className={styles.cursorGlyph}
        data-active={glyph ? "true" : undefined}
        style={{ translateX: mouseX, translateY: mouseY, x: "-50%", y: "-50%" }}
        aria-hidden="true"
      >
        {glyph}
      </motion.div>

      {/* Outer Blob (Spring Follow + Wave Morph). While a compact control is
          hovered it adopts the control: stretches to its box, takes its
          corner radius, and rides its magnet parallax (iPadOS pointer). */}
      {/* Framer owns the outer transform (position/scale); the inner shape
          runs the CSS wave morph so the two never fight over `transform`. */}
      <motion.div
        className={styles.cursorBlob}
        data-enveloped={envelope ? "true" : undefined}
        style={
          {
            translateX: blobX,
            translateY: blobY,
            x: "-50%",
            y: "-50%",
            // Custom properties aren't in MotionStyle, but Framer forwards
            // them to the element's inline style.
            "--blob-radius": envelope?.radius,
          } as MotionStyle
        }
        animate={{
          width: envelope ? envelope.width : BLOB_SIZE,
          height: envelope ? envelope.height : BLOB_SIZE,
          scale: isClicking
            ? envelope
              ? 0.97
              : 0.8
            : envelope
              ? 1
              : isHovering
                ? 1.5
                : 1,
          // Solid difference fill needs high opacity to read as a negative;
          // dropping it much lower fades the inversion into grey.
          opacity: envelope ? 0.95 : isHovering ? 1 : 0.85,
        }}
        transition={{
          width: { duration: 0.2, ease: "easeOut" },
          height: { duration: 0.2, ease: "easeOut" },
          scale: { duration: 0.2 },
          opacity: { duration: 0.2 },
        }}
      >
        <div className={styles.blobShape} />
      </motion.div>
    </>
  );
}
