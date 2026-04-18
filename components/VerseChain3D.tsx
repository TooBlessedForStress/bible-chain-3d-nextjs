// components/VerseChain3D.tsx
"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { forwardRef, useImperativeHandle, useRef, useMemo } from "react";
import * as THREE from "three";

const ChainBlock = ({ position, reference, isActive }: { position: [number, number, number]; reference: string; isActive: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (meshRef.current && isActive) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.08);
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[1.9, 1.25, 1.05]} />
        <meshStandardMaterial color={isActive ? "#f0f0f0" : "#d0d0d0"} metalness={0.3} roughness={0.7} />
      </mesh>
      <Text position={[0, 0, 0.56]} fontSize={0.098} color="#111111" anchorX="center" anchorY="middle" maxWidth={1.65} outlineWidth={0.012} outlineColor="#ffffff">
        {reference}
      </Text>
    </group>
  );
};

// KOTOR-style Holy Light Beam
const HolyBeam = () => {
  const groupRef = useRef<THREE.Group>(null!);
  const coreRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) groupRef.current.rotation.y = t * 0.03;
    if (coreRef.current) coreRef.current.material.opacity = Math.sin(t * 7) * 0.25 + 0.85;
  });

  return (
    <group ref={groupRef}>
      {/* Tall glowing column (the main KOTOR beam) */}
      <mesh position={[0, -12, 0]}>
        <cylinderGeometry args={[1.1, 1.8, 85, 64, 1, true]} />
        <meshBasicMaterial color="#a5f0ff" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>

      {/* Bright white-blue core */}
      <mesh ref={coreRef} position={[0, -12, 0]}>
        <cylinderGeometry args={[0.55, 0.75, 85, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.95} />
      </mesh>

      {/* Misty glowing base (exactly like KOTOR floor glow) */}
      <mesh position={[0, -28, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 18]} />
        <meshBasicMaterial color="#a5f0ff" transparent opacity={0.45} />
      </mesh>

      {/* Energy rings firing upward */}
      {Array.from({ length: 16 }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) (el as any).userData = { speed: 0.5 + i * 0.05 }; }}
          position={[0, -45 + i * 6, 0]}
        >
          <ringGeometry args={[1.9, 2.4, 64]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
};

const FloatingParticles = () => {
  const pointsRef = useRef<THREE.Points>(null!);
  const count = 1400;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 55;
      pos[i + 1] = Math.random() * -110 - 25;
      pos[i + 2] = (Math.random() - 0.5) * 50;
    }
    return pos;
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < pos.length; i += 3) pos[i] += 0.028;
      if (pos[1] > 40) pos[1] = -110;
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.07} color="#a5f0ff" transparent opacity={0.55} depthWrite={false} />
    </points>
  );
};

const Scene = forwardRef(({ blocks, currentIndex }: { blocks: any[]; currentIndex: number }, ref) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    focusBlock: (index: number) => {
      const targetY = index * -2.8;
      camera.position.set(5, targetY + 13, 27);
      controlsRef.current?.target.set(0, targetY, 0);
      controlsRef.current?.update();
    }
  }));

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[15, 45, 25]} intensity={2.2} />
      <pointLight position={[0, 15, 0]} intensity={1.8} color="#a5f0ff" />

      <HolyBeam />

      {blocks.map((block, i) => {
        const angle = i * 0.42;
        const radius = 9.8;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius * 0.85;
        const y = i * -2.8;
        return <ChainBlock key={i} position={[x, y, z]} reference={block.reference} isActive={i === currentIndex} />;
      })}

      <FloatingParticles />

      <OrbitControls ref={controlsRef} enablePan enableZoom enableRotate minDistance={16} maxDistance={65} />
    </>
  );
});

const VerseChain3D = forwardRef(({ blocks, currentIndex }: { blocks: any[]; currentIndex: number }, ref) => (
  <Canvas camera={{ position: [6, 19, 32], fov: 35 }} style={{ background: "#000000" }} gl={{ antialias: true }}>
    <Scene ref={ref} blocks={blocks} currentIndex={currentIndex} />
  </Canvas>
));

export default VerseChain3D;
