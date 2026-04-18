"use client";

import dynamic from 'next/dynamic';

const BibleChain3D = dynamic(
  () => import('@/components/BibleChain3D'),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row">
      {/* 3D Scene */}
      <div className="flex-1 relative min-h-[600px]">
        <BibleChain3D />
      </div>

      {/* Simple Sidebar for now */}
      <div className="w-full lg:w-96 bg-zinc-950 border-t lg:border-l border-white/10 p-8">
        <h2 className="text-3xl font-bold mb-6">Mint New Verse</h2>
        <p className="opacity-70">The full control panel will be added next.</p>
      </div>
    </div>
  );
}
