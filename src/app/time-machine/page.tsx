"use client";

import { Github, History } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import styles from "./TimeMachine.module.scss";

const TimeVortex = dynamic(
  () => import("@/components/organisms/time-vortex").then((m) => m.TimeVortex),
  { ssr: false },
);

const LEGACY_URL = "https://ivandf.netlify.app";

export default function TimeMachinePage() {
  const [tvOn, setTvOn] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.backgroundWrapper}>
        <TimeVortex />
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.glitchWrapper}>
            <h1 className={styles.glitch} data-text="TEMPORAL_ARCHIVE">
              TEMPORAL_ARCHIVE
            </h1>
          </div>
          <p>Artifacts retrieved from the timeline.</p>
        </div>

        <div className={styles.artifactContainer}>
          <div className={styles.hologramRing}></div>
          <div className={styles.artifactCard}>
            <div className={styles.artifactHeader}>
              <History size={24} className={styles.icon} />
              <span className={styles.idBadge}>ARTIFACT_ID: idf-old</span>
            </div>

            <h2 className={styles.artifactTitle}>LEGACY_SYSTEM_V1</h2>
            <div className={styles.artifactMeta}>
              <span>2023 – 2025</span>
              <span className={styles.separator}>|</span>
              <span>HTML5 // SCSS // VANILLA JS</span>
            </div>

            <p className={styles.artifactDescription}>
              The original portfolio artifact. A snapshot of the digital identity prior to the
              Neural Interface upgrade. Preserved for historical analysis.
            </p>

            <div className={styles.artifactActions}>
              <button
                type="button"
                className={styles.primaryAction}
                onClick={() => setTvOn((v) => !v)}
              >
                <span>{tvOn ? "POWER OFF" : "INITIALIZE LEGACY MODE"}</span>
              </button>

              <a
                href={LEGACY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.secondaryAction}
                title="View Source Code"
              >
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>

        {tvOn && (
          <div className={styles.tvWrapper}>
            <div className={styles.tvBezel}>
              <div className={styles.tvScreenWrap}>
                <iframe
                  src={LEGACY_URL}
                  title="Legacy Portfolio — iDF v1"
                  sandbox="allow-scripts allow-same-origin allow-forms"
                  loading="lazy"
                />
                <div className={styles.tvScanlines} aria-hidden="true" />
                <div className={styles.tvVignette} aria-hidden="true" />
              </div>
              <div className={styles.tvKnobs} aria-hidden="true">
                <div className={styles.tvKnob} />
                <div className={styles.tvKnob} />
              </div>
              <div className={styles.tvBrand} aria-hidden="true">iDF · v1 · 2025</div>
            </div>
            <a
              href={LEGACY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.tvOpenLink}
            >
              ↗ open in new tab
            </a>
          </div>
        )}

        <div className={styles.footer}>
          <Link href="/" className={styles.backLink}>
            &larr; RETURN TO PRESENT
          </Link>
        </div>
      </div>
    </div>
  );
}
