import type { FormState, ProjectApiPayload, ProjectRow } from "./admin.types";

/**
 * Converts a `ProjectRow` (API shape) into the flat `FormState`
 * used by the add/edit form, joining array fields with ", ".
 */
export function rowToForm(row: ProjectRow): FormState {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    longDescription: row.longDescription ?? "",
    category: row.category,
    platform: row.platform,
    tags: (row.tags ?? []).join(", "),
    year: row.year,
    duration: row.duration ?? "",
    role: row.role ?? "",
    status: row.status,
    stack: (row.stack ?? []).join(", "),
    highlights: (row.highlights ?? []).join(", "),
    problem: row.problem ?? "",
    solution: row.solution ?? "",
    thumbnail: row.media?.thumbnail ?? "",
    interaction: row.interaction,
    layout: row.layout,
  };
}

/**
 * Converts the flat `FormState` back into a `ProjectApiPayload`
 * ready to POST/PUT to the projects API.
 */
export function formToRow(form: FormState): ProjectApiPayload {
  return {
    id: form.id.trim(),
    title: form.title.trim(),
    description: form.description.trim(),
    long_description: form.longDescription?.trim() || undefined,
    category: form.category,
    platform: form.platform || undefined,
    tags: form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    year: form.year.trim(),
    duration: form.duration?.trim() || undefined,
    role: form.role?.trim() || undefined,
    status: form.status || undefined,
    stack: form.stack
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    highlights: form.highlights
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    problem: form.problem?.trim() || undefined,
    solution: form.solution?.trim() || undefined,
    links: {},
    media: { thumbnail: form.thumbnail.trim() },
    interaction: form.interaction || undefined,
    layout: form.layout || undefined,
  };
}
