import type { Project } from "@/types/project";

// Maps a Supabase DB row (snake_case) to the Project type (camelCase)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapDbRowToProject(row: Record<string, any>): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    longDescription: row.long_description,
    category: row.category,
    platform: row.platform,
    tags: row.tags ?? [],
    year: row.year,
    duration: row.duration,
    role: row.role,
    status: row.status,
    stack: row.stack ?? [],
    highlights: row.highlights ?? [],
    problem: row.problem,
    solution: row.solution,
    metrics: row.metrics ?? [],
    links: row.links ?? {},
    media: row.media ?? { thumbnail: "" },
    interaction: row.interaction,
    layout: row.layout,
  };
}
