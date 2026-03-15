'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const ParticleField = () => {
  const count = 10000;
  const mesh = useRef<THREE.Points>(null!);
  const mouse = useRef(new THREE.Vector3(0, 0, 0));
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 50;
      const y = (Math.random() - 0.5) * 50;
      const z = (Math.random() - 0.5) * 50;
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, [count]);

  const originalPositions = useMemo(() => particles.slice(), [particles]);
  const velocities = useMemo(() => new Float32Array(count * 3), [count]);

  useFrame((state) => {
    const { pointer, viewport } = state;
    // Map pointer (normalized -1 to 1) to world space roughly
    mouse.current.set(
      (pointer.x * viewport.width) / 2,
      (pointer.y * viewport.height) / 2,
      0
    );

    const positions = mesh.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Current position
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];

      // Original position (target to return to)
      const ox = originalPositions[i3];
      const oy = originalPositions[i3 + 1];
      const oz = originalPositions[i3 + 2];

      // Vector to mouse
      const dx = mouse.current.x - x;
      const dy = mouse.current.y - y;
      const dz = mouse.current.z - z;

      const distSq = dx * dx + dy * dy + dz * dz;
      const dist = Math.sqrt(distSq);

      // Force (gravity) - stronger when closer
      // F = G * m1 * m2 / r^2
      // Clamp distance to avoid division by zero or extreme forces
      const force = Math.min(1000 / (distSq + 0.1), 2); 

      // Apply force to velocity
      velocities[i3] += dx * force * 0.01;
      velocities[i3 + 1] += dy * force * 0.01;
      velocities[i3 + 2] += dz * force * 0.01;

      // Damping (friction)
      velocities[i3] *= 0.95;
      velocities[i3 + 1] *= 0.95;
      velocities[i3 + 2] *= 0.95;

      // Spring force back to original position
      const sdx = ox - x;
      const sdy = oy - y;
      const sdz = oz - z;

      velocities[i3] += sdx * 0.02;
      velocities[i3 + 1] += sdy * 0.02;
      velocities[i3 + 2] += sdz * 0.02;

      // Update position
      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];
    }

    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
        />
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
