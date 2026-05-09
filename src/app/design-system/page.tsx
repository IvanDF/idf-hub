'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.scss';

const STORYBOOK_DEV_URL = 'http://localhost:6006';
const STORYBOOK_PROD_PATH = '/storybook/index.html';

export default function DesignSystemPage() {
  const [storybookReady, setStorybookReady] = useState(false);
  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      fetch('/storybook/index.html', { method: 'HEAD' })
        .then((res) => setStorybookReady(res.ok))
        .catch(() => setStorybookReady(false));
    }
  }, []);

  const openStorybook = () => {
    if (isDev) {
      window.open(STORYBOOK_DEV_URL, '_blank');
    } else {
      window.location.href = STORYBOOK_PROD_PATH;
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Design System</h1>
        <p className={styles.subtitle}>
          Lario &amp; Volta &mdash; Interactive component library and style guide
        </p>
      </div>

      <div className={styles.cards}>
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Storybook</h2>
          <p className={styles.cardDescription}>
            Isolated component development environment with interactive docs,
            accessibility audits, and visual regression testing.
          </p>
          <div className={styles.storybookActions}>
            <button className={styles.primaryBtn} onClick={openStorybook}>
              Open Storybook
            </button>
            {!isDev && !storybookReady && (
              <p className={styles.hint}>
                Storybook static build not found. Run{' '}
                <code>npm run build:storybook</code> first.
              </p>
            )}
            {isDev && (
              <p className={styles.hint}>
                Make sure Storybook is running: <code>npm run storybook</code>
              </p>
            )}
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Quick Links</h2>
          <ul className={styles.linkList}>
            <li>
              <a href={isDev ? STORYBOOK_DEV_URL : STORYBOOK_PROD_PATH} target="_blank" rel="noopener noreferrer">
                Atoms
              </a>
              &nbsp;&mdash; AudioToggle, GlitchText, Magnetic, RotatingTitle, LogoMorph
            </li>
            <li>
              <a href={isDev ? `${STORYBOOK_DEV_URL}/?path=/docs/molecules` : STORYBOOK_PROD_PATH} target="_blank" rel="noopener noreferrer">
                Molecules
              </a>
              &nbsp;&mdash; ProjectCard, GalleryViewer, AudioPrompt
            </li>
            <li>
              <a href={isDev ? `${STORYBOOK_DEV_URL}/?path=/docs/organisms` : STORYBOOK_PROD_PATH} target="_blank" rel="noopener noreferrer">
                Organisms
              </a>
              &nbsp;&mdash; Terminal, Background, 3D scenes
            </li>
            <li>
              <a href={isDev ? `${STORYBOOK_DEV_URL}/?path=/docs/design-tokens` : STORYBOOK_PROD_PATH} target="_blank" rel="noopener noreferrer">
                Design Tokens
              </a>
              &nbsp;&mdash; Colors, typography, spacing, breakpoints
            </li>
          </ul>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Atomic Design</h2>
          <p className={styles.cardDescription}>
            Components follow Atomic Design principles:
          </p>
          <ul className={styles.linkList}>
            <li><strong>Atoms</strong> &mdash; Smallest UI units</li>
            <li><strong>Molecules</strong> &mdash; Composed atoms</li>
            <li><strong>Organisms</strong> &mdash; Complex UI blocks</li>
            <li><strong>Templates</strong> &mdash; Page layout wrappers</li>
          </ul>
        </section>
      </div>

      <div className={styles.footer}>
        <p>
          Tokens defined in <code>src/styles/_variables.scss</code> &mdash;
          every component uses design tokens, never hardcoded values.
        </p>
      </div>
    </main>
  );
}
