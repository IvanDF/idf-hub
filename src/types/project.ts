export type ProjectCategory =
  | "DEV"
  | "VSCODE"
  | "CREATIVE"
  | "MAKER"
  | "APPLE"
  | "CODEPEN"
  | "EXPERIMENT";

export type ProjectPlatform =
  | "github"
  | "figma"
  | "notion"
  | "codepen"
  | "apple-shortcuts"
  | "vscode-marketplace"
  | "web";

export interface Project {
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
  why?: string;
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
    figma?: string;
  };
  media: {
    thumbnail: string; // Path relative to public (e.g., "/projects/my-project/thumb.jpg")
    gallery?: string[];
    fit?: "cover" | "contain";
  };
  interaction?: "glitch" | "tilt" | "spotlight";
  layout?: "tall" | "wide" | "featured";
}
