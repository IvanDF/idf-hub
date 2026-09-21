#!/usr/bin/env node
/**
 * Generates the carved-ink border assets.
 *
 * Why this exists: the ink look used to come from `filter: url(#idf-ink-wobble)`,
 * an feTurbulence + feDisplacementMap pass evaluated at runtime. That cost
 * scales with the filtered area, is not GPU accelerated, and WebKit refuses to
 * cache the filtered layer of a fixed element over scrolling content — it held
 * Safari's GPU process at 600% CPU across the whole site.
 *
 * Here the displacement is baked into the path geometry instead. The output is
 * a plain SVG the browser rasterises once and then reuses as a texture, so
 * scrolling costs nothing.
 *
 * THE TILING CONSTRAINT: `border-image` repeats the middle slice of each edge.
 * A random wobble would show a visible seam at every repeat, so the offset is a
 * sum of sines whose periods divide the middle-slice length exactly. f(s) then
 * satisfies f(s + SLICE_SPAN) === f(s), and the strip tiles invisibly. That is
 * also why there is no RNG here: the output must be identical on every run.
 *
 * Usage: node scripts/generate-ink-frames.mjs
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "assets", "ink");

/** Keep in sync with $color-text-light / $color-text-dark in _variables.scss. */
const INKS = [
  { name: "light", stroke: "#111827" }, // ink for the light theme
  { name: "dark", stroke: "#f3f4f6" }, // ink for the dark theme
];

// ── Frame geometry ───────────────────────────────────────────────────────────
//
// The numbers are chosen so two things are exactly true rather than nearly so:
//
//   1. the repeating middle strip is SPAN long, and the wobble's period
//      divides SPAN — so the strip tiles with no seam;
//   2. the perimeter is a whole number of SPANs — so the path closes on
//      itself with no step where the trace comes back round.
//
// Corners are square. An arc makes the perimeter irrational (2πr), which
// breaks (2): an earlier version with r=14 left a 2-unit notch at the closure.
// Square corners also suit a hand-cut frame better than a radius does.
const SIZE = 100; // viewBox is SIZE x SIZE
const SLICE = 20; // border-image-slice, in user units
const SPAN = SIZE - SLICE * 2; // 60 — the length of the repeating middle strip
const STROKE = 4; // rendered at STROKE * (border-image-width / SLICE)
const INSET = 5; // side length is 90, so the perimeter is 360 = 6 x SPAN
const SIDE = SIZE - INSET * 2;

/** Largest excursion the wobble can reach, used to check it stays in frame. */
const AMP_A = 1.5;
const AMP_B = 0.75;

/**
 * Perpendicular offset at arc-length `s`, in user units.
 *
 * Both periods divide SPAN (60/30 = 2, 60/12 = 5), so the function repeats
 * exactly every SPAN — that is what makes the middle slice tile invisibly and
 * the closure meet. No phase offset: f(0) = 0 puts the corners on the nominal
 * corner point rather than a raised one.
 */
function wobble(s) {
  return AMP_A * Math.sin((2 * Math.PI * s) / 30) + AMP_B * Math.sin((2 * Math.PI * s) / 12);
}

/**
 * Traces the square frame, offsetting every sampled point along its outward
 * normal by `wobble(s)`. Returns an SVG path `d` string.
 *
 * Arc length starts at the top-left corner, so each edge begins at a multiple
 * of SIDE. SIDE is 90 and the wobble period is 60, so the offset at the start
 * of each edge differs — the four sides do not look copy-pasted.
 */
