"use client";

import { PROJECTS } from "@/data/projects";
import type { Project } from "@/types/project";
import InkPlate from "./InkPlate";

/** Showcase order comes from the data, so this file has no list to keep in step. */
export const FEATURED: Project[] = PROJECTS.filter((p) => p.featured).sort(
  (a, b) => a.featured! - b.featured!,
);

/**
 * Whether a project has a thumbnail worth showing large.
 *
 * Yggdrasil's is a 231-byte 16x16 line glyph standing in for an image that was
 * never made, drawn with `stroke="currentColor"` — loaded through an `img` it
 * is cut off from the page's CSS, renders black and disappears in dark mode.
 * Those entries go typographic instead. See docs/project-assets.md.
 */
export function hasHeroImage(project: Project) {
  return !project.media.thumbnail.endsWith(".svg");
}

/**
 * The top of the Work descent: the four projects that carry the portfolio, one
 * screen each.
 *
 * It is the heaviest of three tiers that step down without a break — full
 * plates here, half-weight cards in InkCards, compact rows for the archive —
 * so the page never switches from an experience to a table.
 *
 * Motion is scrubbed by `animation-timeline: view()` and degrades to the
 * finished static plate where that is missing (Safari 18, Firefox) or reduced
 * motion is asked for. No resting style commits `opacity: 0`; the scar above
 * the reveal rules in globals.scss is about exactly that.
 */
export default function FeaturedWork() {
  return <InkPlate />;
}
