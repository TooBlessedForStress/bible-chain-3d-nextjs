"use client";

import { BibleChain3D } from "@/components/BibleChain3D";
import { CreateBlockPanel } from "@/components/CreateBlockPanel";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row">
      {/* 3D Scene */}
      <div className="flex-1 relative min-h-[600px]">
        <BibleChain3D />
      </div>

      {/* Control Sidebar */}
      <div className="w-full lg:w-96 bg-zinc-950 border-t lg:border-l border-white/10 p-8 overflow-auto">
        <CreateBlockPanel />
      </div>
    </div>
  );
}
