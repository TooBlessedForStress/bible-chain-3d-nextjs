"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function BibleChain3D() {
  return (
    <Canvas 
      camera={{ position: [0, 18, 45], fov: 50 }} 
      style={{ background: "#000000" }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 60, 50]} intensity={1.8} />

      {/* Vertical 3D Cross */}
      <group position={[0, 0, -78]} rotation={[0, 0.12, 0]}>
        <mesh>
          <boxGeometry args={[5, 145, 5]} />
          <meshPhongMaterial color="#eeeeee" emissive="#aaaaaa" transparent opacity={0.20} />
        </mesh>
        <mesh position={[0, 28, 0]}>
          <boxGeometry args={[72, 5, 5]} />
          <meshPhongMaterial color="#eeeeee" emissive="#aaaaaa" transparent opacity={0.20} />
        </mesh>
      </group>

      {/* Example Blocks */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = i * 0.29;
        const radius = 12.8;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius * 0.7;
        const y = i * 2.4 - (6 * 2.4) / 2;

        return (
          <mesh key={i} position={[x, y, z]}>
            <boxGeometry args={[2.1, 2.1, 2.1]} />
            <meshPhongMaterial color="#ffffff" emissive="#bbbbbb" shininess={100} />
          </mesh>
        );
      })}

      <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} />
    </Canvas>
  );
}
