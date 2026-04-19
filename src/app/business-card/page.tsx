'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';

/** Loaded client-side only — Three.js requires browser APIs. */
const BusinessCard3D = dynamic(
  () => import('@/components/organisms/BusinessCard3D'),
  { ssr: false },
);

const VARIANTS = [
  { id: 'normal', label: 'General' },
  { id: 'code',   label: 'Dev' },
  { id: 'design', label: 'Design' },
] as const;

type CardStyle = (typeof VARIANTS)[number]['id'];

function isValidStyle(s: string | null): s is CardStyle {
  return VARIANTS.some((v) => v.id === s);
}

/**
 * Business card landing page.
 * Renders the selected iDF business card variant as an interactive 3D scene.
 *
 * Query params:
 *   style — "normal" | "code" | "design"  (default: "normal")
 *
 * Example: /business-card?style=design
 */
export default function BusinessCardPage() {
  const router   = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawStyle   = searchParams.get('style');
  const activeStyle: CardStyle = isValidStyle(rawStyle) ? rawStyle : 'normal';

  const [isFlipped,     setIsFlipped]     = useState(false);
  const [hintVisible,   setHintVisible]   = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
    setHintVisible(false);
    if ('vibrate' in navigator) navigator.vibrate(10);
  };

  const switchStyle = (s: CardStyle) => {
    setIsFlipped(false);
    const params = new URLSearchParams(searchParams.toString());
    params.set('style', s);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className={styles.stage}>

      {/* 3D Canvas — keyed on style to remount on variant change */}
      <div className={styles.canvasWrap}>
        <BusinessCard3D
          key={activeStyle}
          style={activeStyle}
          isFlipped={isFlipped}
          onFlip={handleFlip}
          reducedMotion={reducedMotion}
        />
      </div>

      {/* Tap-to-flip hint — disappears after first flip */}
      {hintVisible && (
        <p className={styles.hint} aria-hidden="true">
          tap to flip
        </p>
      )}

      {/* Variant selector */}
      <nav className={styles.variants} aria-label="Card variant selector">
        {VARIANTS.map(({ id, label }) => (
          <button
            key={id}
            className={`${styles.pill} ${activeStyle === id ? styles.pillActive : ''}`}
            onClick={() => switchStyle(id)}
            aria-pressed={activeStyle === id}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Back to main site */}
      <Link href="/" className={styles.backLink}>
        ← iDF
      </Link>

    </div>
  );
}
