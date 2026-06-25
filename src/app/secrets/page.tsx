"use client";

import Text from "@/components/atoms/text";
import Link from "next/link";
import { useEffect } from "react";
import { useAudio } from "@/context/AudioContext";
import styles from "./page.module.scss";

/**
 * Hidden "classified" page revealing Easter-egg instructions; accessible via the Konami code.
 */
export default function SecretsPage() {
  const { playGlitch } = useAudio();

  useEffect(() => {
    playGlitch();
  }, [playGlitch]);

  return (
    <main className={styles.container}>
      <div className={styles.terminal}>
        <div className={styles.header}>
          <Text as="h1" variant="mono">{`// CLASSIFIED ARCHIVES`}</Text>
          <Text as="span" variant="mono" className={styles.status}>[ACCESS GRANTED]</Text>
        </div>

        <div className={styles.content}>
          <div className={styles.entry}>
            <Text as="h2" variant="mono">PROJECT: VOID (SUPER DARK MODE)</Text>
            <div className={styles.details}>
              <Text as="p" variant="mono">
                <Text as="strong" variant="mono">STATUS:</Text> ACTIVE
              </Text>
              <Text as="p" variant="mono">
                <Text as="strong" variant="mono">TRIGGER:</Text> Standard UI Protocol 7 Override
              </Text>
              <Text as="p" variant="mono">
                <Text as="strong" variant="mono">INSTRUCTIONS:</Text>
              </Text>
              <ul>
                <li>Locate the Theme Toggle (Light/Dark Mode).</li>
                <li>
                  Initiate rapid interaction sequence (5 clicks within 1000ms).
                </li>
                <li>Observe localized photon suppression field (Spotlight).</li>
              </ul>
              <Text as="p" variant="mono">
                <Text as="strong" variant="mono">EXIT PROTOCOL:</Text> Utilize the red emergency
                release ({'"'}EXIT DARKNESS{'"'}).
              </Text>
            </div>
          </div>

          <div className={styles.entry}>
            <Text as="h2" variant="mono">PROJECT: KONAMI (GATEWAY)</Text>
            <div className={styles.details}>
              <Text as="p" variant="mono">
                <Text as="strong" variant="mono">STATUS:</Text> ACTIVE
              </Text>
              <Text as="p" variant="mono">
                <Text as="strong" variant="mono">TRIGGER:</Text> Historical Input Sequence
              </Text>
              <Text as="p" variant="mono">
                <Text as="strong" variant="mono">INSTRUCTIONS:</Text>
              </Text>
              <ul>
                <li>↑ ↑ ↓ ↓ ← → ← → B A</li>
              </ul>
              <Text as="p" variant="mono">
                <Text as="strong" variant="mono">RESULT:</Text> Access to this secure facility.
              </Text>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <Text as="p" variant="mono">End of transmission.</Text>
          <Link href="/" className={styles.backLink}>
            &lt; RETURN TO SURFACE
          </Link>
        </div>
      </div>
    </main>
  );
}
