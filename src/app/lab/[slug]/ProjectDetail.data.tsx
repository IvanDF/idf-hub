import { BookOpen, WandSparkles, Workflow } from "lucide-react";
import { ReactNode } from "react";

/** Shape of a platform/category panel configuration. */
export interface PanelConfig {
  tone:
    | "githubPanel"
    | "notionPanel"
    | "codepenPanel"
    | "applePanel"
    | "figmaPanel";
  badge: string;
  title: string;
  icon: ReactNode;
  bullets: string[];
}

/** Per-project panel overrides keyed by project ID. */
export const panelByProjectId: Record<string, PanelConfig> = {
  "gabberg-icard": {
    tone: "githubPanel",
    badge: "product",
    title: "Build Direction",
    icon: <WandSparkles size={16} />,
    bullets: [
      "Event-ready digital identity with persona-based profile variants",
      "Fast contact actions tuned for in-person, high-traffic contexts",
      "Visual language and front-end implementation designed as one system",
    ],
  },
  filteroo: {
    tone: "githubPanel",
    badge: "ux",
    title: "Design + Execution",
    icon: <WandSparkles size={16} />,
    bullets: [
      "From Figma concepts to functioning React interface",
      "Real-time visual feedback designed for fast user experimentation",
      "Component-first structure to keep iteration cost low",
    ],
  },
  "notion-payment-tracker-2": {
    tone: "notionPanel",
    badge: "wiki",
    title: "System Thinking",
    icon: <BookOpen size={16} />,
    bullets: [
      "Recurring and previsional views kept in sync from one source of truth",
      "Summary and history sections designed for quick decision-making",
      "Connected with iOS shortcuts for faster data capture",
    ],
  },
  "notion-bookshelf-2": {
    tone: "notionPanel",
    badge: "wiki",
    title: "Knowledge OS",
    icon: <BookOpen size={16} />,
    bullets: [
      "Multi-database structure for books, genres, and authors",
      "Reading analytics integrated into a single dashboard",
      "Optimized for continuity and long-term personal tracking",
    ],
  },
  "codepen-nintendo-switch-oled": {
    tone: "codepenPanel",
    badge: "playground",
    title: "Visual Craft",
    icon: <WandSparkles size={16} />,
    bullets: [
      "Pixel-like recreation work executed with pure CSS",
      "High attention to visual depth and hardware-inspired details",
      "Built as a fast experiment in visual storytelling",
    ],
  },
  "shortcut-spotify-to-apple-music": {
    tone: "applePanel",
    badge: "automation",
    title: "Mobile Workflow",
    icon: <Workflow size={16} />,
    bullets: [
      "Designed for repetitive everyday behavior with one-tap access",
      "Cuts friction between two music ecosystems",
      "Useful micro-automation with immediate personal utility",
    ],
  },
  "figma-icon-builder": {
    tone: "figmaPanel",
    badge: "plugin",
    title: "Design Tooling",
    icon: <WandSparkles size={16} />,
    bullets: [
      "Bridge between design assets and production-ready React output",
      "Plugin UX focused on speed and predictable export structure",
      "Clear value proposition for design systems and product teams",
    ],
  },
};

/** Category-level panel fallbacks keyed by project category. */
export const categoryPanelByCategory: Record<string, PanelConfig> = {
  DEV: {
    tone: "githubPanel",
    badge: "code",
    title: "Engineering Lens",
    icon: <WandSparkles size={16} />,
    bullets: [
      "Focus on shipping clear features with pragmatic technical choices",
      "UI quality, implementation discipline, and maintainability are balanced together",
      "Built as production-minded experiments, not isolated code snippets",
    ],
  },
  VSCODE: {
    tone: "githubPanel",
    badge: "tooling",
    title: "Developer Experience",
    icon: <WandSparkles size={16} />,
    bullets: [
      "Built around daily workflows to reduce context switching",
      "Strong attention to clarity, low-noise interfaces, and discoverable commands",
      "Designed to be useful over long sessions, not one-off demos",
    ],
  },
  CODEPEN: {
    tone: "codepenPanel",
    badge: "design",
    title: "Visual Craft",
    icon: <WandSparkles size={16} />,
    bullets: [
      "Fast visual explorations to test composition, motion, and detail",
      "Short cycles from concept to browser output",
      "Reusable ideas for richer production UI surfaces",
    ],
  },
  APPLE: {
    tone: "applePanel",
    badge: "automation",
    title: "Flow Design",
    icon: <Workflow size={16} />,
    bullets: [
      "Automates repetitive actions into reliable one-tap flows",
      "Optimized for speed, consistency, and low cognitive load",
      "Small systems designed for everyday practical impact",
    ],
  },
  CREATIVE: {
    tone: "figmaPanel",
    badge: "creative tech",
    title: "Creative Direction",
    icon: <WandSparkles size={16} />,
    bullets: [
      "Design-led experiments with intentional visual identity",
      "Interaction and storytelling explored as part of the build",
      "Craft quality prioritized alongside technical feasibility",
    ],
  },
  MAKER: {
    tone: "figmaPanel",
    badge: "maker",
    title: "Build Experiment",
    icon: <WandSparkles size={16} />,
    bullets: [
      "Prototype mindset with measurable iterations",
      "Hands-on exploration to validate ideas quickly",
      "Emphasis on learning loops and practical outcomes",
    ],
  },
  EXPERIMENT: {
    tone: "figmaPanel",
    badge: "r&d",
    title: "Research Track",
    icon: <WandSparkles size={16} />,
    bullets: [
      "Focused on testing interaction or technical hypotheses",
      "Short iterations with clear observations from each build",
      "Outcomes feed back into future product and design decisions",
    ],
  },
};

/** Platform-level panel fallbacks keyed by project platform. */
export const fallbackPanelByPlatform: Record<string, PanelConfig> = {
  notion: {
    tone: "notionPanel",
    badge: "wiki",
    title: "Workspace Design",
    icon: <BookOpen size={16} />,
    bullets: [
      "Structured information architecture with linked databases",
      "Reusable templates for daily workflow consistency",
      "Decision-ready summaries for quick context switching",
    ],
  },
  codepen: {
    tone: "codepenPanel",
    badge: "playground",
    title: "Rapid Prototype",
    icon: <WandSparkles size={16} />,
    bullets: [
      "Fast, focused experiments around UI and interaction",
      "Built to validate visual direction quickly",
      "Reusable concepts for production interfaces",
    ],
  },
  "apple-shortcuts": {
    tone: "applePanel",
    badge: "automation",
    title: "Shortcut Logic",
    icon: <Workflow size={16} />,
    bullets: [
      "Automates repetitive mobile actions with minimal friction",
      "Designed for speed and day-to-day reliability",
      "Turns manual routines into one-tap flows",
    ],
  },
  figma: {
    tone: "figmaPanel",
    badge: "plugin",
    title: "Design Utility",
    icon: <WandSparkles size={16} />,
    bullets: [
      "Improves design-to-development handoff",
      "Supports system consistency and speed",
      "Built for real workflow adoption",
    ],
  },
};
