'use client';

import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

/** Business card dimensions in Three.js units — maintains 85×54 mm ratio. */
const CARD_W = 8.56;
const CARD_H = 5.4;
const CARD_D = 0.04;

/** Maximum tilt in radians (±10°). */
const MAX_TILT = (10 * Math.PI) / 180;

/** Spring constants for the flip animation. */
const STIFFNESS = 0.12;
const DAMPING = 0.8;

/** Lerp factor for tilt smoothing. */
const TILT_LERP = 0.08;

export interface CardSceneProps {
  /** Path to the front-face SVG texture. */
  frontUrl: string;
  /** Path to the back-face SVG texture. */
  backUrl: string;
  /** Whether the card is flipped to show the back face. */
  isFlipped: boolean;
  /** When true, animations are instant (respects prefers-reduced-motion). */
  reducedMotion: boolean;
}

interface AnimState {
  flipAngle: number;
  flipVel: number;
  tiltX: number;
  tiltY: number;
  targetTiltX: number;
  targetTiltY: number;
}

/**
 * Three.js mesh for the business card with spring-based flip and mouse/gyro tilt.
 */
function BusinessCardMesh({ frontUrl, backUrl, isFlipped, reducedMotion }: CardSceneProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [frontTex, backTex] = useTexture([frontUrl, backUrl]);

  const anim = useRef<AnimState>({
    flipAngle: 0,
    flipVel: 0,
    tiltX: 0,
    tiltY: 0,
    targetTiltX: 0,
    targetTiltY: 0,
  });

  // Mouse tilt — desktop only
  useEffect(() => {
    if (reducedMotion) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(hover: none)').matches) return;

    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      anim.current.targetTiltX = nx * MAX_TILT;
      anim.current.targetTiltY = ny * MAX_TILT;
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [reducedMotion]);

  // Gyroscope tilt — touch devices only
  useEffect(() => {
    if (reducedMotion) return;
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(hover: none)').matches) return;

    const onOrientation = (e: DeviceOrientationEvent) => {
      const gamma = Math.max(-30, Math.min(30, e.gamma ?? 0));
      const beta = Math.max(-30, Math.min(30, (e.beta ?? 30) - 30));
      anim.current.targetTiltX = (gamma / 30) * MAX_TILT;
      anim.current.targetTiltY = -(beta / 30) * MAX_TILT;
    };

    window.addEventListener('deviceorientation', onOrientation);
    return () => window.removeEventListener('deviceorientation', onOrientation);
  }, [reducedMotion]);

  useFrame(() => {
    if (!meshRef.current) return;

    const s = anim.current;
    const target = isFlipped ? Math.PI : 0;

    if (reducedMotion) {
      s.flipAngle = target;
      s.flipVel = 0;
    } else {
      s.flipVel = s.flipVel * DAMPING + (target - s.flipAngle) * STIFFNESS;
      s.flipAngle += s.flipVel;
      s.tiltX += (s.targetTiltX - s.tiltX) * TILT_LERP;
      s.tiltY += (s.targetTiltY - s.tiltY) * TILT_LERP;
    }

    meshRef.current.rotation.y = s.flipAngle + (reducedMotion ? 0 : s.tiltX);
    meshRef.current.rotation.x = reducedMotion ? 0 : s.tiltY;
  });

  // Box material array: [+x, -x, +y, -y, +z (front), -z (back)]
  const materials = useMemo(() => {
    const edge = () =>
      new THREE.MeshStandardMaterial({ color: '#111827', roughness: 0.5, metalness: 0.1 });
    return [
      edge(),
      edge(),
      edge(),
      edge(),
      new THREE.MeshStandardMaterial({ map: frontTex }),
      new THREE.MeshStandardMaterial({ map: backTex }),
    ];
  }, [frontTex, backTex]);

  return (
    <mesh ref={meshRef} material={materials}>
      <boxGeometry args={[CARD_W, CARD_H, CARD_D]} />
    </mesh>
  );
}

/**
 * Full R3F scene for the 3D business card: lighting + card mesh.
 * Consumed inside a Canvas with a Suspense boundary for texture loading.
 */
export default function CardScene(props: CardSceneProps) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-4, -3, 3]} intensity={0.4} color="#a78bfa" />
      <BusinessCardMesh {...props} />
    </>
  );
}
