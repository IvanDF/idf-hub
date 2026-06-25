import Button from "@/components/atoms/button";
import Text from "@/components/atoms/text";
import ParticleLogo from "@/components/molecules/particle-logo";
import styles from "./page.module.scss";

/**
 * Renders the homepage hero and interactive particle logo.
 */
export default function Home() {
  return (
    <div className={styles.shell}>
      <ParticleLogo />

      {/* Screen reader heading — always present for SEO/a11y */}
      <h1 className="sr-only">IVAN DEL FATTI — Driven by curiosity, refined through design</h1>

      {/* Hero — tagline + CTAs */}
      <div className={styles.hero}>
        <Text as="span" variant="label" className={styles.heroName}>
          IVAN DEL FATTI
        </Text>
        <p className={styles.heroTagline}>
          Driven by curiosity, &amp; refined through design.
          <br />
        </p>
        <div className={styles.heroCtas}>
          <Button href="/lab" variant="primary">
            View Work →
          </Button>
          <Button
            href="https://www.linkedin.com/in/ivandf/"
            external
            target="_blank"
            rel="noreferrer"
            variant="secondary"
          >
            Get in Touch
          </Button>
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
