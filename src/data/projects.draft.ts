import type { Project } from "@/types/project";

/**
 * Written up, not published.
 *
 * This file is imported by nothing. That is the point: the repository is
 * public and `PROJECTS` ships to the browser, so filtering an entry out of a
 * listing at runtime still leaves its text readable in the page source. Work
 * that belongs to an employer and has not been cleared needs to be absent from
 * the bundle, not merely hidden from the UI.
 *
 * To publish one: move the entry into projects.ts and re-export its images
 * from Figma into public/projects/.
 */
export const DRAFT_PROJECTS: Project[] = [
  {
    id: "sula-platform",
    featured: 2,
    title: "Sula — Platform & Design System",
    description:
      "A financial platform rebuilt on a design system written from scratch, and twenty-plus repositories folded into one monorepo.",
    longDescription:
      "Sula Inversiones ran on a platform assembled from separate repositories, each with its own libraries and its own idea of what a button was. The work was to give it one vocabulary — a design system with no external UI framework underneath it, a brand manual the system answers to, and a single monorepo the pieces live in.",
    category: "DESIGN",
    // The decision log is what carries this one, so it takes the code template
    // even though the category is Design — the field exists for exactly this.
    template: "code",
    platform: "web",
    tags: ["Design System", "Monorepo", "Web Components", "Brand"],
    year: "2026",
    date: "2026-01",
    duration: "Ongoing",
    role: "IT Manager — frontend & product lead",
    status: "live",
    stack: ["Design System", "Web Components", "Monorepo", "Figma"],
    highlights: [
      "A custom design system built from scratch, with no external UI framework underneath it",
      "20+ repositories, libraries and Web Components migrated into one monorepo",
      "A brand manual the design system answers to, rather than the other way round",
      "An onboarding guide written into the Figma file, so the system explains itself to whoever opens it next",
    ],
    // ⚠️ DRAFT — the choices are from Ivan, the reasoning is reconstructed and
    // needs his words before this ships anywhere public.
    decisions: [
      {
        choice: "No external UI framework under the design system",
        why: "A bought component library decides your spacing, your focus states and your upgrade schedule for you. On a platform meant to carry a brand, those are the decisions worth owning.",
        tradeoff:
          "Everything has to be built and maintained in-house, and the first months are slower than installing a library would have been.",
      },
      {
        choice: "Web Components rather than a framework's components",
        why: "The platform is not one application. Components that work without a framework runtime can be used by whatever the next part of it is written in.",
        tradeoff:
          "Fewer people know the API, and the tooling around it is thinner than React's.",
      },
      {
        choice: "Twenty-plus repositories folded into one monorepo",
        why: "A change to a shared component used to mean a release in one repository and a version bump in several others. One tree makes the change and its consequences land together.",
        tradeoff:
          "The migration touched every repository at once, and CI had to be rebuilt before anything could ship.",
      },
      {
        choice: "A brand manual before the components",
        why: "A design system without a brand behind it standardises whatever it happened to start with. Writing the brand first — word mark, palette, clear space, tone of voice — gave the components something to answer to.",
      },
    ],
    why: "Draft — needs Ivan's words. The facts are his; this sentence is not yet.",
    media: {
      // The real assets are out of the tree while this is a draft: the
      // repository is public, so anything under public/ is published whether a
      // page links to it or not. Re-exported from Figma when it ships.
      thumbnail: "/assets/placeholder.svg",
      fit: "contain",
    },
  },
];
