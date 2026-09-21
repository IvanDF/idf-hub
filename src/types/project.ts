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

/**
 * Detail-page template. Mirrors the Lab filter groups so a project always
 * reads the same way in the list and on its own page.
 */
export type ProjectTemplate = "code" | "design" | "craft" | "lab";

const TEMPLATE_BY_CATEGORY: Record<ProjectCategory, ProjectTemplate> = {
  DEV: "code",
  VSCODE: "code",
  CREATIVE: "design",
  MAKER: "craft",
  APPLE: "craft",
  EXPERIMENT: "lab",
  CODEPEN: "lab",
};

/**
 * Resolves which detail template a project renders with.
 * @param project - The project to classify.
 */
export function templateFor(project: Project): ProjectTemplate {
  return project.template ?? TEMPLATE_BY_CATEGORY[project.category];
}

/** A technical decision, why it was taken, and what it cost. */
export interface ProjectDecision {
  /** The call that was made, e.g. "No filter library". */
  choice: string;
  /** The reasoning behind it. */
  why: string;
  /** What the choice gave up — omitted when it genuinely cost nothing. */
  tradeoff?: string;
}

/**
 * One source artefact in a composed piece: a photographic plate, a print
 * separation, a variant that did not ship.
 */
export interface ProjectPlate {
  src: string;
  /** Role of this artefact in the final piece, e.g. "Background plate". */
  label: string;
  note?: string;
}

/** Product shell the design work was produced for. */
export type MockupKind = "tee" | "phone-case";

/**
 * Finished product mockups, supplied as images. Nothing is drawn in code —
 * these are the designer's own renders or photographs of the printed piece.
 */
export interface ProjectMockup {
  /** Drives the frame's aspect ratio only. */
  kind: MockupKind;
  frames: { src: string; label: string }[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: ProjectCategory;
  /** Overrides the category-derived detail template. Rarely needed. */
  template?: ProjectTemplate;
  platform?: ProjectPlatform;
  tags: string[];
  /** Display year. Must agree with the year in `date` when both are set. */
  year: string;
  /**
   * Month the work actually started, as `YYYY-MM`. Sourced from repository
   * creation dates and image EXIF rather than memory — the year alone was
   * drifting from reality.
   */
  date?: string;
  duration?: string;
  role?: string;
  status?: "live" | "in-progress" | "archived" | "concept";
  stack?: string[];
  highlights?: string[];
  why?: string;
  problem?: string;
  solution?: string;
  /** Code template: the decision log. */
  decisions?: ProjectDecision[];
  /** Design template: artwork shown on a product shell. */
  mockup?: ProjectMockup;
  /** Craft template: the pieces the final image was built from. */
  plates?: ProjectPlate[];
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
