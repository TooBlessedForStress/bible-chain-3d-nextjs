"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface Block {
  id: number;
  ref: string;
  version: string;
  text: string;
  creator: string;
}

export function BibleChain3D({ programId }: { programId: string }) {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: 1, ref: "Genesis 1:1", version: "KJV", text: "In the beginning God created the heaven and the earth.", creator: "7x...a1b2" },
    { id: 2, ref: "John 3:16", version: "KJV", text: "For God so loved the world...", creator: "9y...c3d4" },
    { id: 3, ref: "Psalm 23:1", version: "KJV", text: "The Lord is my shepherd...", creator: "3z...e5f6" },
  ]);

  return (
    <Canvas camera={{ position: [0, 15, 45], fov: 50 }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 60, 50]} intensity={1.8} />
      
      {/* Vertical 3D Cross */}
      <group position={[0, 0, -80]} rotation={[0, 0.12, 0]}>
        <mesh>
          <boxGeometry args={[6, 140, 6]} />
          <meshPhongMaterial color="#eeeeee" emissive="#aaaaaa" transparent opacity={0.22} />
        </mesh>
        <mesh position={[0, 28, 0]}>
          <boxGeometry args={[72, 6, 6]} />
          <meshPhongMaterial color="#eeeeee" emissive="#aaaaaa" transparent opacity={0.22} />
        </mesh>
      </group>

      {/* Chain */}
      {blocks.map((block, i) => {
        const angle = i * 0.28;
        const radius = 12;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius * 0.7;
        const y = i * 2.3 - (blocks.length * 2.3) / 2;

        return (
          <group key={block.id} position={[x, y, z]}>
            {/* Block */}
            <mesh>
              <boxGeometry args={[2, 2, 2]} />
              <meshPhongMaterial color="#ffffff" emissive="#cccccc" shininess={120} />
            </mesh>

            {/* Verse text on top of block */}
            <Text
              position={[0, 1.8, 0]}
              fontSize={0.45}
              color="#111111"
              anchorX="center"
              anchorY="middle"
              font="/fonts/georgia.woff"
            >
              {block.ref}
            </Text>
          </group>
        );
      })}

      <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} />
    </Canvas>
  );
}
