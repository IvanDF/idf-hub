'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, PerspectiveCamera } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const VortexShader = () => {
  const mesh = useRef<THREE.Mesh>(null!);
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color('#000000') },
    uColor2: { value: new THREE.Color('#1a0b2e') },
    uColor3: { value: new THREE.Color('#4a148c') },
  }), []);

  useFrame((state) => {
    if (mesh.current) {
        const material = mesh.current.material as THREE.ShaderMaterial;
        material.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    varying vec2 vUv;

    // Simplex 2D noise
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      // Swirl effect
      vec2 center = vec2(0.5);
      vec2 uv = vUv - center;
      float dist = length(uv);
      float angle = atan(uv.y, uv.x);
      
      // Spiral
      float spiral = angle + dist * 10.0 - uTime * 0.5;
      float noise = snoise(vec2(cos(spiral), sin(spiral)) * 2.0);
      
      vec3 color = mix(uColor1, uColor2, noise * 0.5 + 0.5);
      color = mix(color, uColor3, snoise(uv * 5.0 + uTime * 0.2) * 0.5);
      
      // Dark center
      color *= smoothstep(0.0, 0.4, dist);

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  return (
    <mesh ref={mesh} position={[0, 0, -10]} scale={[20, 20, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
};

/**
 * Three.js animated vortex shader canvas used as the time-machine page background.
 */
export default function TimeVortex() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -10 }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={2} />
        <VortexShader />
      </Canvas>
    </div>
  );
}
