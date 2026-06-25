"use client";

import Text from "@/components/atoms/text";
import { useVoiceShoutContext } from "@/context/VoiceShoutContext";
import { useEffect, useRef } from "react";
import styles from "./FusRoDah.module.scss";

const SHOUT_LABELS: Record<number, string> = { 1: "FUS", 2: "FUS RO", 3: "FUS RO DAH" };
const SHOUT_RESET_MS = 2600;

/**
 * Visual-effects-only overlay for the Skyrim "Fus Ro Dah" easter egg.
 * Listening state and transcript are shown inline inside the Terminal component.
 *
 * - Level 1 (Fus):         shockwave ring
 * - Level 2 (Fus Ro):      double shockwave ring
 * - Level 3 (Fus Ro Dah):  shockwave + wind streaks + runic text + haptic + content scatter
 */
export default function FusRoDah() {
  const { shoutLevel, sessionId } = useVoiceShoutContext();
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!shoutLevel) return;

    if ("vibrate" in navigator) {
      if (shoutLevel === 3) navigator.vibrate([60, 40, 100, 40, 250]);
      else if (shoutLevel === 2) navigator.vibrate([60, 40, 120]);
      else navigator.vibrate(50);
    }

    // Set data-fus-level on <html> for CSS shake + scatter effects
    document.documentElement.dataset.fusLevel = String(shoutLevel);

    resetTimerRef.current = setTimeout(() => {
      delete document.documentElement.dataset.fusLevel;
    }, SHOUT_RESET_MS + 200);

    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, [shoutLevel]);

  if (!shoutLevel) return null;

  return (
    <div className={styles.overlay} aria-hidden="true">
      <div className={styles.shout} key={`shout-${sessionId}`}>
        <div className={styles.shockwave} />
        {shoutLevel >= 2 && <div className={styles.shockwave2} />}
        {shoutLevel >= 3 && <div className={styles.windStreaks} />}
        {shoutLevel >= 3 ? (
          <>
            <Text as="p" variant="inherit" className={styles.shoutText}>{SHOUT_LABELS[shoutLevel]}</Text>
            <Text as="p" variant="inherit" className={styles.translation}>Unrelenting Force</Text>
          </>
        ) : (
          <Text as="p" variant="inherit" className={styles.shoutTextSm}>{SHOUT_LABELS[shoutLevel]}</Text>
        )}
      </div>
    </div>
  );
}
