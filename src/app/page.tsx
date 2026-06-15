import ParticleLogo from "@/components/molecules/particle-logo";
import Link from "next/link";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <ParticleLogo />

      {/* Hero — tagline + CTAs */}
      <div className={styles.hero}>
        <p className={styles.heroName}>IVAN DEL FATTI</p>
        <p className={styles.heroTagline}>
          Full-stack developer &amp; digital designer.<br />
          Crafting interactive web experiences with precision and personality.
        </p>
        <div className={styles.heroCtas}>
          <Link href="/lab" className={styles.ctaPrimary}>
            View Work →
          </Link>
          <a
            href="https://www.linkedin.com/in/ivandf/"
            target="_blank"
            rel="noreferrer"
            className={styles.ctaSecondary}
          >
            Get in Touch
          </a>
        </div>
      </div>

      {/* Keyboard shortcuts — desktop only */}
      <div className={styles.shortcutsHint}>
        <span className={styles.shortcut}>
          <kbd>CMD</kbd>+<kbd>K</kbd> explore
        </span>
        <span className={styles.shortcut}>
          <kbd>D</kbd> theme
        </span>
        <span className={styles.shortcut}>
          <kbd>?</kbd> help
        </span>
      </div>
    </div>
  );
}
