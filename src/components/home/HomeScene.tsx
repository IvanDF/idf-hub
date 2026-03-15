"use client";

import { useTheme } from "@/context/ThemeContext";
import { Float, RoundedBox, useTexture, Decal, Environment } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

// =============================================================================
// HERO ARTIFACT: "LARIO & VOLTA" EDITION
// =============================================================================

function HeroArtifact() {
  const { theme } = useTheme();
  // Using the SVG texture for the logo
  const texture = useTexture('/assets/idf-logo.svg');
  
  const groupRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);
  
  // Theme-aware Material Logic
  // Light Mode: "Lario Mist" (Soft Blue-Grey Ceramic)
  // Dark Mode: "Voltaic Violet" (Deep Matte Charcoal with Neon Accents)
  
  // Light Mode: #F3F4F6 (Soft White)
  // Dark Mode: #111111 (Matte Black)
  const materialColor = theme === 'dark' ? '#111111' : '#F3F4F6';
  
  // Logo Color Logic: Ensure high contrast
  // Dark Mode -> White Logo
  // Light Mode -> Dark Logo
  const logoColor = theme === 'dark' ? '#FFFFFF' : '#111827';
  
  // Material Properties for "Ceramic" vs "Tech" feel
  const roughness = theme === 'dark' ? 0.3 : 0.4;
  const metalness = theme === 'dark' ? 0.8 : 0.1;
  const clearcoat = theme === 'dark' ? 0.5 : 1.0;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Smooth interaction rotation with heavy damping for "premium weight" feel
    const targetX = hovered ? state.mouse.y * 0.2 : Math.cos(t * 0.2) * 0.05;
    const targetY = hovered ? state.mouse.x * 0.2 : Math.sin(t * 0.2) * 0.05;

    // Use lower lerp factor for smoother, less jittery movement
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.02);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.02);
  });

  return (
    <Float 
      speed={2} 
      rotationIntensity={0.2} 
      floatIntensity={0.5} 
      floatingRange={[-0.1, 0.1]}
    >
      <group 
        ref={groupRef}
        onPointerOver={() => {
            setHovered(true);
            document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = 'auto';
        }}
      >
          {/* Main Squircle Container */}
          {/* OPTIMIZATION: smoothness=4 reduces polygon count significantly */}
          <RoundedBox 
            args={[3.0, 3.0, 0.4]} 
            radius={0.6} 
            smoothness={4} 
            bevelSegments={2} 
            creaseAngle={0.4}
        >
            <meshPhysicalMaterial 
                color={materialColor}
                roughness={roughness}
                metalness={metalness}
                clearcoat={clearcoat}
                clearcoatRoughness={0.1}
            />
            
            {/* Logo Decal */}
            <Decal 
                position={[0, 0, 0.21]} 
                rotation={[0, 0, 0]} 
                scale={[1.8, 1.8, 1]}
            >
                <meshBasicMaterial 
                    map={texture}
                    transparent
                    polygonOffset
                    polygonOffsetFactor={-1}
                    color={logoColor}
                />
            </Decal>
        </RoundedBox>
      </group>
    </Float>
  );
}

export default function HomeScene() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {/* OPTIMIZATION: Cap Pixel Ratio at 1.5 to prevent 4K lag */}
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 40 }} 
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        {/* Environment Map: Crucial for "Ceramic/Metal" look */}
        <Environment preset="city" />

        <Suspense fallback={null}>
          <HeroArtifact />
        </Suspense>

        {/* Post Processing: Optimized */}
        <EffectComposer disableNormalPass>
            <Bloom 
                luminanceThreshold={0.9} 
                mipmapBlur 
                intensity={0.2} 
                radius={0.4}
            />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
