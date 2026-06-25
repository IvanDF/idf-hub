'use client';

import Text from '@/components/atoms/text';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import styles from './LiquidSurface.module.scss';

const LiquidShader = () => {
  const mesh = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector3(0, 0, 0) }, // World space mouse
    uColor1: { value: new THREE.Color('#000510') }, // Deep Void Blue
    uColor2: { value: new THREE.Color('#00ffff') }, // Cyan Neon
    uStrength: { value: 0.0 }, // Ripple strength (0 when not hovering)
  }), []);

  useFrame((state) => {
    if (mesh.current) {
      // Access uniforms safely
      const material = mesh.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.getElapsedTime();
      
      // Decay ripple strength when not hovering
      const targetStrength = hovered ? 1.0 : 0.0;
      material.uniforms.uStrength.value = THREE.MathUtils.lerp(
        material.uniforms.uStrength.value,
        targetStrength,
        0.05
      );
    }
  });

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    setHovered(true);
    if (mesh.current) {
      const material = mesh.current.material as THREE.ShaderMaterial;
      // Update mouse position in local space
      // We clone e.point because worldToLocal mutates the vector
      const localPoint = mesh.current.worldToLocal(e.point.clone());
      material.uniforms.uMouse.value.copy(localPoint);
    }
  };

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float uTime;
    uniform vec3 uMouse;
    uniform float uStrength;

    // Simplex 3D Noise 
    // (Standard implementation)
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute( permute( permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 0.142857142857;
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // 1. Base Rolling Waves (Slow, large scale)
      float baseWave = snoise(vec3(pos.x * 0.15, pos.y * 0.15, uTime * 0.15));
      pos.z += baseWave * 1.5;

      // 2. Detail Waves (Faster, smaller scale)
      float detailWave = snoise(vec3(pos.x * 0.5 + 10.0, pos.y * 0.5 + 10.0, uTime * 0.4));
      pos.z += detailWave * 0.5;

      // 3. Mouse Interaction (Ripple)
      // Calculate distance to mouse in world space (xy plane)
      float dist = distance(pos.xy, uMouse.xy);
      
      // Ripple decay based on distance
      float rippleArea = smoothstep(12.0, 0.0, dist); 
      
      // Sine wave expanding from center
      float ripple = sin(dist * 4.0 - uTime * 8.0) * exp(-dist * 0.8);
      
      // Apply ripple strength
      pos.z += ripple * rippleArea * uStrength * 2.0;

      vPosition = pos;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float uTime;
    uniform vec3 uColor1; // Deep Blue/Black
    uniform vec3 uColor2; // Neon Cyan

    void main() {
      // 1. Grid Pattern
      // Create a grid in UV space
      vec2 gridUV = vUv * 40.0;
      vec2 grid = step(0.95, fract(gridUV));
      float gridLine = max(grid.x, grid.y);

      // 2. Height-based Coloring
      // Map z-height (-3 to 3 roughly) to 0-1
      float heightFactor = smoothstep(-2.0, 2.5, vPosition.z);
      
      // Base gradient
      vec3 color = mix(uColor1, uColor2, heightFactor);

      // 3. Grid Glow
      // Grid lines are brighter at peaks
      float gridBrightness = gridLine * (0.2 + heightFactor * 0.8);
      color += vec3(0.0, 0.8, 1.0) * gridBrightness;

      // 4. Fresnel / Rim Light (approximate)
      // Use the height gradient to fake a rim light at the very top
      float rim = smoothstep(0.8, 1.0, heightFactor);
      color += vec3(1.0) * rim * 0.5;

      // 5. Deep fade (optional vignette-like effect for depth)
      // float depth = smoothstep(-3.0, -1.0, vPosition.z);
      // color *= (0.5 + 0.5 * depth);

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  return (
    <mesh 
      ref={mesh} 
      rotation={[-Math.PI / 2, 0, 0]} 
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setHovered(false)}
    >
      <planeGeometry args={[40, 40, 128, 128]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        wireframe={false}
        transparent={true}
      />
    </mesh>
  );
};

/**
 * Interactive Three.js liquid surface canvas with simplex-noise ripples and mouse interaction.
 */
export default function LiquidSurface() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.overlay}>
        <Text as="h1" variant="h1" className={styles.title}>LIQUID_MATRIX</Text>
        <Text as="p" variant="body" className={styles.subtitle}>Interactive Vertex Displacement // Hover to Interact</Text>
      </div>
      
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 15, 15]} fov={45} />
        <LiquidShader />
        <OrbitControls 
          enableZoom={true} 
          maxPolarAngle={Math.PI / 2.2} // Prevent going below surface
          minDistance={5}
          maxDistance={50}
        />
        <ambientLight intensity={0.5} />
      </Canvas>
    </div>
  );
}
