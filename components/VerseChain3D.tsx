// components/VerseChain3D.tsx
"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { forwardRef, useImperativeHandle, useRef, useMemo } from "react";
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
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[2.0, 1.3, 1.1]} />
        <meshStandardMaterial 
          color={isActive ? "#ffffff" : "#bbbbbb"} 
          metalness={0.15}
          roughness={0.85}
        />
      </mesh>

      <Text
        position={[0, 0, 0.56]}
        fontSize={0.095}
        color="#111111"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.7}
        outlineWidth={0.01}
        outlineColor="#eeeeee"
      >
        {reference}
      </Text>
    </group>
  );
};

const FloatingParticles = () => {
  const pointsRef = useRef<THREE.Points>(null!);
  const particleCount = 1200;

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 45;
      pos[i + 1] = Math.random() * -80 - 15;
      pos[i + 2] = (Math.random() - 0.5) * 40;
    }
    return pos;
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] += 0.022;
        if (pos[i] > 30) pos[i] = -80;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.07} color="#ffffff" transparent opacity={0.45} depthWrite={false} />
    </points>
  );
};

const SparkleParticles = ({ currentIndex, blocks }: { currentIndex: number; blocks: any[] }) => {
  const sparkleRef = useRef<THREE.Points>(null!);
  const count = 80;

  const positions = useMemo(() => new Float32Array(count * 3), []);

  useFrame(() => {
    if (!blocks[currentIndex] || !sparkleRef.current) return;
    const blockY = currentIndex * -2.8;
    const arr = sparkleRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count * 3; i += 3) {
      arr[i] = (Math.random() - 0.5) * 5;
      arr[i + 1] = blockY + (Math.random() - 0.5) * 4;
      arr[i + 2] = (Math.random() - 0.5) * 5;
    }
    sparkleRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={sparkleRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.13} color="#ffffff" transparent opacity={0.9} depthWrite={false} />
    </points>
  );
};

const Scene = forwardRef(({ blocks, currentIndex }: { blocks: any[]; currentIndex: number }, ref) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    focusBlock: (index: number) => {
      const targetY = index * -2.8;
      camera.position.set(0, targetY + 10, 22);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, targetY, 0);
        controlsRef.current.update();
      }
    }
  }));

  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight position={[15, 30, 15]} intensity={1.6} castShadow />
      <pointLight position={[-20, -20, -20]} intensity={0.7} />

      {blocks.map((block, i) => {
        const angle = i * 0.42;
        const radius = 8.5;           // Increased for better helix visibility
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius * 0.8;
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

      <FloatingParticles />
      <SparkleParticles currentIndex={currentIndex} blocks={blocks} />

      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={12}
        maxDistance={50}
      />
    </>
  );
});

const VerseChain3D = forwardRef(({ blocks, currentIndex }: { blocks: any[]; currentIndex: number }, ref) => {
  return (
    <Canvas 
      camera={{ position: [0, 15, 28], fov: 38 }}
      style={{ background: "#000000" }}
      gl={{ antialias: true }}
    >
      <Scene ref={ref} blocks={blocks} currentIndex={currentIndex} />
    </Canvas>
  );
});

export default VerseChain3D;
