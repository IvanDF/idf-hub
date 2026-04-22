"use client";

import { motion, useReducedMotion } from "framer-motion";
import styles from "./LogoMorph.module.scss";

// ── SVG path data from the iDF logo mark (viewBox 0 0 184 256) ─────────────

const PATH_CIRCLE =
  "M64.4148 95.7472C76.564 95.7472 86.4143 85.9177 86.4143 73.794C86.4143 61.6704 76.564 51.8408 64.4148 51.8408C52.2656 51.8408 42.4153 61.6704 42.4153 73.794C42.4153 85.9177 52.2656 95.7472 64.4148 95.7472Z";

const PATH_JCURVE =
  "M25.7395 107.712L35.0434 107.448C63.1532 107.448 85.975 130.205 85.975 158.237L86.1042 205.212C86.1042 214.555 93.7105 222.14 103.08 222.14H110.469V222.104C119.97 222.104 127.447 229.7 127.447 239.052C127.447 248.407 119.97 256 110.469 256H103.08C74.9725 256 52.1507 233.243 52.1507 205.212L52.0215 158.237C52.0215 148.893 44.4124 141.308 35.0434 141.308L25.7395 141.572C16.3595 141.572 8.74487 133.976 8.74487 124.621C8.74487 115.269 16.3595 107.676 25.7395 107.676V107.712Z";

const PATH_TOPBAR =
  "M16.9946 0.26344L132.058 0C160.167 0 182.989 22.7572 182.989 50.7887L183.118 154.641C183.118 163.985 149.165 182.673 149.165 154.641L149.036 50.7887C149.036 41.4449 141.427 33.8601 132.058 33.8601L16.9946 34.1235C7.61458 34.1235 0 26.5277 0 17.1729C0 7.82082 7.61458 0.227765 16.9946 0.227765V0.26344Z";

const PATH_BOTTOMRIGHT =
  "M112.032 212.545L132.058 212.809C160.167 212.809 182.989 190.051 182.989 162.02L183.118 111.275C183.118 101.931 149.165 83.2436 149.165 111.275L149.036 162.02C149.036 171.364 141.427 178.949 132.058 178.949L112.032 178.685C102.652 178.685 95.0378 186.281 95.0378 195.636C95.0378 204.988 102.652 212.581 112.032 212.581V212.545Z";

// Draw order: circle → top-bar → J-curve → bottom-right
const PATHS = [PATH_CIRCLE, PATH_TOPBAR, PATH_JCURVE, PATH_BOTTOMRIGHT];
const STAGGER_DELAY = 0.18; // seconds between each path draw start
const DRAW_DURATION = 0.65; // time to stroke each path
const FILL_OFFSET = 0.45; // fill fades in this many seconds after stroke starts

// ── Props ───────────────────────────────────────────────────────────────────

interface LogoMorphProps {
  /**
   * Animation mode:
   * - `assemble` (default) — paths draw themselves stroke-first, then fill
   * - `static` — no animation, plain logo
   * @deprecated `mode` is reserved for future use. Currently only "assemble" is implemented.
   */
  mode?: "assemble" | "static";
  /** CSS color for the logo fill. Defaults to currentColor. */
  color?: string;
  /** Width in px. Height is derived from the 184:256 aspect ratio. */
  size?: number;
  /** Additional class applied to the root element. */
  className?: string;
}

// ── Sub-component: assembled logo SVG with stroke-draw entrance ──────────────

/**
 * Renders the iDF logo with a stroke path-draw animation:
 * each path is stroked first (pathLength 0→1), then filled.
 */
function AssembledLogo({ color, size }: { color: string; size: number }) {
  const shouldReduceMotion = useReducedMotion();
  const height = Math.round((size / 184) * 256);

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 184 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {PATHS.map((d, i) => {
        const delay = i * STAGGER_DELAY;
        return (
          <motion.path
            key={i}
            d={d}
            fill={color}
            stroke={color}
            strokeWidth={2}
            fillRule={i > 0 ? "evenodd" : undefined}
            clipRule={i > 0 ? "evenodd" : undefined}
            initial={
              shouldReduceMotion
                ? { pathLength: 1, fillOpacity: 1, strokeOpacity: 0 }
                : { pathLength: 0, fillOpacity: 0, strokeOpacity: 1 }
            }
            animate={{ pathLength: 1, fillOpacity: 1, strokeOpacity: 0 }}
            transition={{
              pathLength: { duration: DRAW_DURATION, ease: "easeInOut", delay },
              fillOpacity: { duration: 0.3, delay: delay + FILL_OFFSET },
              strokeOpacity: { duration: 0.25, delay: delay + FILL_OFFSET },
            }}
          />
        );
      })}
    </svg>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

/**
 * Animated iDF logo mark.
 * In `assemble` mode each path draws itself stroke-first then fills in.
 * In `static` mode no animation is applied.
 * Always respects `prefers-reduced-motion`.
 */
export default function LogoMorph({
  mode = "assemble",
  color = "currentColor",
  size = 80,
  className,
}: LogoMorphProps) {
  // Note: mode is accepted for future animation support - currently only "assemble" is implemented
  return (
    <div
      className={`${styles.root} ${className ?? ""}`}
      role="img"
      aria-label="iDF logo"
    >
      <AssembledLogo color={color} size={size} />
    </div>
  );
}
