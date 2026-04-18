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
        <boxGeometry args={[1.95, 1.3, 1.1]} />
        <meshStandardMaterial color={isActive ? "#f0f0f0" : "#d0d0d0"} metalness={0.35} roughness={0.65} />
      </mesh>
      <Text position={[0, 0, 0.57]} fontSize={0.1} color="#111111" anchorX="center" anchorY="middle" maxWidth={1.7} outlineWidth={0.01} outlineColor="#ffffff">
        {reference}
      </Text>
    </group>
  );
};

// KOTOR Light-Side Beam (animated exactly like your screenshot)
const HolyBeam = () => {
  const groupRef = useRef<THREE.Group>(null!);
  const coreRef = useRef<THREE.Mesh>(null!);
  const ringRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Slow rotation of the whole beam
    if (groupRef.current) groupRef.current.rotation.y = t * 0.03;

    // Pulse the bright core
    if (coreRef.current) {
      coreRef.current.material.opacity = Math.sin(t * 8) * 0.3 + 0.85;
    }

    // Fire the energy rings upward
    ringRefs.current.forEach((ring) => {
      if (ring) {
        ring.position.y += 0.65;
        if (ring.position.y > 40) ring.position.y = -45;
        ring.material.opacity = Math.max(0.2, 1 - Math.abs(ring.position.y) / 55);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Soft outer glow */}
      <mesh position={[0, -15, 0]}>
        <cylinderGeometry args={[1.4, 2.1, 95, 64, 1, true]} />
        <meshBasicMaterial color="#a5f0ff" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>

      {/* Bright pulsing core (the "laser" part) */}
      <mesh ref={coreRef} position={[0, -15, 0]}>
        <cylinderGeometry args={[0.6, 0.8, 95, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.95} />
      </mesh>

      {/* Misty glowing base (KOTOR floor effect) */}
      <mesh position={[0, -33, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[24, 24]} />
        <meshBasicMaterial color="#a5f0ff" transparent opacity={0.55} />
      </mesh>

      {/* Energy rings that fire upward */}
      {Array.from({ length: 18 }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) ringRefs.current[i] = el!; }}
          position={[0, -45 + i * 5.5, 0]}
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
      pos[i] = (Math.random() - 0.5) * 60;
      pos[i + 1] = Math.random() * -120 - 30;
      pos[i + 2] = (Math.random() - 0.5) * 55;
    }
    return pos;
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < pos.length; i += 3) pos[i] += 0.03;
      if (pos[1] > 45) pos[1] = -120;
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.07} color="#a5f0ff" transparent opacity={0.6} depthWrite={false} />
    </points>
  );
};

const Scene = forwardRef(({ blocks, currentIndex }: { blocks: any[]; currentIndex: number }, ref) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    focusBlock: (index: number) => {
      const targetY = index * -2.8;
      camera.position.set(6, targetY + 14, 29);
      controlsRef.current?.target.set(0, targetY, 0);
      controlsRef.current?.update();
    }
  }));

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[20, 50, 30]} intensity={2.4} />
      <pointLight position={[0, 20, 0]} intensity={2} color="#a5f0ff" />

      <HolyBeam />

      {blocks.map((block, i) => {
        const angle = i * 0.42;
        const radius = 10.2;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius * 0.85;
        const y = i * -2.8;
        return <ChainBlock key={i} position={[x, y, z]} reference={block.reference} isActive={i === currentIndex} />;
      })}

      <FloatingParticles />

      <OrbitControls ref={controlsRef} enablePan enableZoom enableRotate minDistance={16} maxDistance={70} />
    </>
  );
});

const VerseChain3D = forwardRef(({ blocks, currentIndex }: { blocks: any[]; currentIndex: number }, ref) => (
  <Canvas camera={{ position: [7, 20, 33], fov: 34 }} style={{ background: "#000000" }} gl={{ antialias: true }}>
    <Scene ref={ref} blocks={blocks} currentIndex={currentIndex} />
  </Canvas>
));

export default VerseChain3D;
