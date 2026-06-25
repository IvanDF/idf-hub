import Text from "@/components/atoms/text";
import { PanelConfig } from "./ProjectDetail.data";
import styles from "./ProjectDetail.module.scss";

interface ProjectDetailPanelProps {
  panel: PanelConfig;
}

/**
 * Renders the platform/category context panel for a project detail page.
 * @param panel - The resolved panel configuration to display.
 */
export function ProjectDetailPanel({ panel }: ProjectDetailPanelProps) {
  return (
    <section className={`${styles.platformPanel} ${styles[panel.tone]}`}>
      <header>
        <Text as="span" variant="body" className={styles.panelIcon}>{panel.icon}</Text>
        <Text as="span" variant="label" className={styles.panelBadge}>{panel.badge}</Text>
        <Text as="h3" variant="h3">{panel.title}</Text>
      </header>
      <ul>
        {panel.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </section>
  );
}
