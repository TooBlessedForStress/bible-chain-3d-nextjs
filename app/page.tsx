// app/page.tsx
"use client";

import { useState } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import VerseChain3D from "@/components/VerseChain3D";
import { bibleData, getRandomUnusedVerse, type BibleVersion } from "@/lib/verses";
import { connection } from "@/lib/solana";
import "@solana/wallet-adapter-react-ui/styles.css";

export default function Home() {
  const [selectedVersion, setSelectedVersion] = useState<BibleVersion>("KJV");
  const [blocks, setBlocks] = useState<any[]>([
    { 
      id: 1, 
      reference: "Genesis 1:1", 
      verse: "In the beginning God created the heaven and the earth." 
    },
  ]);
  const [usedIds, setUsedIds] = useState<number[]>([]);
  const [showControls, setShowControls] = useState(true); // toggle for clean look

  const wallets = [new PhantomWalletAdapter()];

  const createNewBlock = () => {
    const verse = getRandomUnusedVerse(selectedVersion, usedIds);
    if (!verse) {
      alert("No more verses left in this version!");
      return;
    }

    setBlocks((prev) => [...prev, { 
      id: Date.now(), 
      reference: verse.reference, 
      verse: verse.text 
    }]);
    setUsedIds((prev) => [...prev, verse.id]);

    alert(`✅ New Block Added to the Chain!\n\nVerse: ${verse.reference}\n\n+10 HOLY tokens rewarded\n0.002 SOL fee sent to liquidity pool`);
  };

  return (
    <ConnectionProvider endpoint={connection.rpcEndpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative">
            
            {/* Top Header - Minimal & Elegant */}
            <header className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center p-6 bg-black/70 backdrop-blur-md border-b border-[#d4af77]/20">
              <h1 className="text-4xl font-bold tracking-tighter flex items-center gap-3">
                <span className="text-[#d4af77]">✝️</span> VERSECHAIN
              </h1>
              
              <div className="flex items-center gap-4">
                <WalletMultiButton className="!bg-[#d4af77] !text-black hover:!scale-105 transition-all font-semibold px-6 py-3 rounded-2xl" />
                <button
                  onClick={() => setShowControls(!showControls)}
                  className="px-5 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl text-sm transition-colors"
                >
                  {showControls ? "Hide Controls" : "Show Controls"}
                </button>
              </div>
            </header>

            {/* Full-Screen 3D Blockchain */}
            <div className="absolute inset-0 z-0">
              <VerseChain3D blocks={blocks} />
            </div>

            {/* Floating Controls Panel (Overlay) */}
            {showControls && (
              <div className="absolute top-24 right-8 z-40 w-80 bg-black/90 backdrop-blur-2xl border border-[#d4af77]/30 rounded-3xl p-8 shadow-2xl">
                <div className="space-y-8">
                  <div>
                    <label className="text-[#d4af77] text-xs tracking-widest mb-3 block">BIBLE VERSION</label>
                    <select
                      value={selectedVersion}
                      onChange={(e) => setSelectedVersion(e.target.value as BibleVersion)}
                      className="w-full bg-zinc-900 border border-[#d4af77]/40 text-white py-4 px-6 text-lg rounded-2xl focus:outline-none focus:border-[#d4af77]"
                    >
                      <option value="KJV">King James Version (KJV)</option>
                      <option value="ASV">American Standard Version (ASV)</option>
                      <option value="WEB">World English Bible (WEB)</option>
                    </select>
                  </div>

                  <button
                    onClick={createNewBlock}
                    className="w-full py-7 bg-[#d4af77] hover:bg-[#e5c38a] active:scale-[0.97] transition-all text-black font-bold text-2xl rounded-3xl shadow-xl shadow-[#d4af77]/40 flex items-center justify-center gap-3"
                  >
                    ✨ CREATE NEW BLOCK
                    <span className="text-xl opacity-90">+10 HOLY</span>
                  </button>

                  <div className="pt-4 space-y-5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#d4af77]/70">Blocks on Chain</span>
                      <span className="font-mono text-white text-lg">{blocks.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#d4af77]/70">Remaining Verses</span>
                      <span className="font-mono text-white">
                        {(bibleData[selectedVersion]?.length || 0) - usedIds.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#d4af77]/70">Your Rewards</span>
                      <span className="font-mono text-[#d4af77]">0 HOLY</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Status Bar */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 text-xs text-[#d4af77]/50 bg-black/70 px-6 py-2 rounded-full border border-[#d4af77]/20">
              Solana Devnet • Each block contains a unique Bible verse • Scroll / Drag to explore the chain
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
