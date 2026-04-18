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

// Animated Holy Laser Beam (firing upward)
const HolyBeam = () => {
  const groupRef = useRef<THREE.Group>(null!);
  const coreRef = useRef<THREE.Mesh>(null!);
  const ringRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Slow divine rotation
    if (groupRef.current) groupRef.current.rotation.y = t * 0.04;

    // Pulse the core like a firing laser
    if (coreRef.current) {
      coreRef.current.material.opacity = Math.sin(t * 8) * 0.3 + 0.85;
    }

    // Fire energy rings upward
    ringRefs.current.forEach((ring, i) => {
      if (ring) {
        ring.position.y += 0.55;
        if (ring.position.y > 35) ring.position.y = -40;
        ring.material.opacity = Math.max(0.1, 1 - Math.abs(ring.position.y) / 50);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Outer beam */}
      <mesh position={[0, -10, 0]}>
        <cylinderGeometry args={[1.4, 2.1, 80, 48, 1, true]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.22} side={THREE.DoubleSide} />
      </mesh>

      {/* Bright pulsing laser core */}
      <mesh ref={coreRef} position={[0, -10, 0]}>
        <cylinderGeometry args={[0.7, 0.9, 80, 48]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.95} />
      </mesh>

      {/* Energy rings firing upward */}
      {Array.from({ length: 14 }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) ringRefs.current[i] = el; }}
          position={[0, -40 + i * 5.5, 0]}
        >
          <ringGeometry args={[2.0, 2.6, 64]} />
          <meshBasicMaterial color="#ffffff" transparent side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Outer glow */}
      <mesh position={[0, -10, 0]}>
        <cylinderGeometry args={[2.8, 3.2, 80, 48, 1, true]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>
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
      pos[i + 1] = Math.random() * -100 - 20;
      pos[i + 2] = (Math.random() - 0.5) * 50;
    }
    return pos;
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < pos.length; i += 3) pos[i] += 0.028;
      if (pos[1] > 40) pos[1] = -100;
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.07} color="#ffffff" transparent opacity={0.5} depthWrite={false} />
    </points>
  );
};

const Scene = forwardRef(({ blocks, currentIndex }: { blocks: any[]; currentIndex: number }, ref) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    focusBlock: (index: number) => {
      const targetY = index * -2.8;
      camera.position.set(5, targetY + 12, 26);
      controlsRef.current?.target.set(0, targetY, 0);
      controlsRef.current?.update();
    }
  }));

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[15, 40, 20]} intensity={2} />
      <pointLight position={[0, 10, 0]} intensity={1.5} />

      <HolyBeam />

      {blocks.map((block, i) => {
        const angle = i * 0.42;
        const radius = 9.6;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius * 0.85;
        const y = i * -2.8;
        return <ChainBlock key={i} position={[x, y, z]} reference={block.reference} isActive={i === currentIndex} />;
      })}

      <FloatingParticles />
      <OrbitControls ref={controlsRef} enablePan enableZoom enableRotate minDistance={15} maxDistance={60} />
    </>
  );
});

const VerseChain3D = forwardRef(({ blocks, currentIndex }: { blocks: any[]; currentIndex: number }, ref) => (
  <Canvas camera={{ position: [6, 18, 30], fov: 36 }} style={{ background: "#000000" }} gl={{ antialias: true }}>
    <Scene ref={ref} blocks={blocks} currentIndex={currentIndex} />
  </Canvas>
));

export default VerseChain3D;
