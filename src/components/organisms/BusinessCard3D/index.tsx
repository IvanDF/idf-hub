'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import CardScene from './CardScene';
import styles from './BusinessCard3D.module.scss';

export interface BusinessCard3DProps {
  /** Card variant — maps directly to SVG asset filenames. */
  style: 'normal' | 'code' | 'design';
  /** Whether the card is showing its back face. */
  isFlipped: boolean;
  /** Triggers a flip when called. */
  onFlip: () => void;
  /** Disables spring/tilt animations for prefers-reduced-motion users. */
  reducedMotion: boolean;
}

/**
 * Full-viewport Three.js Canvas rendering the interactive 3D business card.
 * Must be loaded client-side only — use `next/dynamic` with `ssr: false`.
 */
export default function BusinessCard3D({
  style,
  isFlipped,
  onFlip,
  reducedMotion,
}: BusinessCard3DProps) {
  const frontUrl = `/assets/business-cards/${style}-front.svg`;
  const backUrl = `/assets/business-cards/${style}-back.svg`;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onFlip();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={
        isFlipped
          ? 'Business card back — press Enter or Space to flip'
          : 'Business card front — press Enter or Space to flip'
      }
      className={styles.canvas}
      onClick={onFlip}
      onKeyDown={handleKeyDown}
    >
      <Canvas camera={{ fov: 40, position: [0, 0, 14] }}>
        <Suspense fallback={null}>
          <CardScene
            frontUrl={frontUrl}
            backUrl={backUrl}
            isFlipped={isFlipped}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