function inkedFrame() {
  const min = INSET;
  const max = SIZE - INSET;

  /** Each side: where a point sits at distance `d` in, and its outward normal. */
  const sides = [
    { at: (d) => [[min + d, min], [0, -1]] }, // top, left to right
    { at: (d) => [[max, min + d], [1, 0]] }, // right, top to bottom
    { at: (d) => [[max - d, max], [0, 1]] }, // bottom, right to left
    { at: (d) => [[min, max - d], [-1, 0]] }, // left, bottom to top
  ];

  const STEP = 0.75; // sampling distance, in user units
  const points = [];

  sides.forEach((side, i) => {
    for (let d = 0; d < SIDE; d += STEP) {
      const [[x, y], [nx, ny]] = side.at(d);
      const w = wobble(i * SIDE + d);
      points.push([x + nx * w, y + ny * w]);
    }
  });

  const n = (v) => Math.round(v * 100) / 100;
  return (
    `M${n(points[0][0])} ${n(points[0][1])}` +
    points.slice(1).map(([x, y]) => `L${n(x)} ${n(y)}`).join("") +
    "Z"
  );
}

/** Thickness of a rule asset across its short axis. */
const RULE_GIRTH = 12;

/**
 * An ink rule. Tiles along its long axis with period SPAN — the wobble's
 * period divides SPAN, so it repeats at any length without a seam.
 *
 * @param vertical - true for a rule that runs down instead of across.
 */
function inkedRule(vertical) {
  const mid = RULE_GIRTH / 2;
  const n = (v) => Math.round(v * 100) / 100;
  const pts = [];

  for (let t = 0; t <= SPAN; t += 0.75) {
    const along = t;
    const across = mid + wobble(t);
    pts.push(vertical ? [across, along] : [along, across]);
  }

  return (
    `M${n(pts[0][0])} ${n(pts[0][1])}` +
    pts.slice(1).map(([x, y]) => `L${n(x)} ${n(y)}`).join("")
  );
}

const framePath = inkedFrame();
const rulePath = inkedRule(false);
const ruleVPath = inkedRule(true);

mkdirSync(OUT_DIR, { recursive: true });

for (const { name, stroke } of INKS) {
  const common = `fill="none" stroke="${stroke}" stroke-linecap="round" stroke-linejoin="round"`;

  writeFileSync(
    join(OUT_DIR, `frame-${name}.svg`),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}">` +
      `<path d="${framePath}" ${common} stroke-width="${STROKE}"/>` +
      `</svg>\n`,
  );

  writeFileSync(
    join(OUT_DIR, `rule-${name}.svg`),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SPAN} ${RULE_GIRTH}" width="${SPAN}" height="${RULE_GIRTH}">` +
      `<path d="${rulePath}" ${common} stroke-width="2"/>` +
      `</svg>\n`,
  );

  writeFileSync(
    join(OUT_DIR, `rule-v-${name}.svg`),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${RULE_GIRTH} ${SPAN}" width="${RULE_GIRTH}" height="${SPAN}">` +
      `<path d="${ruleVPath}" ${common} stroke-width="2"/>` +
      `</svg>\n`,
  );

  console.log(`ink: frame-${name}.svg, rule-${name}.svg, rule-v-${name}.svg`);
}

// The sine construction exists to make these two things exact. If either ever
// drifts, the frame shows a seam where the middle slice repeats or a step where
// the trace closes — so fail the build rather than ship a broken asset.
const perimeter = SIDE * 4;
const seam = Math.abs(wobble(0) - wobble(SPAN));
const closure = Math.abs(wobble(0) - wobble(perimeter));
const reach = INSET - (AMP_A + AMP_B) - STROKE / 2;

if (seam > 1e-9) {
  console.error(`tiling broken: wobble(0) and wobble(${SPAN}) differ by ${seam}`);
  process.exit(1);
}
if (closure > 1e-9) {
  console.error(`closure broken: perimeter ${perimeter} is not a whole number of ${SPAN}`);
  process.exit(1);
}
if (reach < 0) {
  console.error(`stroke escapes the viewBox by ${-reach} units — raise INSET`);
  process.exit(1);
}
console.log(`tiling ok (period ${SPAN}), closure ok (perimeter ${perimeter} = ${perimeter / SPAN} x ${SPAN}), ${reach} units of clearance`);
