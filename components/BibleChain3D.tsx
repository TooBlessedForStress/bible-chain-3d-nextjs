"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const exampleBlocks = [
  { id: 1, ref: "Genesis 1:1", version: "KJV", text: "In the beginning God created the heaven and the earth." },
  { id: 2, ref: "John 3:16", version: "KJV", text: "For God so loved the world, that he gave his only begotten Son." },
  { id: 3, ref: "Psalm 23:1", version: "KJV", text: "The Lord is my shepherd; I shall not want." },
  { id: 4, ref: "Romans 8:28", version: "KJV", text: "And we know that all things work together for good..." },
  { id: 5, ref: "Philippians 4:13", version: "KJV", text: "I can do all things through Christ who strengthens me." },
  { id: 6, ref: "Matthew 6:33", version: "KJV", text: "Seek ye first the kingdom of God..." },
];

export function BibleChain3D() {
  return (
    <Canvas 
      camera={{ position: [0, 20, 48], fov: 50 }} 
      style={{ background: "#000000" }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 60, 50]} intensity={1.8} />

      {/* Vertical 3D Glowing Cross */}
      <group position={[0, 0, -78]} rotation={[0, 0.12, 0]}>
        <mesh>
          <boxGeometry args={[5, 145, 5]} />
          <meshPhongMaterial 
            color="#eeeeee" 
            emissive="#aaaaaa" 
            transparent 
            opacity={0.20} 
          />
        </mesh>
        <mesh position={[0, 28, 0]}>
          <boxGeometry args={[72, 5, 5]} />
          <meshPhongMaterial 
            color="#eeeeee" 
            emissive="#aaaaaa" 
            transparent 
            opacity={0.20} 
          />
        </mesh>
      </group>

      {/* The Chain */}
      {exampleBlocks.map((block, i) => {
        const angle = i * 0.29;
        const radius = 12.8;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius * 0.7;
        const y = i * 2.4 - (exampleBlocks.length * 2.4) / 2;

        return (
          <group key={i}>
            {/* Block */}
            <mesh position={[x, y, z]}>
              <boxGeometry args={[2.1, 2.1, 2.1]} />
              <meshPhongMaterial 
                color="#ffffff" 
                emissive="#bbbbbb" 
                shininess={110} 
              />
            </mesh>

            {/* Verse text on block */}
            <mesh position={[x, y + 1.9, z]}>
              <planeGeometry args={[4.8, 1.1]} />
              <meshBasicMaterial color="#111111" />
            </mesh>
          </group>
        );
      })}

      <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} />
    </Canvas>
  );
}
