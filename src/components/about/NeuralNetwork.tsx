'use client';

import { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Line, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '@/context/ThemeContext';
import { mindMapData, MindNode } from '@/data/mindMap';
import { motion, AnimatePresence } from 'framer-motion';

// --- Nebula Shader Component ---
const NebulaBackground = () => {
  const { theme } = useTheme();
  
  // Custom shader for nebula effect
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color(theme === 'dark' ? '#000000' : '#ffffff') },
    uColor2: { value: new THREE.Color(theme === 'dark' ? '#1a0b2e' : '#e0e0ff') },
    uColor3: { value: new THREE.Color(theme === 'dark' ? '#330033' : '#ccccff') },
  }), [theme]);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.getElapsedTime();
    uniforms.uColor1.value.set(theme === 'dark' ? '#000000' : '#f0f8ff');
    uniforms.uColor2.value.set(theme === 'dark' ? '#1a0b2e' : '#e6e6fa');
    uniforms.uColor3.value.set(theme === 'dark' ? '#4a148c' : '#b0c4de');
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
      float noise = snoise(vUv * 3.0 + uTime * 0.1);
      float noise2 = snoise(vUv * 6.0 - uTime * 0.15);
      
      vec3 color = mix(uColor1, uColor2, noise * 0.5 + 0.5);
      color = mix(color, uColor3, noise2 * 0.3);
      
      // Vignette
      float dist = distance(vUv, vec2(0.5));
      color *= 1.0 - dist * 0.6;
      
      // Make it circular/fade edges to avoid hard square
      float alpha = smoothstep(0.5, 0.2, dist); 

      gl_FragColor = vec4(color, alpha);
    }
  `;

  return (
    <mesh position={[0, 0, -50]} scale={[100, 100, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        transparent={true} // Enable transparency for the alpha fade
      />
    </mesh>
  );
};

// --- Node Component ---
function MindMapNode({ node, isSelected, onClick }: { node: MindNode; isSelected: boolean; onClick: (node: MindNode) => void }) {
  const mesh = useRef<THREE.Mesh>(null!);
  const { theme } = useTheme();
  
  // Colors - Brighter for better visibility
  const baseColor = theme === 'dark' ? '#4488ff' : '#2244aa';
  const activeColor = '#ffcc00'; // Gold
  const glowColor = '#ffaa00';

  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x += delta * 0.1;
      mesh.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group position={new THREE.Vector3(...node.position)}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh 
          ref={mesh} 
          onClick={(e) => { e.stopPropagation(); onClick(node); }}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
          {/* Use Octahedron for more mystical/crystal look */}
          <octahedronGeometry args={[isSelected ? 0.6 : 0.3, 0]} />
          <meshStandardMaterial 
            color={isSelected ? activeColor : baseColor} 
            emissive={isSelected ? glowColor : baseColor}
            emissiveIntensity={isSelected ? 2.5 : 0.8}
            roughness={0.2}
            metalness={0.8}
            wireframe={!isSelected} 
          />
        </mesh>
        
        {/* Label - REMOVED custom font to ensure rendering */}
        <Text
          position={[0, isSelected ? 0.9 : 0.6, 0]}
          fontSize={isSelected ? 0.4 : 0.25}
          color={theme === 'dark' ? '#ffffff' : '#000000'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor={theme === 'dark' ? '#000' : '#fff'}
        >
          {node.label}
        </Text>
      </Float>
    </group>
  );
}

// --- Connections Component ---
function Connections({ data }: { data: MindNode[] }) {
  const { theme } = useTheme();
  // Brighter lines
  const lineColor = theme === 'dark' ? '#88ccff' : '#4466aa';

  const lines = useMemo(() => {
    const segments: React.ReactNode[] = [];
    data.forEach(node => {
      node.connections.forEach(targetId => {
        const target = data.find(n => n.id === targetId);
        if (target) {
          segments.push(
            <Line
              key={`${node.id}-${target.id}`}
              points={[node.position, target.position]}
              color={lineColor}
              lineWidth={1} // Thicker lines
              transparent
              opacity={0.4} // More visible
              dashed={false}
            />
          );
        }
      });
    });
    return segments;
  }, [data, lineColor]);

  return <group>{lines}</group>;
}

// --- Main Scene Component ---
export default function NeuralNetwork() {
  const [selectedNode, setSelectedNode] = useState<MindNode | null>(null);
  const { theme } = useTheme();

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden', background: theme === 'dark' ? '#000' : '#f0f0f0' }}>
      
      {/* 3D Canvas */}
      <Canvas 
        camera={{ position: [0, 0, 18], fov: 60 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
      >
        <fog attach="fog" args={[theme === 'dark' ? '#050505' : '#f0f0f0', 10, 50]} />
        
        {/* Lights */}
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#4488ff" />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <NebulaBackground />

        {/* Nodes & Connections */}
        <group>
            {mindMapData.map(node => (
            <MindMapNode 
                key={node.id} 
                node={node} 
                isSelected={selectedNode?.id === node.id} 
                onClick={setSelectedNode} 
            />
            ))}
            <Connections data={mindMapData} />
        </group>

        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          minDistance={5} 
          maxDistance={40}
          autoRotate={!selectedNode}
          autoRotateSpeed={0.3}
        />
      </Canvas>

      {/* UI Overlay for Node Details */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: theme === 'dark' ? 'rgba(10, 10, 10, 0.8)' : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              padding: '24px',
              borderRadius: '16px',
              border: `1px solid ${theme === 'dark' ? '#333' : '#ddd'}`,
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              pointerEvents: 'auto', // Allow clicking buttons inside
              zIndex: 100, // Ensure it's above the canvas
            }}
          >
            <h3 style={{ 
              margin: '0 0 8px 0', 
              color: theme === 'dark' ? '#fff' : '#000',
              fontFamily: 'var(--font-josefin-sans)',
              textTransform: 'uppercase',
              fontSize: '1.5rem'
            }}>
              {selectedNode.label}
            </h3>
            <p style={{ 
              margin: 0, 
              color: theme === 'dark' ? '#aaa' : '#555',
              lineHeight: 1.5 
            }}>
              {selectedNode.description}
            </p>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedNode(null);
              }}
              style={{
                marginTop: '16px',
                background: 'transparent',
                border: `1px solid ${theme === 'dark' ? '#333' : '#ddd'}`,
                padding: '8px 16px',
                borderRadius: '20px',
                color: theme === 'dark' ? '#fff' : '#000',
                cursor: 'pointer',
                fontSize: '0.8rem',
                textTransform: 'uppercase'
              }}
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Title Overlay */}
      <div style={{
        position: 'absolute',
        top: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        pointerEvents: 'none',
        zIndex: 100
      }}>
        <h1 style={{
          fontFamily: 'var(--font-josefin-sans)', // Trajan Pro would be better here
          fontSize: '2.5rem',
          color: theme === 'dark' ? '#eebb00' : '#222', // Gold tint
          textTransform: 'uppercase',
          letterSpacing: '8px',
          opacity: 0.9,
          textShadow: '0 0 20px rgba(238, 187, 0, 0.5)'
        }}>
          CONSTELLATION
        </h1>
        <p style={{
          fontSize: '1rem',
          color: theme === 'dark' ? '#aaa' : '#666',
          marginTop: '8px',
          letterSpacing: '4px',
          textTransform: 'uppercase'
        }}>
          SKILL TREE
        </p>
      </div>
    </div>
  );
}
