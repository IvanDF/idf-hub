import ParticleLogo from "@/components/molecules/ParticleLogo";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <ParticleLogo />

      {/* CMD+K Hint */}
      <div className={styles.cmdKHint}>
        <p>
          Press <span>CMD + K</span> to explore
        </p>
      </div>

      {/* Shortcuts Hint - Bottom Right */}
      <div className={styles.shortcutsHint}>
        <span className={styles.shortcut}>
          <kbd>CMD</kbd>+<kbd>K</kbd> Commander
        </span>
        <span className={styles.shortcut}>
          <kbd>D</kbd> Theme
        </span>
        <span className={styles.shortcut}>
          <kbd>?</kbd> Help
        </span>
      </div>
    </div>
  );
}
