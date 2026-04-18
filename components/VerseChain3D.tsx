// components/VerseChain3D.tsx
"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { forwardRef, useImperativeHandle, useRef, useMemo } from "react";
import * as THREE from "three";

const ChainBlock = ({ position, reference, isActive }: { position: [number, number, number]; reference: string; isActive: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (meshRef.current && isActive) meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.08);
  });
  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[1.95, 1.3, 1.1]} />
        <meshStandardMaterial color={isActive ? "#f0f0f0" : "#d0d0d0"} metalness={0.35} roughness={0.65} />
      </mesh>
      <Text position={[0, 0, 0.57]} fontSize={0.1} color="#111111" anchorX="center" anchorY="middle" maxWidth={1.7} outlineWidth={0.01} outlineColor="#ffffff">
        {reference}
      </Text>
    </group>
  );
};

const HolyBeam = () => {
  const groupRef = useRef<THREE.Group>(null!);
  const coreRef = useRef<THREE.Mesh>(null!);
  const ringRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) groupRef.current.rotation.y = t * 0.025;
    if (coreRef.current) coreRef.current.material.opacity = Math.sin(t * 8) * 0.3 + 0.85;
    ringRefs.current.forEach((ring) => {
      if (ring) {
        ring.position.y += 0.75;          // rings fire UPWARD
        if (ring.position.y > 45) ring.position.y = -48;
        ring.material.opacity = Math.max(0.2, 1 - Math.abs(ring.position.y) / 60);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Outer soft cyan glow */}
      <mesh position={[0, -18, 0]}>
        <cylinderGeometry args={[1.45, 2.2, 110, 64, 1, true]} />
        <meshBasicMaterial color="#a5f0ff" transparent opacity={0.38} side={THREE.DoubleSide} />
      </mesh>

      {/* Bright pulsing white-blue core (KOTOR style) */}
      <mesh ref={coreRef} position={[0, -18, 0]}>
        <cylinderGeometry args={[0.62, 0.82, 110, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.95} />
      </mesh>

      {/* Misty glowing base (KOTOR floor) */}
      <mesh position={[0, -37, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, 26]} />
        <meshBasicMaterial color="#a5f0ff" transparent opacity={0.6} />
      </mesh>

      {/* Energy rings firing upward */}
      {Array.from({ length: 22 }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) ringRefs.current[i] = el!; }}
          position={[0, -50 + i * 5.5, 0]}
        >
          <ringGeometry args={[1.9, 2.5, 64]} />
          <meshBasicMaterial color="#ffffff" transparent side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
};

const FloatingParticles = () => {
  const pointsRef = useRef<THREE.Points>(null!);
  const count = 1600;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 65;
      pos[i + 1] = Math.random() * -130 - 35;
      pos[i + 2] = (Math.random() - 0.5) * 60;
    }
    return pos;
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < pos.length; i += 3) pos[i] += 0.032;
      if (pos[1] > 50) pos[1] = -130;
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.065} color="#a5f0ff" transparent opacity={0.6} depthWrite={false} />
    </points>
  );
};

const Scene = forwardRef(({ blocks, currentIndex }: { blocks: any[]; currentIndex: number }, ref) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    focusBlock: (index: number) => {
      const targetY = index * -2.8;
      camera.position.set(6, targetY + 15, 30);
      controlsRef.current?.target.set(0, targetY, 0);
      controlsRef.current?.update();
    }
  }));

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[20, 55, 30]} intensity={2.5} />
      <pointLight position={[0, 25, 0]} intensity={2.2} color="#a5f0ff" />

      <HolyBeam />

      {blocks.map((block, i) => {
        const angle = i * 0.42;
        const radius = 10.5;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius * 0.85;
        const y = i * -2.8;
        return <ChainBlock key={i} position={[x, y, z]} reference={block.reference} isActive={i === currentIndex} />;
      })}

      <FloatingParticles />

      <OrbitControls ref={controlsRef} enablePan enableZoom enableRotate minDistance={18} maxDistance={75} />
    </>
  );
});

const VerseChain3D = forwardRef(({ blocks, currentIndex }: { blocks: any[]; currentIndex: number }, ref) => (
  <Canvas camera={{ position: [8, 22, 35], fov: 34 }} style={{ background: "#000000" }} gl={{ antialias: true }}>
    <Scene ref={ref} blocks={blocks} currentIndex={currentIndex} />
  </Canvas>
));

export default VerseChain3D;
