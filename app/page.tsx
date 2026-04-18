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
      {/* 3D Scene - Takes almost the entire screen */}
      <div className="flex-1 relative min-h-[700px] lg:min-h-screen">
        <BibleChain3D />
      </div>

      {/* Sidebar - Fixed width on large screens, full width on mobile */}
      <div className="w-full lg:w-96 bg-zinc-950 border-t lg:border-l border-white/10 p-8 overflow-auto lg:min-h-screen">
        <CreateBlockPanel />
      </div>
    </div>
  );
}
