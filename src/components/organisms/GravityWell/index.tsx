'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

const ParticleField = () => {
  const count = 10000;
  const mesh = useRef<THREE.Points>(null!);
  const mouse = useRef(new THREE.Vector3(0, 0, 0));
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (seededRandom(i) - 0.5) * 50;
      const y = (seededRandom(i + count) - 0.5) * 50;
      const z = (seededRandom(i + count * 2) - 0.5) * 50;
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, [count]);

  const originalPositions = useMemo(() => particles.slice(), [particles]);
  const velocitiesRef = useRef(new Float32Array(count * 3));

  useFrame((state) => {
    const { pointer, viewport } = state;
    mouse.current.set(
      (pointer.x * viewport.width) / 2,
      (pointer.y * viewport.height) / 2,
      0
    );

    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    const velocities = velocitiesRef.current;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];

      const ox = originalPositions[i3];
      const oy = originalPositions[i3 + 1];
      const oz = originalPositions[i3 + 2];

      const dx = mouse.current.x - x;
      const dy = mouse.current.y - y;
      const dz = mouse.current.z - z;

      const distSq = dx * dx + dy * dy + dz * dz;

      const force = Math.min(1000 / (distSq + 0.1), 2); 

      velocities[i3] += dx * force * 0.01;
      velocities[i3 + 1] += dy * force * 0.01;
      velocities[i3 + 2] += dz * force * 0.01;

      velocities[i3] *= 0.95;
      velocities[i3 + 1] *= 0.95;
      velocities[i3 + 2] *= 0.95;

      const sdx = ox - x;
      const sdy = oy - y;
      const sdz = oz - z;

      velocities[i3] += sdx * 0.02;
      velocities[i3 + 1] += sdy * 0.02;
      velocities[i3 + 2] += sdz * 0.02;

      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];
    }

    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#00ffff"
        sizeAttenuation
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

/**
 * Interactive Three.js gravity-well canvas where particles are attracted to the cursor.
 */
export default function GravityWell() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 30]} />
        <ParticleField />
        <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
