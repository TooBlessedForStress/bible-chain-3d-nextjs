"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export function BibleChain3D() {
  return (
    <Canvas camera={{ position: [0, 15, 45] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      {/* Simple placeholder box for now */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4, 4, 4]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <OrbitControls />
    </Canvas>
  );
}
