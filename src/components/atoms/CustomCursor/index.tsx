"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * CustomCursor Component
 *
 * Replaces the default system cursor with an interactive, animated cursor.
 * Features:
 * - Central dot that follows mouse instantly
 * - Outer ring with spring physics (magnetic feel)
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

  // Spring physics for the outer ring (delayed follow)
  const springConfig = { damping: 25, stiffness: 300 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);
  const activeMagnetElRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Only enable on desktop devices
    const isTouchDevice = window.matchMedia(
      "(hover: none) and (pointer: coarse)",
    ).matches;
    if (isTouchDevice) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const resetMagnetElement = (element: HTMLElement | null) => {
      if (!element) return;
      element.style.setProperty("translate", "0px 0px");
      element.style.removeProperty("will-change");
    };

    const applyGlobalMagnetism = (e: MouseEvent) => {
      const source = e.target as HTMLElement | null;
      const candidate = source?.closest(
        "a, button, [role='button'], [data-magnetized='true']",
      ) as HTMLElement | null;

      // Keep local Magnetic components in control.
      if (!candidate || candidate.closest("[data-local-magnetic='true']")) {
        if (activeMagnetElRef.current) {
          resetMagnetElement(activeMagnetElRef.current);
          activeMagnetElRef.current = null;
        }
        return;
      }

      if (
        activeMagnetElRef.current &&
        activeMagnetElRef.current !== candidate
      ) {
        resetMagnetElement(activeMagnetElRef.current);
      }

      activeMagnetElRef.current = candidate;

      const rect = candidate.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const normalizedX = (e.clientX - centerX) / Math.max(rect.width, 1);
      const normalizedY = (e.clientY - centerY) / Math.max(rect.height, 1);
      const maxOffset = 10;
      const offsetX = Math.max(-1, Math.min(1, normalizedX)) * maxOffset;
      const offsetY = Math.max(-1, Math.min(1, normalizedY)) * maxOffset;

      candidate.style.setProperty("will-change", "translate");
      candidate.style.setProperty(
        "translate",
        `${offsetX.toFixed(2)}px ${offsetY.toFixed(2)}px`,
      );
    };

    const clearMagnetism = () => {
      if (activeMagnetElRef.current) {
        resetMagnetElement(activeMagnetElRef.current);
        activeMagnetElRef.current = null;
      }
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

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousemove", applyGlobalMagnetism);
    window.addEventListener("mouseleave", clearMagnetism);
    window.addEventListener("blur", clearMagnetism);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousemove", applyGlobalMagnetism);
      window.removeEventListener("mouseleave", clearMagnetism);
      window.removeEventListener("blur", clearMagnetism);
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
        style={{
          translateX: mouseX,
          translateY: mouseY,
          x: "-50%",
          y: "-50%",
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          backgroundColor: "#FFFFFF", // Force white for difference mode
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 1000001,
          mixBlendMode: "difference", // Ensure visibility on all backgrounds
        }}
        animate={{
          scale: isClicking ? 0.8 : isHovering ? 0.5 : 1, // Shrink slightly on hover/click
        }}
        transition={{ duration: 0.1 }}
      />

      {/* Outer Ring (Spring Follow) */}
      <motion.div
        style={{
          translateX: ringX,
          translateY: ringY,
          x: "-50%",
          y: "-50%",
          position: "fixed",
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          border: "1px solid #FFFFFF", // Force white for difference mode
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 1000000,
          mixBlendMode: "difference",
          backgroundColor: "transparent",
        }}
        animate={{
          scale: isClicking ? 0.8 : isHovering ? 1.5 : 1, // Expand on hover
          opacity: isHovering ? 0.8 : 0.4,
          borderWidth: isHovering ? "2px" : "1px",
        }}
        transition={{
          scale: { duration: 0.2 },
          opacity: { duration: 0.2 },
        }}
      />
    </>
  );
}
