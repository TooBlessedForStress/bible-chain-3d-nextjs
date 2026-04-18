"use client";

import { BibleChain3D } from "@/components/BibleChain3D";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* 3D Scene - Full height */}
      <div className="flex-1 relative">
        <BibleChain3D />
      </div>

      {/* Simple footer for now */}
      <div className="p-6 text-center text-sm opacity-50 border-t border-white/10">
        The Eternal Chain — Bible verses permanently recorded on Solana
      </div>
    </div>
  );
}
