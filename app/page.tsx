"use client";

import dynamic from 'next/dynamic';

const BibleChain3D = dynamic(
  () => import('@/components/BibleChain3D'),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <div style={{ height: "100vh", width: "100%" }}>
        <BibleChain3D />
      </div>
    </div>
  );
}
