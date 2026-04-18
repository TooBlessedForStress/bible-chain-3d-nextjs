// components/VerseChain3D.tsx
"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { forwardRef, useImperativeHandle, useRef } from "react";
import * as THREE from "three";

interface BlockProps {
  position: [number, number, number];
  reference: string;
  isActive: boolean;
}

const ChainBlock = ({ position, reference, isActive }: BlockProps) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (meshRef.current && isActive) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.08);
    }
  });

  return (
    <group position={position}>
      {/* Main Block */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[1.8, 1.2, 1.0]} />
        <meshStandardMaterial 
          color={isActive ? "#ffffff" : "#cccccc"} 
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* Reference Text on Block */}
      <Text
        position={[0, 0, 0.51]}
        fontSize={0.11}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.6}
        font="/fonts/inter.woff" // fallback if needed
      >
        {reference}
      </Text>
    </group>
  );
};

const Scene = forwardRef(({ blocks, currentIndex }: { blocks: any[]; currentIndex: number }, ref) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    focusBlock: (index: number) => {
      const targetY = index * -2.8;
      camera.position.set(0, targetY + 8, 18);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, targetY, 0);
        controlsRef.current.update();
      }
    }
  }));

  // Auto-focus first block on load
  useFrame(() => {
    if (blocks.length > 0 && currentIndex === 0) {
      camera.position.set(0, 6, 22);
    }
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 20, 5]} intensity={1.5} castShadow />
      <pointLight position={[-15, -10, -10]} intensity={0.6} />

      {blocks.map((block, i) => {
        const angle = i * 0.45;
        const radius = 6.5;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius * 0.7;
        const y = i * -2.8;

        return (
          <ChainBlock
            key={i}
            position={[x, y, z]}
            reference={block.reference}
            isActive={i === currentIndex}
          />
        );
      })}

      <OrbitControls 
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={8}
        maxDistance={40}
        target={[0, 0, 0]}
      />
    </>
  );
});

const VerseChain3D = forwardRef(({ blocks, currentIndex }: { blocks: any[]; currentIndex: number }, ref) => {
  return (
    <Canvas 
      camera={{ position: [0, 10, 25], fov: 42 }}
      style={{ background: "#000000" }}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
    >
      <Scene ref={ref} blocks={blocks} currentIndex={currentIndex} />
    </Canvas>
  );
});

export default VerseChain3D;
