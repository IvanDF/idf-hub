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
  
  const baseColor = theme === 'dark' ? '#00f0ff' : '#0055ff';
  const activeColor = theme === 'dark' ? '#ff0055' : '#ff4400';

  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x += delta * 0.2;
      mesh.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group position={new THREE.Vector3(...node.position)}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh 
          ref={mesh} 
          onClick={(e) => { e.stopPropagation(); onClick(node); }}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
          <sphereGeometry args={[isSelected ? 0.4 : 0.2, 32, 32]} />
          <meshStandardMaterial 
            color={isSelected ? activeColor : baseColor} 
            emissive={isSelected ? activeColor : baseColor}
            emissiveIntensity={isSelected ? 2 : 0.5}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        
        {/* Label */}
        <Text
          position={[0, isSelected ? 0.7 : 0.4, 0]}
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
  const lineColor = theme === 'dark' ? '#333' : '#ccc';

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
              lineWidth={1}
              transparent
              opacity={0.3}
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
    <div style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <color attach="background" args={[theme === 'dark' ? '#050505' : '#f0f0f0']} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
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
          autoRotateSpeed={0.5}
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
          fontFamily: 'var(--font-josefin-sans)',
          fontSize: '2rem',
          color: theme === 'dark' ? '#fff' : '#000',
          textTransform: 'uppercase',
          letterSpacing: '4px',
          opacity: 0.8
        }}>
          Neural Constellation
        </h1>
        <p style={{
          fontSize: '0.9rem',
          color: theme === 'dark' ? '#888' : '#666',
          marginTop: '8px'
        }}>
          Interactive Mind Map // Drag to Explore
        </p>
      </div>
    </div>
  );
}
