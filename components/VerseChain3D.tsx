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
      {/* Parchment / ancient tablet style block */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[1.95, 1.3, 1.1]} />
        <meshStandardMaterial 
          color="#f5f0e8" 
          metalness={0.15} 
          roughness={0.85}
          emissive="#3a2f1f"
          emissiveIntensity={isActive ? 0.15 : 0}
        />
      </mesh>

      {/* Verse text - elegant and readable */}
      <Text
        position={[0, 0, 0.57]}
        fontSize={0.098}
        color="#1a140f"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.65}
        outlineWidth={0.008}
        outlineColor="#f5e8c7"
      >
        {reference}
      </Text>
    </group>
  );
};

const HolyBeam = () => {
  const groupRef = useRef<THREE.Group>(null!);
  const coreRef = useRef<THREE.Mesh>(null!);
  const rayRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) groupRef.current.rotation.y = t * 0.025;
    if (coreRef.current) coreRef.current.material.opacity = Math.sin(t * 8) * 0.3 + 0.85;
    rayRefs.current.forEach((ray) => {
      if (ray) {
        ray.position.y += ray.userData.speed || 0.8;
        if (ray.position.y > 50) ray.position.y = -50;
        ray.material.opacity = Math.max(0.15, 1 - Math.abs(ray.position.y) / 70);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Central divine core - warm golden-white */}
      <mesh ref={coreRef} position={[0, -18, 0]}>
        <cylinderGeometry args={[0.65, 0.85, 110, 64]} />
        <meshBasicMaterial color="#f5e8c7" transparent opacity={0.95} />
      </mesh>

      {/* Hundreds of individual light beams firing upward */}
      {Array.from({ length: 120 }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) rayRefs.current[i] = el!; }}
          position={[
            (Math.random() - 0.5) * 4,
            -50 + i * 0.9,
            (Math.random() - 0.5) * 4
          ]}
          userData={{ speed: 0.6 + Math.random() * 0.8 }}
        >
          <cylinderGeometry args={[0.04, 0.08, 12, 8]} />
          <meshBasicMaterial color="#f5e8c7" transparent opacity={0.7} />
        </mesh>
      ))}

      {/* Misty sacred base */}
      <mesh position={[0, -37, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[28, 28]} />
        <meshBasicMaterial color="#f5e8c7" transparent opacity={0.55} />
      </mesh>
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
      <pointsMaterial size={0.065} color="#f5e8c7" transparent opacity={0.6} depthWrite={false} />
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
      <pointLight position={[0, 25, 0]} intensity={2.2} color="#f5e8c7" />

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
