import type { ProjectCategory, ProjectPlatform } from "@/types/project";

/** A project row as returned from the API / stored in state. */
export interface ProjectRow {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: ProjectCategory;
  platform?: ProjectPlatform;
  tags: string[];
  year: string;
  duration?: string;
  role?: string;
  status?: "live" | "in-progress" | "archived" | "concept";
  stack?: string[];
  highlights?: string[];
  problem?: string;
  solution?: string;
  metrics?: { label: string; value: string }[];
  links?: Record<string, string>;
  media: { thumbnail: string; gallery?: string[]; fit?: "cover" | "contain" };
  interaction?: "glitch" | "tilt" | "spotlight";
  layout?: "tall" | "wide" | "featured";
}

/** Payload shape accepted by the projects API (snake_case fields). */
export type ProjectApiPayload = Omit<ProjectRow, "longDescription" | "metrics"> & {
  long_description?: string;
};

/**
 * Flat form state used by the add/edit form.
 * Array fields are stored as comma-separated strings for easy <input> binding.
 */
export type FormState = {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: ProjectCategory;
  platform?: ProjectPlatform;
  tags: string;
  year: string;
  duration?: string;
  role?: string;
  status?: "live" | "in-progress" | "archived" | "concept";
  stack: string;
  highlights: string;
  problem?: string;
  solution?: string;
  thumbnail: string;
  interaction?: "glitch" | "tilt" | "spotlight";
  layout?: "tall" | "wide" | "featured";
};
