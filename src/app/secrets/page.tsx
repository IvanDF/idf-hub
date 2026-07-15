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
            <Text as="h2" variant="mono">PROJECT: NOMEN (GATEWAY)</Text>
            <div className={styles.details}>
              <Text as="p" variant="mono">
                <Text as="strong" variant="mono">STATUS:</Text> ACTIVE — you used it to get here
              </Text>
              <Text as="p" variant="mono">
                <Text as="strong" variant="mono">TRIGGER:</Text> Subject identity, knocked thrice
              </Text>
              <ul>
                <li>Locate the string {'"'}IVAN DEL FATTI{'"'} (left rail or /about).</li>
                <li>Click it three times within 1500ms.</li>
                <li>Welcome to the archive. Wipe your feet.</li>
              </ul>
            </div>
          </div>

          <div className={styles.entry}>
            <Text as="h2" variant="mono">PROJECT: VOID (SUPER DARK MODE)</Text>
            <div className={styles.details}>
              <Text as="p" variant="mono">
                <Text as="strong" variant="mono">STATUS:</Text> ACTIVE
              </Text>
              <Text as="p" variant="mono">
                <Text as="strong" variant="mono">TRIGGER:</Text> Standard UI Protocol 7 Override
              </Text>
              <ul>
                <li>Locate the Theme Toggle (Light/Dark Mode).</li>
                <li>Initiate rapid interaction sequence (5 clicks within 1000ms).</li>
                <li>Observe localized photon suppression field (Spotlight).</li>
              </ul>
              <Text as="p" variant="mono">
                <Text as="strong" variant="mono">EXIT PROTOCOL:</Text> Utilize the red emergency
                release ({'"'}EXIT DARKNESS{'"'}).
              </Text>
            </div>
          </div>

          <div className={styles.entry}>
            <Text as="h2" variant="mono">PROJECT: THU&rsquo;UM (VOCAL WEAPON)</Text>
            <div className={styles.details}>
              <Text as="p" variant="mono">
                <Text as="strong" variant="mono">STATUS:</Text> ARMED — microphone clearance required
              </Text>
              <Text as="p" variant="mono">
                <Text as="strong" variant="mono">TRIGGER:</Text> Type {'"'}fus{'"'} in the terminal, then SHOUT
              </Text>
              <ul>
                <li>Three bursts of voice. Any language. Volume is the password.</li>
                <li>Neighbors{'’'} complaints are not covered by this agency.</li>
              </ul>
            </div>
          </div>

          <div className={styles.entry}>
            <Text as="h2" variant="mono">PROJECT: CORTEX (REDACTED)</Text>
            <div className={styles.details}>
              <Text as="p" variant="mono">
                <Text as="strong" variant="mono">STATUS:</Text> ██████
              </Text>
              <Text as="p" variant="mono">
                <Text as="strong" variant="mono">NOTE:</Text> The terminal knows about the brain.
                Ask it. Bring your own neurons.
              </Text>
            </div>
          </div>

          <div className={styles.entry}>
            <Text as="h2" variant="mono">FACILITY LOG</Text>
            <div className={styles.details}>
              <ul>
                <li>Eggs on site: 11. Tracker: terminal → {'"'}eggs{'"'}. Stuck? → {'"'}hint{'"'}.</li>
                <li>Coffee consumed while hiding all this: unmeasurable.</li>
                <li>Typing {'"'}time{'"'} anywhere bends the timeline. You didn{'’'}t read that here.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <Text as="p" variant="mono">End of transmission. This page will not self-destruct — budget cuts.</Text>
          <Link href="/" className={styles.backLink}>
            &lt; RETURN TO SURFACE
          </Link>
        </div>
      </div>
    </main>
  );
}
