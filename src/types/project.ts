/**
 * What kind of work this is — and only that.
 *
 * The previous seven values collapsed three different axes into one list:
 * discipline (DEV, CREATIVE), intent (MAKER, EXPERIMENT) and platform
 * (VSCODE, APPLE, CODEPEN). The platform is already its own field, so three
 * of the seven restated data the record carried anyway, and a Figma plugin
 * ended up filed under Design because of where it runs rather than what it is.
 */
export type ProjectCategory = "CODE" | "DESIGN" | "CRAFT";

/**
 * Subcategory. Craft is the broad bucket, so it is the one that subdivides;
 * the field is free-standing rather than Craft-only so Code or Design can
 * adopt subcategories later without a type migration.
 */
export type ProjectKind = "photo" | "template" | "shortcut" | "experiment";

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

/**
 * Which template a Craft project renders with. Photography is a composed
 * image, so it reads like design work — DesignCase already shows the finals
 * and then the plates they were built from. Experiments want the live embed
 * and a short write-up; templates and shortcuts want "what it does".
 */
const TEMPLATE_BY_KIND: Record<ProjectKind, ProjectTemplate> = {
  photo: "design",
  template: "craft",
  shortcut: "craft",
  experiment: "lab",
};

/**
 * Resolves which detail template a project renders with.
 *
 * Craft covers several kinds of work, so it defers to `kind`; Code and Design
 * each mean one thing. A Craft project with no kind falls back to the plain
 * craft template rather than throwing — the data test catches the omission.
 *
 * @param project - The project to classify.
 */
export function templateFor(project: Project): ProjectTemplate {
  if (project.template) return project.template;
  if (project.category === "CODE") return "code";
  if (project.category === "DESIGN") return "design";
  return project.kind ? TEMPLATE_BY_KIND[project.kind] : "craft";
}

/** Chip text per kind, for the Craft projects. */
const LABEL_BY_KIND: Record<ProjectKind, string> = {
  photo: "Photo",
  template: "Template",
  shortcut: "Shortcut",
  experiment: "Experiment",
};

/**
 * The words shown on the project's chip, in the list and on its own page.
 *
 * Deliberately not derived from the template: a photo project renders with
 * the design template, and labelling it "Design" would describe the layout
 * rather than the work.
 *
 * @param project - The project to label.
 */
export function labelFor(project: Project): string {
  if (project.category === "CODE") return "Code";
  if (project.category === "DESIGN") return "Design";
  return project.kind ? LABEL_BY_KIND[project.kind] : "Craft";
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
  /** Subcategory. Required in practice for Craft; see the data test. */
  kind?: ProjectKind;
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
