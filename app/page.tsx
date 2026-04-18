"use client";

import dynamic from 'next/dynamic';

const BibleChain3D = dynamic(
  () => import('@/components/BibleChain3D'),
  { ssr: false }
);

const CreateBlockPanel = dynamic(
  () => import('@/components/CreateBlockPanel'),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row overflow-hidden">
      {/* 3D Scene - Full height and flexible width */}
      <div className="flex-1 relative h-screen lg:min-h-screen">
        <BibleChain3D />
      </div>

      {/* Sidebar - Right side on desktop */}
      <div className="w-full lg:w-96 bg-zinc-950 border-t lg:border-l border-white/10 p-8 overflow-auto">
        <CreateBlockPanel />
      </div>
    </div>
  );
}
