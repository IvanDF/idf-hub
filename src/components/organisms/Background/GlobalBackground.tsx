'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import ThreeBackground from './ThreeBackground';
import styles from './GlobalBackground.module.scss';

/**
 * Full-viewport fixed Three.js canvas that renders the global decorative background scene.
 */
export default function GlobalBackground() {
  return (
    <div className={styles.container}>
      {/* frameloop="demand": the scene is static apart from the mouse-driven
          lift, so ThreeBackground invalidates on pointer moves instead of
          re-rendering every frame behind the page content. */}
      <Canvas dpr={[1, 1.5]} frameloop="demand">
        <ambientLight intensity={0.5} />
        <Suspense fallback={null}>
          <ThreeBackground />
        </Suspense>
      </Canvas>
    </div>
  );
}
