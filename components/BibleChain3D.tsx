"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";

const exampleBlocks = [
  { id: 1, ref: "Genesis 1:1", version: "KJV", text: "In the beginning God created the heaven and the earth." },
  { id: 2, ref: "John 3:16", version: "KJV", text: "For God so loved the world, that he gave his only begotten Son." },
  { id: 3, ref: "Psalm 23:1", version: "KJV", text: "The Lord is my shepherd; I shall not want." },
  { id: 4, ref: "Romans 8:28", version: "KJV", text: "And we know that all things work together for good..." },
  { id: 5, ref: "Philippians 4:13", version: "KJV", text: "I can do all things through Christ who strengthens me." },
  { id: 6, ref: "Matthew 6:33", version: "KJV", text: "Seek ye first the kingdom of God..." },
];

function HolyParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 350;

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i += 3) {
    positions[i]     = (Math.random() - 0.5) * 120;
    positions[i + 1] = (Math.random() - 0.5) * 80;
    positions[i + 2] = (Math.random() - 0.5) * 120;
  }

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03;
      pointsRef.current.material.opacity = 0.4 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.35} color="#dddddd" transparent opacity={0.6} />
    </points>
  );
}

export default function BibleChain3D() {
  return (
    <Canvas 
      camera={{ position: [0, 25, 55], fov: 45 }} 
      style={{ background: "#000000", width: "100%", height: "100%" }}
    >
      {/* Atmospheric fog for AAA depth */}
      <fog attach="fog" args={["#000000", 40, 140]} />

      {/* Dramatic cinematic lighting */}
      <ambientLight intensity={0.25} />
      <pointLight position={[0, 80, 60]} intensity={2.2} color="#ffffff" />
      <pointLight position={[-40, 30, -50]} intensity={0.8} color="#dddddd" />

      {/* Vertical 3D Cross - more dramatic */}
      <group position={[0, 0, -85]} rotation={[0, 0.15, 0]}>
        <mesh>
          <boxGeometry args={[6, 160, 6]} />
          <meshPhongMaterial color="#eeeeee" emissive="#aaaaaa" transparent opacity={0.28} shininess={20} />
        </mesh>
        <mesh position={[0, 32, 0]}>
          <boxGeometry args={[82, 6, 6]} />
          <meshPhongMaterial color="#eeeeee" emissive="#aaaaaa" transparent opacity={0.28} shininess={20} />
        </mesh>
      </group>

      {/* Holy light particles (AAA atmosphere) */}
      <HolyParticles />

      {/* The Chain */}
      {exampleBlocks.map((block, i) => {
        const angle = i * 0.29;
        const radius = 13.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius * 0.72;
        const y = i * 2.6 - (exampleBlocks.length * 2.6) / 2;

        return (
          <group key={i}>
            <mesh position={[x, y, z]}>
              <boxGeometry args={[2.3, 2.3, 2.3]} />
              <meshPhongMaterial 
                color="#ffffff" 
                emissive="#cccccc" 
                shininess={130} 
              />
            </mesh>

            {/* Verse text on block */}
            <mesh position={[x, y + 2.0, z]}>
              <planeGeometry args={[5, 1.2]} />
              <meshBasicMaterial color="#111111" />
            </mesh>
          </group>
        );
      })}

      <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} />
    </Canvas>
  );
}
