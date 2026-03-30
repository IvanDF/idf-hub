'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Github, ArrowRight, History } from 'lucide-react';
import styles from './TimeMachine.module.scss';

const TimeVortex = dynamic(() => import('@/components/time-machine/TimeVortex'), { ssr: false });

export default function TimeMachinePage() {
  const legacyProject = {
    id: 'idf-old',
    title: 'LEGACY_SYSTEM_V1',
    description: 'The original portfolio artifact. A snapshot of the digital identity prior to the Neural Interface upgrade. Preserved for historical analysis.',
    year: '2023 - 2025',
    tech: 'HTML5 // SCSS // VANILLA JS',
    links: {
      github: 'https://github.com/IvanDF/idf_old',
      live: 'https://ivandf.github.io/idf_old/'
    }
  };

  return (
    <div className={styles.container}>
      {/* Background Effect */}
      <div className={styles.backgroundWrapper}>
        <TimeVortex />
      </div>

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.glitchWrapper}>
             <h1 className={styles.glitch} data-text="TEMPORAL_ARCHIVE">TEMPORAL_ARCHIVE</h1>
          </div>
          <p>
            Artifacts retrieved from the timeline.
          </p>
        </div>

        {/* Single Hero Artifact */}
        <div className={styles.artifactContainer}>
            <div className={styles.hologramRing}></div>
            <div className={styles.artifactCard}>
                <div className={styles.artifactHeader}>
                    <History size={24} className={styles.icon} />
                    <span className={styles.idBadge}>ARTIFACT_ID: {legacyProject.id}</span>
                </div>
                
                <h2 className={styles.artifactTitle}>{legacyProject.title}</h2>
                <div className={styles.artifactMeta}>
                    <span>{legacyProject.year}</span>
                    <span className={styles.separator}>|</span>
                    <span>{legacyProject.tech}</span>
                </div>
                
                <p className={styles.artifactDescription}>
                    {legacyProject.description}
                </p>

                <div className={styles.artifactActions}>
                    <a 
                        href={legacyProject.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.primaryAction}
                    >
                        <span>INITIALIZE LEGACY MODE</span>
                        <ArrowRight size={16} />
                    </a>
                    
                    <a 
                        href={legacyProject.links.github}
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

        <div className={styles.footer}>
            <Link href="/" className={styles.backLink}>
                &larr; RETURN TO PRESENT
            </Link>
        </div>
      </div>
    </div>
  );
}
