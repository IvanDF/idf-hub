"use client";

import Link from "next/link";
import styles from "./page.module.scss";

export default function SecretsPage() {
  return (
    <main className={styles.container}>
      <div className={styles.terminal}>
        <div className={styles.header}>
          <h1>// CLASSIFIED ARCHIVES</h1>
          <span className={styles.status}>[ACCESS GRANTED]</span>
        </div>

        <div className={styles.content}>
          <div className={styles.entry}>
            <h2>PROJECT: VOID (SUPER DARK MODE)</h2>
            <div className={styles.details}>
              <p>
                <strong>STATUS:</strong> ACTIVE
              </p>
              <p>
                <strong>TRIGGER:</strong> Standard UI Protocol 7 Override
              </p>
              <p>
                <strong>INSTRUCTIONS:</strong>
              </p>
              <ul>
                <li>Locate the Theme Toggle (Light/Dark Mode).</li>
                <li>
                  Initiate rapid interaction sequence (5 clicks within 1000ms).
                </li>
                <li>Observe localized photon suppression field (Spotlight).</li>
              </ul>
              <p>
                <strong>EXIT PROTOCOL:</strong> Utilize the red emergency
                release ("EXIT DARKNESS").
              </p>
            </div>
          </div>

          <div className={styles.entry}>
            <h2>PROJECT: KONAMI (GATEWAY)</h2>
            <div className={styles.details}>
              <p>
                <strong>STATUS:</strong> ACTIVE
              </p>
              <p>
                <strong>TRIGGER:</strong> Historical Input Sequence
              </p>
              <p>
                <strong>INSTRUCTIONS:</strong>
              </p>
              <ul>
                <li>↑ ↑ ↓ ↓ ← → ← → B A</li>
              </ul>
              <p>
                <strong>RESULT:</strong> Access to this secure facility.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <p>End of transmission.</p>
          <Link href="/" className={styles.backLink}>
            &lt; RETURN TO SURFACE
          </Link>
        </div>
      </div>
    </main>
  );
}
