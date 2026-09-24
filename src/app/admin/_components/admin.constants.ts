import type { ProjectCategory, ProjectKind, ProjectPlatform } from "@/types/project";
import type { FormState } from "./admin.types";

/** All valid project categories. */
export const CATEGORIES: ProjectCategory[] = ["CODE", "DESIGN", "CRAFT"];

/** Subcategories. Craft is the bucket that subdivides; the rest leave it unset. */
export const KINDS: ProjectKind[] = ["photo", "template", "shortcut", "experiment"];

/** All valid project platforms. */
export const PLATFORMS: ProjectPlatform[] = [
  "github",
  "figma",
  "notion",
  "codepen",
  "apple-shortcuts",
  "vscode-marketplace",
  "web",
];

/** All valid project statuses. */
export const STATUSES = ["live", "in-progress", "archived", "concept"] as const;

/** All valid card interaction modes. */
export const INTERACTIONS = ["glitch", "tilt", "spotlight"] as const;

/** All valid card layout variants. */
export const LAYOUTS = ["tall", "wide", "featured"] as const;

/** Default blank form used when opening the "add project" modal. */
export const EMPTY_FORM: FormState = {
  id: "",
  title: "",
  description: "",
  longDescription: "",
  category: "CODE",
  platform: undefined,
  tags: "",
  year: new Date().getFullYear().toString(),
  duration: "",
  role: "",
  status: undefined,
  stack: "",
  highlights: "",
  problem: "",
  solution: "",
  thumbnail: "",
  interaction: undefined,
  layout: undefined,
};
