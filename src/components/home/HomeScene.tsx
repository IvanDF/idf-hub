'use client';

import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { Mesh, Group } from 'three';
import { OrbitControls, RoundedBox } from '@react-three/drei';
import { useTheme } from '@/context/ThemeContext';

function Shapes(props: ThreeElements['group']) {
  const mesh = useRef<Mesh>(null!);
  const group = useRef<Group>(null!);
  const { theme } = useTheme();
  
  // Gyroscope / Mouse Parallax State
  const mouse = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    // Mouse movement handler for desktop parallax
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    // Device orientation handler for mobile gyroscope
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta === null || event.gamma === null) return;
      // Beta: Front to back tilt [-180, 180]
      // Gamma: Left to right tilt [-90, 90]
      // Normalize to stronger range [-1, 1] for more impact
      mouse.current.x = event.gamma / 25; 
      mouse.current.y = event.beta / 25;
    };

    window.addEventListener('mousemove', handleMouseMove);
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  useFrame((state, delta) => {
    if (mesh.current) {
        // Continuous rotation of the shape itself
        mesh.current.rotation.x += delta * 0.2;
        mesh.current.rotation.y += delta * 0.1;
    }

    if (group.current) {
        // Parallax effect on the group container
        // Smoothly interpolate current rotation to target mouse/gyro rotation
        const targetRotationX = mouse.current.y * 0.5;
        const targetRotationY = mouse.current.x * 0.5;

        group.current.rotation.x += (targetRotationX - group.current.rotation.x) * delta * 2;
        group.current.rotation.y += (targetRotationY - group.current.rotation.y) * delta * 2;
    }
  });

  const materialColor = theme === 'dark' ? '#9099FA' : '#5D6BF8';
  
  return (
    <group ref={group} {...props}>
        <mesh
        ref={mesh}
        scale={1}
        onClick={() => console.log('Clicked box')}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
        <RoundedBox args={[2, 2, 2]} radius={0.6} smoothness={4}>
            <meshStandardMaterial 
            color={materialColor} 
            roughness={0.2} 
            metalness={0.8}
            />
        </RoundedBox>
        </mesh>
    </group>
  );
}

export default function HomeScene() {
  return (
    <div 
      style={{ width: '100%', height: '100vh', background: 'transparent' }}
      role="img" 
      aria-label="Interactive 3D scene showing a floating geometric shape"
    >
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
