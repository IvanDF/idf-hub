'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { useLoader, useFrame, extend } from '@react-three/fiber';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// 1. Custom Shader Material
// Adjusted for subtlety (opacity) and smoothness
const HoverMaterial = shaderMaterial(
  {
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uColor: new THREE.Color('#5D6BF8'), // Slightly deeper blue/purple
    uHoverRadius: 80,  // Slightly tighter radius for precision
    uLiftAmount: 30,   // Gentle lift
    uOpacity: 0.15,    // Base opacity (very subtle)
  },
  // Vertex Shader
  `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uHoverRadius;
    uniform float uLiftAmount;
    
    attribute vec3 aCenter;
    
    varying vec2 vUv;
    varying float vElevation;

    void main() {
      vUv = uv;
      
      // Calculate distance from mouse to the shape's center
      float dist = distance(aCenter.xy, uMouse);
      
      float lift = 0.0;
      
      // Smooth falloff
      if (dist < uHoverRadius) {
        float t = 1.0 - (dist / uHoverRadius);
        // Smoothstep-like curve for organic feel
        lift = t * t * (3.0 - 2.0 * t) * uLiftAmount;
      }
      
      vElevation = lift;

      vec3 newPos = position;
      newPos.z += lift;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform vec3 uColor;
    uniform float uOpacity;
    varying float vElevation;

    void main() {
      vec3 finalColor = uColor;
      
      // Slight highlight on lifted elements
      float highlight = smoothstep(0.0, 30.0, vElevation);
      // Mix with white for highlight
      finalColor = mix(finalColor, vec3(0.8, 0.8, 1.0), highlight * 0.3);
      
      // Dynamic opacity: slightly more visible when lifted
      float alpha = uOpacity + (highlight * 0.2);
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
);

extend({ HoverMaterial });

// Add type definition for the custom element
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      hoverMaterial: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        transparent?: boolean;
        depthWrite?: boolean;
        uniforms?: Record<string, THREE.IUniform<unknown>>;
        attach?: string;
      };
    }
  }
}

/**
 * Three.js scene rendering the interactive SVG logo background with a custom hover-lift shader.
 */
export default function ThreeBackground() {
  const svgData = useLoader(SVGLoader, '/background.svg');
  
  // Create material once using useMemo instead of useRef to be safe for rendering
  const material = useMemo(() => new HoverMaterial({
    transparent: true,
    depthWrite: false, // Important for transparency sorting issues
    side: THREE.DoubleSide
  }), []);

  const planeRef = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  
  // Global mouse tracker to work over buttons/HTML
  const mouseRef = useRef(new THREE.Vector2(0, 0));

  // Accessibility Check
  const isReducedMotion = useRef(false);

  useEffect(() => {
    // Check reduced motion preference
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      isReducedMotion.current = mediaQuery.matches;
      
      // Mouse Move Listener (Global)
      const handleMouseMove = (event: MouseEvent) => {
        // Convert screen coordinates to normalized device coordinates (NDC) -1 to +1
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = -(event.clientY / window.innerHeight) * 2 + 1;
        mouseRef.current.set(x, y);
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Performance: Merge all geometries into one single mesh
  const mergedGeometry = useMemo(() => {
    const geometries: THREE.BufferGeometry[] = [];

    svgData.paths.forEach((path) => {
      // Filter out non-fill paths if necessary, though 'none' check is good
      if (path.userData?.style?.fill === 'none') return;

      const shapes = SVGLoader.createShapes(path);
      
      shapes.forEach((shape) => {
        // Lower depth slightly for performance/look
        const geometry = new THREE.ExtrudeGeometry(shape, {
          depth: 1, 
          bevelEnabled: false,
          steps: 1 // Reduce vertex count
        });

        // Calculate center for this specific shape
        geometry.computeBoundingBox();
        const box = geometry.boundingBox!;
        const center = new THREE.Vector3();
        box.getCenter(center);

        // Add 'aCenter' attribute
        const count = geometry.attributes.position.count;
        const centers = new Float32Array(count * 3);
        for (let k = 0; k < count; k++) {
          centers[k * 3] = center.x;
          centers[k * 3 + 1] = center.y;
          centers[k * 3 + 2] = center.z; 
        }
        geometry.setAttribute('aCenter', new THREE.BufferAttribute(centers, 3));

        geometries.push(geometry);
      });
    });

    // Merge all geometries into one
    if (geometries.length === 0) return null;
    const merged = BufferGeometryUtils.mergeGeometries(geometries);
    
    // Clean up individual geometries
    geometries.forEach(g => g.dispose());
    
    return merged;
  }, [svgData]);

  // Use a ref to the material inside the effect to avoid "modifying a value passed as argument" lint error
  const shaderRef = useRef(material);
  
  useFrame((state) => {
    if (!shaderRef.current || !mergedGeometry) return;

    // Time Uniform
    shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    
    // Accessibility Override
    if (isReducedMotion.current) {
        shaderRef.current.uniforms.uLiftAmount.value = 0;
        return;
    }

    // Raycasting Logic
    // We use the invisible plane to translate the NDC mouse position (from window listener)
    // to the actual world coordinates of the 3D scene.
    if (planeRef.current && groupRef.current) {
        state.raycaster.setFromCamera(mouseRef.current, state.camera);
        const intersects = state.raycaster.intersectObject(planeRef.current);
        
        if (intersects.length > 0) {
            const point = intersects[0].point;
            // Convert world point to local point inside the scaled group
            const localPoint = groupRef.current.worldToLocal(point.clone());
            
            // Lerp for smoothness (optional, makes interaction feel heavier/classier)
            const currentMouse = shaderRef.current.uniforms.uMouse.value;
            // Lerp towards the new position
            currentMouse.lerp(localPoint, 0.15); 
        }
    }
  });

  if (!mergedGeometry) return null;

  return (
    <group ref={groupRef} scale={[0.01, -0.01, 0.01]} position={[-13.5, 9.25, -5]}>
      {/* Invisible Plane for Raycasting (matches approx size of SVG) */}
      <mesh ref={planeRef} visible={false} position={[1348, 928, 0]}>
         <planeGeometry args={[5000, 5000]} />
      </mesh>

      {/* The Single Merged Mesh */}
      <mesh geometry={mergedGeometry} material={material} />
    </group>
  );
}
