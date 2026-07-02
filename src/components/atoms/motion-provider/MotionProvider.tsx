"use client";

import { MotionConfig } from "framer-motion";

/**
 * App-wide framer-motion config: with `reducedMotion="user"` every motion
 * component (page transitions, card pops, overlays, cursor pulses) respects
 * the OS-level prefers-reduced-motion setting automatically.
 */
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
