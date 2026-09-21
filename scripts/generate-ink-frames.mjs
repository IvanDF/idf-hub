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
// Rounded corners make the perimeter irrational (2πr), so (2) cannot be met by
// arithmetic — an early version with r=14 left a 2-unit notch where the trace
// closed. Instead the wobble is tapered to zero over a short run either side of
// the start point, which sits mid-corner. Both ends then meet at offset zero
// whatever the perimeter is, and the taper stays inside the corner slice, so
// the repeating middle strips never see it.
const SIZE = 100; // viewBox is SIZE x SIZE
const SLICE = 20; // border-image-slice, in user units
const SPAN = SIZE - SLICE * 2; // 60 — the length of the repeating middle strip
const STROKE = 4; // rendered at STROKE * (border-image-width / SLICE)
const INSET = 5;
const SIDE = SIZE - INSET * 2;
const RADIUS = 16; // matches --route-card-radius, and fits inside SLICE
const ARC = (Math.PI / 2) * RADIUS; // quarter-turn arc length
const TAPER = ARC / 2; // ramp length at each end of the trace

/**
 * Wobble amplitudes, in user units. Their sum is the largest excursion, which
 * is also checked against INSET so the stroke cannot leave the viewBox.
 *
 * Kept deliberately shallow: at the rendered scale these land around half a
 * pixel, which reads as a hand-cut line rather than a decorative ripple. The
 * first pass used 1.5 / 0.75 and looked like a scallop.
 */
const AMP_A = 0.7;
const AMP_B = 0.3;

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
 * Traces a rounded rectangle, offsetting every sampled point along its outward
 * normal by `wobble(s)` scaled by the closure taper.
 *
 * The trace starts halfway round the top-left corner, so the taper — the only
 * place the wobble is damped — falls entirely inside a corner slice, which
 * border-image draws once and never repeats.
 *
 * @param amp - multiplier on the wobble, for lighter variants.
 */
function inkedFrame(amp) {
  const min = INSET;
  const max = SIZE - INSET;
  const r = RADIUS;
  const straight = SIDE - 2 * r;

  // Legs in trace order, starting mid top-left corner.
  const corner = (cx, cy, from) => ({
    len: ARC,
    at: (d) => {
      const a = from + d / r;
      return [[cx + r * Math.cos(a), cy + r * Math.sin(a)], [Math.cos(a), Math.sin(a)]];
    },
  });

  const legs = [
    // second half of the top-left corner
    { len: ARC / 2, at: (d) => corner(min + r, min + r, Math.PI + Math.PI / 4).at(d) },
    { len: straight, at: (d) => [[min + r + d, min], [0, -1]] }, // top
    corner(max - r, min + r, -Math.PI / 2), // top-right
    { len: straight, at: (d) => [[max, min + r + d], [1, 0]] }, // right
    corner(max - r, max - r, 0), // bottom-right
    { len: straight, at: (d) => [[max - r - d, max], [0, 1]] }, // bottom
    corner(min + r, max - r, Math.PI / 2), // bottom-left
    { len: straight, at: (d) => [[min, max - r - d], [-1, 0]] }, // left
    // first half of the top-left corner, closing the loop
    { len: ARC / 2, at: (d) => corner(min + r, min + r, Math.PI).at(d) },
  ];

  const total = legs.reduce((t, l) => t + l.len, 0);
  const STEP = 0.6;
  const points = [];
  let s = 0;

  for (const leg of legs) {
    for (let d = 0; d < leg.len; d += STEP) {
      const [[x, y], [nx, ny]] = leg.at(d);
      const at = s + d;
      // Ramp the wobble in and out so both ends of the trace sit at offset 0
      const taper = Math.min(1, at / TAPER, (total - at) / TAPER);
      const w = wobble(at) * amp * Math.max(0, taper);
      points.push([x + nx * w, y + ny * w]);
    }
    s += leg.len;
  }

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
function inkedRule(vertical, amp) {
  const mid = RULE_GIRTH / 2;
  const n = (v) => Math.round(v * 100) / 100;
  const pts = [];

  for (let t = 0; t <= SPAN; t += 0.75) {
    const along = t;
    const across = mid + wobble(t) * amp;
    pts.push(vertical ? [across, along] : [along, across]);
  }

  return (
    `M${n(pts[0][0])} ${n(pts[0][1])}` +
    pts.slice(1).map(([x, y]) => `L${n(x)} ${n(y)}`).join("")
  );
}

// Two strengths. "fine" is for chips, controls and anything sitting next to
// text, where the full amplitude competes with the letterforms.
const WEIGHTS = [
  { suffix: "", amp: 1 },
  { suffix: "-fine", amp: 0.5 },
];

mkdirSync(OUT_DIR, { recursive: true });

let written = 0;
for (const { name, stroke } of INKS) {
  const common = `fill="none" stroke="${stroke}" stroke-linecap="round" stroke-linejoin="round"`;

  for (const { suffix, amp } of WEIGHTS) {
    writeFileSync(
      join(OUT_DIR, `frame${suffix}-${name}.svg`),
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}">` +
        `<path d="${inkedFrame(amp)}" ${common} stroke-width="${STROKE}"/>` +
        `</svg>\n`,
    );

    writeFileSync(
      join(OUT_DIR, `rule${suffix}-${name}.svg`),
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SPAN} ${RULE_GIRTH}" width="${SPAN}" height="${RULE_GIRTH}">` +
        `<path d="${inkedRule(false, amp)}" ${common} stroke-width="2"/>` +
        `</svg>\n`,
    );

    writeFileSync(
      join(OUT_DIR, `rule-v${suffix}-${name}.svg`),
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${RULE_GIRTH} ${SPAN}" width="${RULE_GIRTH}" height="${SPAN}">` +
        `<path d="${inkedRule(true, amp)}" ${common} stroke-width="2"/>` +
        `</svg>\n`,
    );
    written += 3;
  }
}
console.log(`ink: ${written} assets (${INKS.length} themes x ${WEIGHTS.length} weights x 3 shapes)`);

// The sine construction exists to make these two things exact. If either ever
// drifts, the frame shows a seam where the middle slice repeats or a step where
// the trace closes — so fail the build rather than ship a broken asset.
const seam = Math.abs(wobble(0) - wobble(SPAN));
const reach = INSET - (AMP_A + AMP_B) - STROKE / 2;

if (seam > 1e-9) {
  console.error(`tiling broken: wobble(0) and wobble(${SPAN}) differ by ${seam}`);
  process.exit(1);
}
if (reach < 0) {
  console.error(`stroke escapes the viewBox by ${-reach} units — raise INSET`);
  process.exit(1);
}
// The taper is what closes the trace, so it must fit inside a corner slice —
// otherwise the damping would show up in a strip border-image repeats.
if (TAPER > SLICE) {
  console.error(`taper ${TAPER} reaches past the corner slice ${SLICE}`);
  process.exit(1);
}
console.log(`tiling ok (period ${SPAN}), taper ${TAPER.toFixed(1)} inside slice ${SLICE}, ${reach} units of clearance`);
