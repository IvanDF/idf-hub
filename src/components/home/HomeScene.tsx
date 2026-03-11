'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh } from 'three';
import { OrbitControls, TorusKnot } from '@react-three/drei';

function Shapes(props: any) {
  const mesh = useRef<Mesh>(null!);
  useFrame((state, delta) => (mesh.current.rotation.x += delta * 0.2));
  
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={1}
      onClick={(event) => console.log('Clicked box')}
      onPointerOver={(event) => (document.body.style.cursor = 'pointer')}
      onPointerOut={(event) => (document.body.style.cursor = 'auto')}
    >
      <TorusKnot args={[1, 0.3, 100, 16]} />
      <meshStandardMaterial color={'#9099FA'} roughness={0.4} metalness={0.1} />
    </mesh>
  );
}

export default function HomeScene() {
  return (
    <div style={{ width: '100%', height: '100vh', background: 'transparent' }}>
      <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Shapes position={[0, 0, 0]} />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
