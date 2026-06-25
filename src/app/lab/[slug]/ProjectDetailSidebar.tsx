import Text from "@/components/atoms/text";
import { ExternalLink, Github, Play } from "lucide-react";
import Link from "next/link";
import styles from "./ProjectDetail.module.scss";

interface ProjectDetailSidebarProps {
  detailStack: string[];
  primaryUrl: string | undefined;
  primaryLabel: string;
  repoUrl: string | undefined;
  figmaUrl: string | undefined;
  liveUrl: string | undefined;
  marketplaceUrl: string | undefined;
  caseStudyUrl: string | undefined;
  hasDistinctFigmaLink: boolean;
  hasDistinctLiveLink: boolean;
}

/**
 * Sidebar for the project detail page showing stack, links, and CTA buttons.
 */
export function ProjectDetailSidebar({
  detailStack,
  primaryUrl,
  primaryLabel,
  repoUrl,
  figmaUrl,
  liveUrl,
  marketplaceUrl,
  caseStudyUrl,
  hasDistinctFigmaLink,
  hasDistinctLiveLink,
}: ProjectDetailSidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <Text as="h3" variant="h3">Project Links</Text>

      <div className={styles.stackSection}>
        <Text as="h4" variant="h4">Stack</Text>
        <div className={styles.stackTags}>
          {detailStack.map((item) => (
            <Text as="span" key={item} variant="label">{item}</Text>
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

      {repoUrl && (
        <a
          href={repoUrl}
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
          href={figmaUrl}
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
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.actionButton} ${styles.secondary}`}
        >
          <ExternalLink size={18} />
          Visit Live Site
        </a>
      )}

      {marketplaceUrl && (
        <a
          href={marketplaceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.actionButton} ${styles.secondary}`}
        >
          <ExternalLink size={18} />
          Open Marketplace
        </a>
      )}

      {caseStudyUrl && (
        <Link
          href={caseStudyUrl}
          className={`${styles.actionButton} ${styles.secondary}`}
        >
          <Play size={18} />
          Open Case Study
        </Link>
      )}
    </aside>
  );
}
