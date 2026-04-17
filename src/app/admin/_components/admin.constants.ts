import type { ProjectCategory, ProjectPlatform } from "@/types/project";
import type { FormState } from "./admin.types";

/** All valid project categories. */
export const CATEGORIES: ProjectCategory[] = [
  "DEV",
  "VSCODE",
  "CREATIVE",
  "MAKER",
  "APPLE",
  "CODEPEN",
  "EXPERIMENT",
];

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
  category: "DEV",
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
