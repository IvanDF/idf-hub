"use client";

import { useTheme } from "@/context/ThemeContext";
import { Html } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

function getParticleCount(): number {
  if (typeof window === "undefined") return 1200;
  const w = window.innerWidth;
  if (w < 576) return 350;
  if (w < 992) return 700;
  return 1200;
}

function InteractiveParticles() {
  const { theme } = useTheme();

  const particleCount = useMemo(() => getParticleCount(), []);
  const sphereRadius = 1.8;
  const particleSize = 0.08;

  const color = useMemo(
    () =>
      theme === "dark"
        ? new THREE.Color("#A78BFA")
        : new THREE.Color("#3B82F6"),
    [theme],
  );

  const [initialData] = useState(() => {
    const pos = new Float32Array(particleCount * 3);
    const target = new Float32Array(particleCount * 3);
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / particleCount);
      const tx = sphereRadius * Math.sin(phi) * Math.cos(theta);
      const ty = sphereRadius * Math.sin(phi) * Math.sin(theta);
      const tz = sphereRadius * Math.cos(phi);
      target[i * 3] = tx;
      target[i * 3 + 1] = ty;
      target[i * 3 + 2] = tz;
    }

    return { pos, target };
  });

  const velocitiesRef = useRef(new Float32Array(particleCount * 3));
  const pointsRef = useRef<THREE.Points>(null!);
  const geometryRef = useRef<THREE.BufferGeometry>(null!);

  useFrame((state) => {
    if (!pointsRef.current || !geometryRef.current) return;

    const { mouse, viewport, clock } = state;
    const mx = (mouse.x * viewport.width) / 2;
    const my = (mouse.y * viewport.height) / 2;

    const positions = geometryRef.current.attributes.position
      .array as Float32Array;
    const targets = initialData.target;
    const vels = velocitiesRef.current;
    const time = clock.getElapsedTime();

    for (let i = 0; i < particleCount; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      const cx = positions[ix];
      const cy = positions[iy];
      const cz = positions[iz];

      const tx = targets[ix];
      const ty = targets[iy];
      const tz = targets[iz];

      let fx = 0;
      let fy = 0;
      let fz = 0;

      const dx = mx - cx;
      const dy = my - cy;
      const distSq = dx * dx + dy * dy + cz * cz * 0.1;
      const dist = Math.sqrt(distSq);

      const repulsionRadius = 1.2;
      if (dist < repulsionRadius) {
        const force = (repulsionRadius - dist) / repulsionRadius;
        const power = 0.05;
        fx -= (dx / dist) * force * power;
        fy -= (dy / dist) * force * power;
        fz += (Math.random() - 0.5) * force * power;
      }

      const breath = 1 + Math.sin(time * 2 + i * 0.1) * 0.05;
      const targetX = tx * breath;
      const targetY = ty * breath;
      const targetZ = tz * breath;

      const springK = time < 1.5 ? 0.03 : 0.05;
      const damping = time < 1.5 ? 0.96 : 0.92;

      fx += (targetX - cx) * springK;
      fy += (targetY - cy) * springK;
      fz += (targetZ - cz) * springK;

      vels[ix] = (vels[ix] + fx) * damping;
      vels[iy] = (vels[iy] + fy) * damping;
      vels[iz] = (vels[iz] + fz) * damping;

      positions[ix] += vels[ix];
      positions[iy] += vels[iy];
      positions[iz] += vels[iz];
    }

    geometryRef.current.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry ref={geometryRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[initialData.pos, 3]}
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

      <Html center position={[0, 0, 0]} zIndexRange={[100, 0]}>
        <div
          style={{
            pointerEvents: "none",
            userSelect: "none",
            width: "180px",
            height: "180px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.9,
            filter:
              theme === "dark"
                ? "drop-shadow(0 0 20px rgba(167, 139, 250, 0.4))"
                : "invert(1) drop-shadow(0 0 20px rgba(59, 130, 246, 0.4))",
            transition: "filter 0.3s ease, opacity 0.3s ease",
          }}
        >
          <Image
            src="/assets/idf-logo.svg"
            alt="iDF Logo"
            width={180}
            height={180}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      </Html>
    </>
  );
}

/**
 * Full-viewport Three.js canvas rendering the iDF logo surrounded by an interactive particle sphere.
 * Uses R3F Html component which requires inline styles for positioning within the 3D scene.
 * Also uses dynamic theme-aware filter values that change at runtime.
 */
export default function ParticleLogo() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 0,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <InteractiveParticles />
      </Canvas>
    </div>
  );
}
