import { PROJECTS } from "@/data/projects";
import {
  ArrowLeft,
  BookOpen,
  ExternalLink,
  Github,
  Goal,
  Play,
  Sparkles,
  WandSparkles,
  Workflow,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import styles from "./ProjectDetail.module.scss";

// In Next.js 15, params is a Promise. We need to await it.
// However, since we are using static params, we can just access it.
// But to be safe and compatible with newer Next.js versions:

export function generateStaticParams() {
  return PROJECTS.map((project) => ({
    slug: project.id,
  }));
}

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ filter?: string }>;
}) {
  // Decode the slug just in case
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const decodedSlug = decodeURIComponent(slug);
  const project = PROJECTS.find((p) => p.id === decodedSlug);

  if (!project) {
    notFound();
  }

  const detailHighlights =
    project.highlights && project.highlights.length > 0
      ? project.highlights
      : [
          "Crafted as part of an iterative portfolio R&D process",
          "Built with focus on visual identity and interaction quality",
          "Continuously refined based on usability feedback",
        ];

  const detailStack =
    project.stack && project.stack.length > 0 ? project.stack : project.tags;
  const platform = project.platform || "web";

  const galleryImages = project.media?.gallery || [];
  const primaryUrl = project.links?.demo || project.links?.live;
  const mediaFit = project.media.fit || "contain";
  const hasThumbnail =
    Boolean(project.media.thumbnail) &&
    project.media.thumbnail !== "/assets/placeholder.svg";
  const backHref = resolvedSearchParams.filter
    ? `/lab?filter=${encodeURIComponent(resolvedSearchParams.filter)}`
    : "/lab";
  const hasDistinctLiveLink = Boolean(
    project.links?.live && project.links.live !== primaryUrl,
  );
  const hasDistinctFigmaLink = Boolean(
    project.links?.figma &&
    project.links.figma !== primaryUrl &&
    project.links.figma !== project.links?.live,
  );

  const primaryLabelByPlatform: Record<string, string> = {
    codepen: "Open Playground",
    notion: "Open Workspace",
    "apple-shortcuts": "Get Shortcut",
    github: "Launch Project",
    figma: "Open Figma Plugin",
    "vscode-marketplace": "Open Extension",
  };

  const primaryLabel =
    primaryLabelByPlatform[platform] ||
    (project.links?.demo ? "Launch Experiment" : "Visit Live Site");

  const panelByProjectId: Record<
    string,
    {
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
  > = {
    "gabberg-icard": {
      tone: "githubPanel",
      badge: "product",
      title: "Recruiter Snapshot",
      icon: <Goal size={16} />,
      bullets: [
        "Digital identity concept shipped to production with custom persona variations",
        "Focus on conversion flow: quick access to contacts and social channels",
        "Strong brand direction translated into a responsive front-end implementation",
      ],
    },
    filteroo: {
      tone: "githubPanel",
      badge: "ux",
      title: "Design + Execution",
      icon: <Sparkles size={16} />,
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

  const fallbackPanelByPlatform: Record<
    string,
    {
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
  > = {
    github: {
      tone: "githubPanel",
      badge: "impact",
      title: "Project Value",
      icon: <Goal size={16} />,
      bullets: [
        "Portfolio project focused on translating ideas into shippable experiences",
        "Emphasis on clarity, ownership, and end-to-end execution",
        "Demonstrates product and implementation balance",
      ],
    },
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

  const selectedPanel =
    panelByProjectId[project.id] || fallbackPanelByPlatform[platform];

  const platformPanel = selectedPanel ? (
    <section
      className={`${styles.platformPanel} ${styles[selectedPanel.tone]}`}
    >
      <header>
        <span className={styles.panelIcon}>{selectedPanel.icon}</span>
        <span className={styles.panelBadge}>{selectedPanel.badge}</span>
        <h3>{selectedPanel.title}</h3>
      </header>
      <ul>
        {selectedPanel.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </section>
  ) : null;

  return (
    <main className={`${styles.container} ${styles[platform]}`}>
      <Link href={backHref} className={styles.backLink}>
        <ArrowLeft size={16} />
        Return to Lab
      </Link>

      <header className={styles.header}>
        <div className={styles.meta}>
          <span className={styles.category}>{project.category}</span>
          <span className={styles.platform}>{platform.replace(/-/g, " ")}</span>
          <span>{"//"}</span>
          <span>{project.year}</span>
          {project.status && (
            <span
              className={`${styles.status} ${project.status === "live" ? styles.statusLive : ""}`}
            >
              {project.status}
            </span>
          )}
        </div>
        <h1>{project.title}</h1>

        <p className={styles.lead}>
          {project.longDescription || project.description}
        </p>

        <div className={styles.tags}>
          {project.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className={styles.mainContent}>
        <div className={styles.leftColumn}>
          <div className={styles.description}>
            <p>{project.description}</p>
          </div>

          <div className={styles.detailGrid}>
            {project.problem && (
              <section className={styles.infoBlock}>
                <h3>Problem</h3>
                <p>{project.problem}</p>
              </section>
            )}

            {project.solution && (
              <section className={styles.infoBlock}>
                <h3>Approach</h3>
                <p>{project.solution}</p>
              </section>
            )}

            {project.role && (
              <section className={styles.infoBlock}>
                <h3>Role</h3>
                <p>{project.role}</p>
              </section>
            )}

            {project.duration && (
              <section className={styles.infoBlock}>
                <h3>Duration</h3>
                <p>{project.duration}</p>
              </section>
            )}
          </div>

          <section className={styles.highlights}>
            <h3>Highlights</h3>
            <ul>
              {detailHighlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </section>

          {platformPanel}

          {project.metrics && project.metrics.length > 0 && (
            <section className={styles.metrics}>
              <h3>Key Metrics</h3>
              <div className={styles.metricGrid}>
                {project.metrics.map((metric) => (
                  <div
                    key={`${metric.label}-${metric.value}`}
                    className={styles.metricItem}
                  >
                    <span>{metric.label}</span>
                    <strong>{metric.value}</strong>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className={styles.mediaSection}>
            <div className={styles.mediaContainer}>
              {hasThumbnail ? (
                <Image
                  src={project.media.thumbnail}
                  alt={project.title}
                  fill
                  className={styles.image}
                  style={{ objectFit: mediaFit }}
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority
                />
              ) : (
                <div className={`${styles.generatedCover} ${styles[platform]}`}>
                  <span className={styles.coverPlatform}>
                    {platform.replace(/-/g, " ")}
                  </span>
                  <strong>{project.title}</strong>
                  <p>{project.longDescription || project.description}</p>
                </div>
              )}
            </div>

            {galleryImages.length > 0 && (
              <div className={styles.galleryGrid}>
                {galleryImages.map((imageSrc) => (
                  <div key={imageSrc} className={styles.galleryItem}>
                    <Image
                      src={imageSrc}
                      alt={`${project.title} screenshot`}
                      fill
                      className={styles.image}
                      style={{ objectFit: mediaFit }}
                      sizes="(max-width: 768px) 50vw, 250px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className={styles.sidebar}>
          <h3>Project Links</h3>

          <div className={styles.stackSection}>
            <h4>Stack</h4>
            <div className={styles.stackTags}>
              {detailStack.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          {primaryUrl && (
            <a
              href={primaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.actionButton} ${styles.primary}`}
            >
              <Play size={18} />
              {primaryLabel}
            </a>
          )}

          {/* View Source */}
          {project.links?.repo && (
            <a
              href={project.links.repo}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.actionButton} ${styles.secondary}`}
            >
              <Github size={18} />
              View Source
            </a>
          )}

          {hasDistinctFigmaLink && (
            <a
              href={project.links?.figma}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.actionButton} ${styles.secondary}`}
            >
              <ExternalLink size={18} />
              Open Figma File
            </a>
          )}

          {hasDistinctLiveLink && (
            <a
              href={project.links?.live}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.actionButton} ${styles.secondary}`}
            >
              <ExternalLink size={18} />
              Visit Live Site
            </a>
          )}

          {project.links?.marketplace && (
            <a
              href={project.links.marketplace}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.actionButton} ${styles.secondary}`}
            >
              <ExternalLink size={18} />
              Open Marketplace
            </a>
          )}

          {project.links?.caseStudy && (
            <Link
              href={project.links.caseStudy}
              className={`${styles.actionButton} ${styles.secondary}`}
            >
              <Play size={18} />
              Open Case Study
            </Link>
          )}
        </aside>
      </div>
    </main>
  );
}
