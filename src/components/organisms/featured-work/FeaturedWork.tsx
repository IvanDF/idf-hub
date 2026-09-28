"use client";

import { PROJECTS } from "@/data/projects";
import type { Project } from "@/types/project";
import { useSearchParams } from "next/navigation";
import InkPlate from "./InkPlate";
import RealmJourney from "./RealmJourney";
import TerminalSession from "./TerminalSession";

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

export type Experiment = "ink" | "terminal" | "realms";

const EXPERIMENTS: Record<string, Experiment> = {
  a: "ink",
  b: "terminal",
  c: "realms",
  ink: "ink",
  terminal: "terminal",
  realms: "realms",
};

/**
 * The Work showcase, in three readings of the same four projects.
 *
 * `?exp=a|b|c` picks one. They are alternatives to choose between, not a
 * feature — once one wins the other two come out, along with this switch.
 *
 * Every variant is scroll-driven through `animation-timeline: view()`, and
 * every one degrades to its finished, static layout where that is missing
 * (Safari 18, Firefox) or where reduced motion is asked for. Nothing commits
 * `opacity: 0` to an element's resting style: the scar in globals.scss above
 * the reveal rules is about exactly that, and it applies here too.
 */
export default function FeaturedWork() {
  const params = useSearchParams();
  const variant = EXPERIMENTS[params.get("exp") ?? ""] ?? "ink";

  if (variant === "terminal") return <TerminalSession />;
  if (variant === "realms") return <RealmJourney />;
  return <InkPlate />;
}
