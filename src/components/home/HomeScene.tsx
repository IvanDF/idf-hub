'use client';

import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh } from 'three';
import { OrbitControls, RoundedBox } from '@react-three/drei';

function Shapes(props: ThreeElements['mesh']) {
  const mesh = useRef<Mesh>(null!);
  useFrame((state, delta) => {
    mesh.current.rotation.x += delta * 0.2;
    mesh.current.rotation.y += delta * 0.1;
  });
  
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={1}
      onClick={() => console.log('Clicked box')}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    >
      <RoundedBox args={[2, 2, 2]} radius={0.6} smoothness={4}>
        <meshStandardMaterial 
          color={'#9099FA'} 
          roughness={0.2} 
          metalness={0.8}
        />
      </RoundedBox>
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
