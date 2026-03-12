'use client';

import { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '@/context/ThemeContext';
import { mindMapData, MindNode } from '@/data/mindMap';
import { motion, AnimatePresence } from 'framer-motion';

// --- Node Component ---
function MindMapNode({ node, isSelected, onClick }: { node: MindNode; isSelected: boolean; onClick: (node: MindNode) => void }) {
  const mesh = useRef<THREE.Mesh>(null!);
  const { theme } = useTheme();
  
  // Skyrim colors: Gold/Amber for active, pale blue/white for inactive
  const baseColor = theme === 'dark' ? '#88ccff' : '#4466aa';
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
          <octahedronGeometry args={[isSelected ? 0.5 : 0.25, 0]} />
          <meshStandardMaterial 
            color={isSelected ? activeColor : baseColor} 
            emissive={isSelected ? glowColor : baseColor}
            emissiveIntensity={isSelected ? 2 : 0.2}
            roughness={0.1}
            metalness={0.9}
            wireframe={!isSelected} // Wireframe for inactive nodes looks like constellations
          />
        </mesh>
        
        {/* Label */}
        <Text
          position={[0, isSelected ? 0.8 : 0.5, 0]}
          fontSize={isSelected ? 0.35 : 0.2}
          font="/fonts/TrajanPro-Regular.ttf" // If available, otherwise default sans
          color={theme === 'dark' ? '#ffffff' : '#000000'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
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
  // Faint white/gold lines
  const lineColor = theme === 'dark' ? '#ffffff' : '#555555';

  const lines = useMemo(() => {
    const segments: JSX.Element[] = [];
    data.forEach(node => {
      node.connections.forEach(targetId => {
        const target = data.find(n => n.id === targetId);
        if (target) {
          segments.push(
            <Line
              key={`${node.id}-${target.id}`}
              points={[node.position, target.position]}
              color={lineColor}
              lineWidth={0.5} // Thinner lines
              transparent
              opacity={0.2} // More subtle
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
      
      {/* Nebula / Starfield Effect (CSS Overlay for now, can be Shader later) */}
      <div style={{
        position: 'absolute',
        top: 0, 
        left: 0,
        width: '100%',
        height: '100%',
        background: theme === 'dark' 
          ? 'radial-gradient(circle at 50% 50%, #1a1a2e 0%, #000000 70%)' 
          : 'radial-gradient(circle at 50% 50%, #ffffff 0%, #e0e0e0 70%)',
        opacity: 0.8,
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        {/* Fog for depth */}
        <fog attach="fog" args={[theme === 'dark' ? '#000000' : '#f0f0f0', 10, 40]} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        {/* Stars */}
        <group>
          {Array.from({ length: 200 }).map((_, i) => (
            <mesh key={i} position={[
              (Math.random() - 0.5) * 60,
              (Math.random() - 0.5) * 60,
              (Math.random() - 0.5) * 60
            ]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshBasicMaterial color={theme === 'dark' ? '#ffffff' : '#aaaaaa'} transparent opacity={Math.random() * 0.5 + 0.2} />
            </mesh>
          ))}
        </group>

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
          maxDistance={30}
          autoRotate={!selectedNode}
          autoRotateSpeed={0.2} // Slower rotation for Skyrim feel
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
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
              pointerEvents: 'auto',
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
              onClick={() => setSelectedNode(null)}
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
        zIndex: 10
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
