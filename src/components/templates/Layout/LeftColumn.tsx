"use client";

import AudioToggle from "@/components/atoms/audio-toggle";
import GlitchText from "@/components/atoms/glitch-text";
import Magnetic from "@/components/atoms/Magnetic";
import MagneticStyles from "@/components/atoms/Magnetic/Magnetic.module.scss";
import RotatingTitle from "@/components/atoms/rotating-title";
import { useIsLabRoute } from "@/hooks/useIsLabRoute";
import styles from "./layout.module.scss";

export default function LeftColumn() {
  const isLab = useIsLabRoute();

  return (
    <aside className={`${styles.leftColumn} ${isLab ? styles.autoHide : ""}`}>
      {/* Command Palette Trigger */}
      <nav className={styles.navbar}>
        <Magnetic>
          <button
            className={styles.terminalLink}
            onClick={() => {
              const event = new KeyboardEvent("keydown", {
                key: "k",
                metaKey: true,
              });
              window.dispatchEvent(event);
            }}
          >
            <span className={styles.prompt}>&lt;_</span>
            <span className={styles.label}>cmd</span>
          </button>
        </Magnetic>
      </nav>

      {/* 2. Divider */}
      <div className={styles.divider}></div>

      {/* 3. Footer: Name + Role + Audio */}
      <footer className={styles.footer}>
        <AudioToggle />

        <div className={styles.name}>
          <GlitchText text="IVAN DEL FATTI" />
        </div>

        <RotatingTitle className={styles.role} />
      </footer>
    </aside>
  );
}
