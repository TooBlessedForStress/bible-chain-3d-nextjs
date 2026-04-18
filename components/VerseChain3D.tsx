// components/VerseChain3D.tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Box, Cylinder } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

interface BlockProps {
  position: [number, number, number];
  verse: string;
  reference: string;
}

function ChainBlock({ position, verse, reference }: BlockProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <group position={position}>
      {/* Block */}
      <Box ref={meshRef} args={[1.2, 0.8, 0.8]} castShadow receiveShadow>
        <meshStandardMaterial color="#d4af77" metalness={0.9} roughness={0.2} />
      </Box>
      {/* Verse text on block */}
      <Text
        position={[0, 0, 0.41]}
        fontSize={0.12}
        color="#111111"
        anchorX="center"
        anchorY="middle"
        maxWidth={1}
      >
        {reference}
      </Text>
      {/* Chain link to previous block */}
      <Cylinder args={[0.08, 0.08, 1.5]} position={[0, -1.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#666" />
      </Cylinder>
    </group>
  );
}

export default function VerseChain3D({ blocks }: { blocks: any[] }) {
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [0, 5, 15], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} />

        {/* Helix chain path */}
        {blocks.map((block, i) => {
          const angle = i * 0.4;
          const x = Math.sin(angle) * 4;
          const z = Math.cos(angle) * 4;
          const y = i * -1.8 - 5;
          return (
            <ChainBlock
              key={i}
              position={[x, y, z]}
              verse={block.verse}
              reference={block.reference}
            />
          );
        })}

        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>
    </div>
  );
}
