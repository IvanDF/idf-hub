import type { Project } from "@/types/project";
import { ExternalLink } from "lucide-react";
import styles from "./ProjectDetail.module.scss";

interface ProjectFooterProps {
  project: Project;
}

const PLATFORM_LABELS: Record<string, string> = {
  codepen: "Open Playground",
  notion: "Open Workspace",
  "apple-shortcuts": "Get Shortcut",
  github: "View on GitHub",
  figma: "Open in Figma",
  "vscode-marketplace": "Get Extension",
};

/**
 * Shared detail-page footer: the stack the work was made with, and every way
 * to go see it for yourself.
 *
 * @param project - The project being displayed.
 */
export default function ProjectFooter({ project }: ProjectFooterProps) {
  const stack =
    project.stack && project.stack.length > 0 ? project.stack : project.tags;

  const primaryUrl = project.links?.demo ?? project.links?.live;
  const primaryLabel =
    PLATFORM_LABELS[project.platform ?? ""] ??
    (project.links?.demo ? "Launch Experiment" : "Visit Live Site");

  const extraLinks = [
    project.links?.repo && { href: project.links.repo, label: "Source code" },
    project.links?.figma &&
      project.links.figma !== primaryUrl && {
        href: project.links.figma,
        label: "Figma file",
      },
    project.links?.marketplace && {
      href: project.links.marketplace,
      label: "Marketplace",
    },
    project.links?.caseStudy && {
      href: project.links.caseStudy,
      label: "Case study",
    },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <footer className={styles.footer}>
      {/* Plain spans: .stackTag sets its own type, and Text's base class
          resets padding at equal specificity, flattening the chip. */}
      <div className={styles.stack}>
        {stack.map((t) => (
          <span key={t} className={styles.stackTag}>
            {t}
          </span>
        ))}
      </div>

      <div className={styles.links}>
        {primaryUrl && (
          <a
            href={primaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.primaryLink}
          >
            {primaryLabel}
            <ExternalLink size={13} />
          </a>
        )}
        {extraLinks.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondaryLink}
          >
            {label}
            <ExternalLink size={12} />
          </a>
        ))}
      </div>
    </footer>
  );
}
