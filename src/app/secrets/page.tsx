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
          <Text as="p" variant="mono">
            If you were looking for the portfolio, I must advise you to look
            away — a phrase which here means {'"'}go back to the homepage,
            where everything is reassuringly normal{'"'}. What follows is a
            record of the things I have hidden in this site, kept against my
            better judgement.
          </Text>

          <details className={styles.entry} open>
            <summary>
              <Text as="h2" variant="mono">PROJECT: NOMEN (GATEWAY)</Text>
              <span className={styles.declassify} aria-hidden="true" />
            </summary>
            <div className={styles.details}>
              <Text as="p" variant="mono">
                <Text as="strong" variant="mono">STATUS:</Text> ACTIVE — you used it to get here
              </Text>
              <Text as="p" variant="mono">
                <Text as="strong" variant="mono">TRIGGER:</Text> My name, knocked on three times
              </Text>
              <ul>
                <li>Locate the string {'"'}IVAN DEL FATTI{'"'} (left rail or /about).</li>
                <li>Click it three times within 1500ms.</li>
                <li>Welcome to the archive. Wipe your feet.</li>
              </ul>
            </div>
          </details>

          <details className={styles.entry}>
            <summary>
              <Text as="h2" variant="mono">PROJECT: VOID (SUPER DARK MODE)</Text>
              <span className={styles.declassify} aria-hidden="true" />
            </summary>
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
          </details>

          <details className={styles.entry}>
            <summary>
              <Text as="h2" variant="mono">PROJECT: THU&rsquo;UM (VOCAL WEAPON)</Text>
              <span className={styles.declassify} aria-hidden="true" />
            </summary>
            <div className={styles.details}>
              <Text as="p" variant="mono">
                <Text as="strong" variant="mono">STATUS:</Text> ARMED — the browser will politely ask for your microphone
              </Text>
              <Text as="p" variant="mono">
                <Text as="strong" variant="mono">TRIGGER:</Text> Type {'"'}fus{'"'} in the terminal, then speak
              </Text>
              <ul>
                <li>Say the words: fus... ro... dah. The recogniser is forgiving.</li>
                <li>If the neighbors look at you differently afterwards, I am afraid that is between you and the neighbors.</li>
              </ul>
            </div>
          </details>

          <details className={styles.entry}>
            <summary>
              <Text as="h2" variant="mono">PROJECT: CORTEX (REDACTED)</Text>
              <span className={styles.declassify} aria-hidden="true" />
            </summary>
            <div className={styles.details}>
              <Text as="p" variant="mono">
                <Text as="strong" variant="mono">STATUS:</Text> ██████
              </Text>
              <Text as="p" variant="mono">
                <Text as="strong" variant="mono">NOTE:</Text> The terminal knows about the brain.
                Ask it. Bring your own neurons.
              </Text>
            </div>
          </details>

          <details className={styles.entry}>
            <summary>
              <Text as="h2" variant="mono">AN INCOMPLETE INVENTORY</Text>
              <span className={styles.declassify} aria-hidden="true" />
            </summary>
            <div className={styles.details}>
              <ul>
                <li>Eggs hidden in these walls: 11. Type {'"'}eggs{'"'} to count yours, {'"'}hint{'"'} when pride allows.</li>
                <li>Coffee consumed while hiding all this: unmeasurable.</li>
                <li>Typing {'"'}time{'"'} anywhere bends the timeline. You didn{'’'}t read that here.</li>
              </ul>
            </div>
          </details>
        </div>

        <div className={styles.footer}>
          <Text as="p" variant="mono">
            End of the archive. This page will not self-destruct: I never
            learned how to build that, and frankly the idea alarms me.
          </Text>
          <Link href="/" className={styles.backLink}>
            &lt; RETURN TO SURFACE
          </Link>
        </div>
      </div>
    </main>
  );
}
