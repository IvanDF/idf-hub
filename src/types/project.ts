export type ProjectCategory =
  | "DEV"
  | "VSCODE"
  | "DESIGN"
  | "FIGMA"
  | "MAKER"
  | "APPLE"
  | "CODEPEN"
  | "PRINT"
  | "EXPERIMENT";

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: ProjectCategory;
  tags: string[];
  year: string;
  duration?: string;
  role?: string;
  status?: "live" | "in-progress" | "archived" | "concept";
  stack?: string[];
  highlights?: string[];
  problem?: string;
  solution?: string;
  metrics?: {
    label: string;
    value: string;
  }[];
  links?: {
    demo?: string;
    live?: string;
    repo?: string;
    marketplace?: string;
    caseStudy?: string;
  };
  media: {
    thumbnail: string; // Path relative to public (e.g., "/projects/my-project/thumb.jpg")
    gallery?: string[];
  };
  interaction?: "glitch" | "tilt" | "spotlight";
  layout?: "tall" | "wide" | "featured";
}
