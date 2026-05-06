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
        <span className={styles.panelIcon}>{panel.icon}</span>
        <span className={styles.panelBadge}>{panel.badge}</span>
        <h3>{panel.title}</h3>
      </header>
      <ul>
        {panel.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </section>
  );
}
