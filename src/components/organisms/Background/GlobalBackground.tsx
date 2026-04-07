'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import ThreeBackground from './ThreeBackground';

export default function GlobalBackground() {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none' // Allows clicks to pass through to the app
      }}
    >
      <Canvas>
        <ambientLight intensity={0.5} />
        <Suspense fallback={null}>
          <ThreeBackground />
        </Suspense>
      </Canvas>
    </div>
  );
}
