import ParticleLogo from "@/components/molecules/ParticleLogo";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ParticleLogo />
      
      {/* CMD+K Hint */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        opacity: 0.9,
        pointerEvents: 'none',
        zIndex: 100,
        backgroundColor: 'var(--color-bg)',
        padding: '8px 16px',
        borderRadius: '20px',
        border: '1px solid var(--color-divider)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <p style={{
          fontFamily: 'var(--font-josefin-sans)',
          fontSize: '0.8rem',
          color: 'var(--color-text)',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          fontWeight: 600,
          margin: 0
        }}>
          Press <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>CMD + K</span> to explore
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
