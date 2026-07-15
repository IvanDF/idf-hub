"use client";

import AudioToggle from "@/components/atoms/audio-toggle";
import Button from "@/components/atoms/button";
import GlitchText from "@/components/atoms/glitch-text";
import SecretName from "@/components/atoms/secret-name";
import Text from "@/components/atoms/text";
import styles from "./layout.module.scss";

interface IdentityProps {
  onCommand?: () => void;
  /** Hide the ⌘K shortcut hint where there is no keyboard (mobile overlay). */
  showShortcut?: boolean;
}

/** Opens the terminal by synthesizing the global ⌘K shortcut. */
export const openCommandPalette = () =>
  window.dispatchEvent(
    new KeyboardEvent("keydown", { key: "k", metaKey: true }),
  );

/**
 * Identity block — audio toggle, name, and the command-palette launcher.
 * Shared by the desktop left rail and the mobile overlay.
 */
export default function Identity({
  onCommand,
  showShortcut = true,
}: IdentityProps) {
  return (
    <footer className={styles.footer}>
      <AudioToggle className={styles.footerAction} />

      <div className={styles.name}>
        <SecretName>
          <GlitchText text="IVAN DEL FATTI" />
        </SecretName>
      </div>

      <Button
        variant="ghost"
        stamp={false}
        className={`${styles.footerAction} ${styles.terminalCta}`}
        onClick={() => {
          onCommand?.();
          openCommandPalette();
        }}
        aria-label="Open command palette"
      >
        <GlitchText text="<_" className={styles.prompt} />
        {showShortcut && (
          <Text as="span" variant="label" className={styles.cmdKey}>
            ⌘K
          </Text>
        )}
        <Text as="span" variant="label" className={styles.cmdLabel}>
          {showShortcut ? "to explore" : "terminal"}
        </Text>
      </Button>
    </footer>
  );
}
