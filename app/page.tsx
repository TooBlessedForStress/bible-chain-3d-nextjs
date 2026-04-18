"use client";

import { BibleChain3D } from "@/components/BibleChain3D";
import { CreateBlockPanel } from "@/components/CreateBlockPanel";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      {/* 3D Viewer - Takes most of the screen */}
      <div className="flex-1 relative min-h-[600px]">
        <BibleChain3D />
      </div>

      {/* Sidebar Controls */}
      <div className="w-full md:w-96 bg-zinc-950 border-t md:border-l border-white/10 p-6 overflow-auto">
        <CreateBlockPanel />
      </div>
    </div>
  );
}
