#!/usr/bin/env node
/**
 * Generates the scannable codes for the printed GabberG cards.
 *
 * Why at build time: a QR encoder carries Reed-Solomon error correction, and
 * shipping one to the browser to draw a handful of codes that never change is
 * paying at runtime for something the repository already knows. These come out
 * as flat SVGs the page just loads.
 *
 * Why SVG and not PNG: a code is pure geometry, so it stays sharp at any size
 * and at any print resolution, which is what these are ultimately for.
 *
 * Error correction is set to M. Q and H survive more damage but pack more
 * modules into the same square, and these are read off a screen or a clean
 * print, not off something scuffed.
 *
 * Run: npm run qr
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import QRCode from "qrcode";

// The data file is TypeScript, so the list is mirrored here rather than
// imported. The test in __tests__/data keeps the two honest.
const BASE = "https://gabberg.netlify.app/";
const CARDS = ["dp-ygh-001-01"];

const OUT_DIR = path.resolve("public/projects/gabberg-icard/qr");

/**
 * Dark modules on a light backing, in both themes, on purpose.
 *
 * Making the code inherit `currentColor` would be tidier and would let it flip
 * with the theme, but an inverted code (light modules on dark) is read less
 * reliably by a fair number of scanners, and the entire point of these is that
 * a stranger at an event scans one on the first try. The page frames the code
 * instead of recolouring it.
 */
function annotate(svg) {
  return svg.replace(
    /shape-rendering="crispEdges"/,
    'shape-rendering="crispEdges" role="img"',
  );
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  for (const type of CARDS) {
    const url = `${BASE}?card_type=${type}`;
    const svg = await QRCode.toString(url, {
      type: "svg",
      errorCorrectionLevel: "M",
      margin: 1,
    });
    const file = path.join(OUT_DIR, `${type}.svg`);
    await writeFile(file, annotate(svg), "utf8");
    console.log(`  ${type}  ->  ${url}`);
  }

  console.log(`\n${CARDS.length} code(s) written to ${path.relative(process.cwd(), OUT_DIR)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
