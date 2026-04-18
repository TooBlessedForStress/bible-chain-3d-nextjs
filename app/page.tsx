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
        <boxGeometry args={[1.9, 1.25, 1.05]} />
        <meshStandardMaterial 
          color={isActive ? "#f0f0f0" : "#d0d0d0"} 
          metalness={0.3}
          roughness={0.7}
          emissive={isActive ? "#444444" : "#000000"}
        />
      </mesh>

      <Text
        position={[0, 0, 0.56]}
        fontSize={0.098}
        color="#111111"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.65}
        outlineWidth={0.012}
        outlineColor="#ffffff"
      >
        {reference}
      </Text>
    </group>
  );
};

// Animated Holy Laser Beam (firing upward like a divine laser)
const HolyBeam = () => {
  const beamGroup = useRef<THREE.Group>(null!);
  const coreRef = useRef<THREE.Mesh>(null!);
  const ringRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Pulse the main beam
    if (coreRef.current) {
      const pulse = Math.sin(t * 6) * 0.15 + 0.85;
      coreRef.current.material.opacity = pulse;
    }

    // Rotate the entire beam slowly
    if (beamGroup.current) {
      beamGroup.current.rotation.y = t * 0.03;
    }

    // Animate energy rings firing upward
    ringRefs.current.forEach((ring, i) => {
      if (ring) {
        ring.position.y += 0.45;
        if (ring.position.y > 30) ring.position.y = -35;
        ring.material.opacity = Math.max(0, 1 - Math.abs(ring.position.y) / 40);
      }
    });
  });

  return (
    <group ref={beamGroup}>
      {/* Main outer beam */}
      <mesh position={[0, -8, 0]}>
        <cylinderGeometry args={[1.4, 2.1, 65, 48, 1, true]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.18} side={THREE.DoubleSide} />
      </mesh>

      {/* Bright pulsing core (the "laser" part) */}
      <mesh ref={coreRef} position={[0, -8, 0]}>
        <cylinderGeometry args={[0.65, 0.85, 65, 48]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>

      {/* Energy rings firing upward (laser effect) */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) ringRefs.current[i] = el;
          }}
          position={[0, -35 + i * 6, 0]}
        >
          <ringGeometry args={[1.8, 2.3, 64]} />
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Very faint outer glow */}
      <mesh position={[0, -8, 0]}>
        <cylinderGeometry args={[2.6, 3.0, 65, 48, 1, true]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

// (FloatingParticles and SparkleParticles stay the same as last version)
const FloatingParticles = () => {
  const pointsRef = useRef<THREE.Points>(null!);
  const particleCount = 1400;

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 50;
      pos[i + 1] = Math.random() * -90 - 20;
      pos[i + 2] = (Math.random() - 0.5) * 45;
    }
    return pos;
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] += 0.025;
        if (pos[i] > 35) pos[i] = -90;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.065} color="#ffffff" transparent opacity={0.5} depthWrite={false} />
    </points>
  );
};

const SparkleParticles = ({ currentIndex, blocks }: { currentIndex: number; blocks: any[] }) => {
  const sparkleRef = useRef<THREE.Points>(null!);
  const count = 90;

  const positions = useMemo(() => new Float32Array(count * 3), []);

  useFrame(() => {
    if (!blocks[currentIndex] || !sparkleRef.current) return;
    const blockY = currentIndex * -2.8;
    const arr = sparkleRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count * 3; i += 3) {
      arr[i] = (Math.random() - 0.5) * 5.5;
      arr[i + 1] = blockY + (Math.random() - 0.5) * 4.2;
      arr[i + 2] = (Math.random() - 0.5) * 5.5;
    }
    sparkleRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={sparkleRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.15} color="#ffffff" transparent opacity={0.85} depthWrite={false} />
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
      if (controlsRef.current) {
        controlsRef.current.target.set(0, targetY, 0);
        controlsRef.current.update();
      }
    }
  }));

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[10, 40, 20]} intensity={1.9} castShadow />
      <pointLight position={[0, 5, 0]} intensity={1.4} color="#ffffff" />

      {/* The animated laser-like Holy Beam */}
      <HolyBeam />

      {/* Blockchain helix wrapping tightly around the beam */}
      {blocks.map((block, i) => {
        const angle = i * 0.42;
        const radius = 9.4;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius * 0.85;
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
        minDistance={15}
        maxDistance={60}
      />
    </>
  );
});

const VerseChain3D = forwardRef(({ blocks, currentIndex }: { blocks: any[]; currentIndex: number }, ref) => {
  return (
    <Canvas 
      camera={{ position: [6, 18, 30], fov: 36 }}
      style={{ background: "#000000" }}
      gl={{ antialias: true }}
    >
      <Scene ref={ref} blocks={blocks} currentIndex={currentIndex} />
    </Canvas>
  );
});

export default VerseChain3D;
