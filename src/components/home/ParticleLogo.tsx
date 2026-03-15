// src/components/home/ParticleLogo.tsx
"use client";

import { useTheme } from "@/context/ThemeContext";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

/**
 * ParticleLogo Component
 * 
 * An abstract particle system representing the "Core" of the portfolio.
 * Particles form a structured sphere (Fibonacci lattice) that:
 * 1. Breathes/Pulses slightly when idle.
 * 2. Explodes/Disperses when the cursor interacts.
 * 3. Reassembles when interaction stops.
 * 4. Integrates the 'iDF' logo in the center.
 */

function InteractiveParticles() {
  const { theme } = useTheme();
  
  // Configuration
  const particleCount = 2000;
  const sphereRadius = 1.8;
  const particleSize = 0.08;
  
  // Colors based on theme
  const color = useMemo(() => 
    theme === 'dark' ? new THREE.Color('#A78BFA') : new THREE.Color('#3B82F6'), 
  [theme]);

  // Generate initial and target positions (Fibonacci Sphere)
  const [initialData] = useState(() => {
    const pos = new Float32Array(particleCount * 3);
    const target = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3); // Store velocity for physics

    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < particleCount; i++) {
      // 1. Initial Position: Random cloud (Explosion start)
      // We start them far away or random to animate them assembling
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      // Fibonacci Sphere math for Target
      const theta = 2 * Math.PI * i / goldenRatio;
      const phi = Math.acos(1 - 2 * (i + 0.5) / particleCount);
      
      const tx = sphereRadius * Math.sin(phi) * Math.cos(theta);
      const ty = sphereRadius * Math.sin(phi) * Math.sin(theta);
      const tz = sphereRadius * Math.cos(phi);

      target[i * 3] = tx;
      target[i * 3 + 1] = ty;
      target[i * 3 + 2] = tz;

      // Init velocities
      velocities[i * 3] = 0;
      velocities[i * 3 + 1] = 0;
      velocities[i * 3 + 2] = 0;
    }

    return { pos, target, velocities };
  });

  const pointsRef = useRef<THREE.Points>(null!);
  const geometryRef = useRef<THREE.BufferGeometry>(null!);

  useFrame((state) => {
    if (!pointsRef.current || !geometryRef.current) return;

    const { mouse, viewport, clock } = state;
    // Convert normalized mouse (-1 to 1) to world units roughly
    // Assuming camera z=5, viewport width is available
    const mx = (mouse.x * viewport.width) / 2;
    const my = (mouse.y * viewport.height) / 2;

    const positions = geometryRef.current.attributes.position.array as Float32Array;
    const targets = initialData.target;
    const vels = initialData.velocities;
    
    const time = clock.getElapsedTime();

    for (let i = 0; i < particleCount; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      let cx = positions[ix];
      let cy = positions[iy];
      let cz = positions[iz];

      const tx = targets[ix];
      const ty = targets[iy];
      const tz = targets[iz];

      // --- Physics Forces ---

      // 1. Mouse Repulsion (The "Break" effect)
      const dx = mx - cx;
      const dy = my - cy;
      // We assume mouse Z is 0, but particles are 3D. 
      // Let's use a cylinder interaction or just XY distance for stronger effect?
      // Use 3D distance assuming mouse is projected at Z=0 plane (or slightly in front)
      const distSq = dx*dx + dy*dy + (cz * cz * 0.1); // Flatten Z impact
      const dist = Math.sqrt(distSq);
      
      let fx = 0, fy = 0, fz = 0;

      const repulsionRadius = 2.5;
      if (dist < repulsionRadius) {
        const force = (repulsionRadius - dist) / repulsionRadius; // 0 to 1
        const power = 0.5; // Strength
        
        // Push away from mouse
        fx -= (dx / dist) * force * power;
        fy -= (dy / dist) * force * power;
        fz += (Math.random() - 0.5) * force * power; // Scatter Z randomly
      }

      // 2. Return to Target (Spring force)
      // Add a subtle sine wave to target to make it "breathe"
      // Entrance Animation: If time < 2, use stronger spring to assemble
      
      const breath = 1 + Math.sin(time * 2 + i * 0.1) * 0.05;
      const targetX = tx * breath;
      const targetY = ty * breath;
      const targetZ = tz * breath;

      let springK = 0.05; // Default stiffness
      let damping = 0.92; // Default friction

      // Entrance Phase (First 1.5 seconds)
      if (time < 1.5) {
         springK = 0.03; // Softer pull for smooth fly-in
         damping = 0.96; // Less friction to allow fly-in momentum
      }

      fx += (targetX - cx) * springK;
      fy += (targetY - cy) * springK;
      fz += (targetZ - cz) * springK;

      // Integrate
      vels[ix] = (vels[ix] + fx) * damping;
      vels[iy] = (vels[iy] + fy) * damping;
      vels[iz] = (vels[iz] + fz) * damping;

      // Update position
      positions[ix] += vels[ix];
      positions[iy] += vels[iy];
      positions[iz] += vels[iz];
    }

    geometryRef.current.attributes.position.needsUpdate = true;
    
    // Rotate entire cloud slowly
    pointsRef.current.rotation.y = time * 0.1;
    pointsRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
  });

  return (
    <>
        <points ref={pointsRef}>
        <bufferGeometry ref={geometryRef}>
            <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={initialData.pos}
            itemSize={3}
            />
        </bufferGeometry>
        <pointsMaterial
            size={particleSize}
            color={color}
            transparent
            opacity={0.8}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
            depthWrite={false}
        />
        </points>

        {/* HTML Overlay for Logo in 3D Space */}
        <Html center position={[0, 0, 0]} zIndexRange={[100, 0]}>
            <div style={{
                pointerEvents: 'none',
                userSelect: 'none',
                color: theme === 'dark' ? '#fff' : '#111',
                fontFamily: 'var(--font-josefin-sans)',
                fontWeight: 700,
                fontSize: '4rem',
                letterSpacing: '-0.05em',
                textAlign: 'center',
                textShadow: theme === 'dark' ? '0 0 20px rgba(167, 139, 250, 0.5)' : 'none',
                opacity: 0.9
            }}>
                iDF
            </div>
        </Html>
    </>
  );
}

export default function ParticleLogo() {
  return (
    <div style={{ width: "100%", height: "100vh", position: "absolute", top: 0, left: 0, zIndex: 0 }}>
      <Canvas 
        camera={{ position: [0, 0, 6], fov: 60 }} 
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <InteractiveParticles />
      </Canvas>
    </div>
  );
}
