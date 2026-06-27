"use client";

import AudioToggle from "@/components/atoms/audio-toggle";
import Button from "@/components/atoms/button";
import GlitchText from "@/components/atoms/glitch-text";
import Text from "@/components/atoms/text";
import styles from "./layout.module.scss";

interface IdentityProps {
  onCommand?: () => void;
}

const openCommandPalette = () =>
  window.dispatchEvent(
    new KeyboardEvent("keydown", { key: "k", metaKey: true }),
  );

/**
 * Identity block — audio toggle, name, and the command-palette launcher.
 * Shared by the desktop left rail and the mobile overlay.
 */
export default function Identity({ onCommand }: IdentityProps) {
  return (
    <footer className={styles.footer}>
      <AudioToggle />

      <div className={styles.name}>
        <GlitchText text="IVAN DEL FATTI" />
      </div>

      <Button
        variant="ghost"
        stamp={false}
        onClick={() => {
          onCommand?.();
          openCommandPalette();
        }}
        aria-label="Open command palette"
      >
        <GlitchText text="<_" className={styles.prompt} />
        <Text as="span" variant="label" className={styles.cmdKey}>
          ⌘K
        </Text>
        <Text as="span" variant="label" className={styles.cmdLabel}>
          to explore
        </Text>
      </Button>
    </footer>
  );
}
