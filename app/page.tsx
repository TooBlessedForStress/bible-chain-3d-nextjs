// app/page.tsx
"use client";

import { useState, useRef } from "react";
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
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [showUI, setShowUI] = useState(true);

  const chainRef = useRef<any>(null);
  const wallets = [new PhantomWalletAdapter()];

  const createNewBlock = () => {
    const verse = getRandomUnusedVerse(selectedVersion, usedIds);
    if (!verse) {
      alert("No more verses left in this version!");
      return;
    }

    const newBlock = { 
      id: Date.now(), 
      reference: verse.reference, 
      verse: verse.text 
    };

    setBlocks((prev) => [...prev, newBlock]);
    setUsedIds((prev) => [...prev, verse.id]);
    setCurrentBlockIndex(blocks.length); // Jump to the new block

    alert(`✅ Block ${blocks.length + 1} added\nVerse: ${verse.reference}`);
  };

  const navigateToBlock = (index: number) => {
    setCurrentBlockIndex(index);
    if (chainRef.current?.focusBlock) {
      chainRef.current.focusBlock(index);
    }
  };

  return (
    <ConnectionProvider endpoint={connection.rpcEndpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="relative min-h-screen bg-black overflow-hidden font-mono">

            {/* Full-Screen 3D Chain - The Entire Background */}
            <div className="absolute inset-0 z-0">
              <VerseChain3D 
                ref={chainRef}
                blocks={blocks} 
                currentIndex={currentBlockIndex}
              />
            </div>

            {/* Minimal Top Header */}
            <header className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-6 bg-black/70 backdrop-blur-md border-b border-white/10">
              <div className="text-3xl tracking-[6px] font-light text-white">VERSECHAIN</div>
              
              <div className="flex items-center gap-4">
                <WalletMultiButton className="!bg-white !text-black px-6 py-2.5 text-sm hover:bg-white/90 transition-all" />
                <button
                  onClick={() => setShowUI(!showUI)}
                  className="px-5 py-2 border border-white/40 hover:border-white text-xs tracking-widest transition-colors"
                >
                  {showUI ? "HIDE UI" : "SHOW UI"}
                </button>
              </div>
            </header>

            {/* Floating Create Controls - Top Right */}
            {showUI && (
              <div className="absolute top-24 right-8 z-50 w-80 bg-black/80 backdrop-blur-2xl border border-white/20 p-8">
                <div className="uppercase text-[10px] tracking-[3px] text-white/50 mb-4">ADD TO THE ETERNAL CHAIN</div>
                
                <select
                  value={selectedVersion}
                  onChange={(e) => setSelectedVersion(e.target.value as BibleVersion)}
                  className="w-full bg-transparent border border-white/30 text-white py-3 px-4 mb-6 text-sm focus:outline-none focus:border-white"
                >
                  <option value="KJV">King James Version (KJV)</option>
                  <option value="ASV">American Standard Version (ASV)</option>
                  <option value="WEB">World English Bible (WEB)</option>
                </select>

                <button
                  onClick={createNewBlock}
                  className="w-full py-4 border border-white text-white hover:bg-white hover:text-black transition-all text-sm tracking-widest"
                >
                  MINT NEW BLOCK
                </button>

                <div className="mt-8 text-[11px] space-y-2 text-white/60">
                  <div>Blocks on Chain: <span className="text-white">{blocks.length}</span></div>
                  <div>Remaining Verses: <span className="text-white">{(bibleData[selectedVersion]?.length || 0) - usedIds.length}</span></div>
                </div>
              </div>
            )}

            {/* Block Navigation Menu - Bottom Center */}
            {showUI && blocks.length > 0 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 bg-black/90 border border-white/20 backdrop-blur-xl px-6 py-4 rounded-none flex gap-2 overflow-x-auto max-w-[92%] scrollbar-hide">
                {blocks.map((block, index) => (
                  <button
                    key={block.id}
                    onClick={() => navigateToBlock(index)}
                    className={`min-w-[140px] px-5 py-3 text-xs border transition-all ${
                      index === currentBlockIndex 
                        ? "border-white bg-white text-black" 
                        : "border-white/30 text-white/70 hover:border-white/70 hover:text-white"
                    }`}
                  >
                    BLOCK {String(index + 1).padStart(2, '0')}<br />
                    <span className="opacity-75 font-light">{block.reference}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Subtle Footer Info */}
            {showUI && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 text-[10px] text-white/40 tracking-[2px]">
                ETERNAL VERSE CHAIN • SOLANA • UNIQUE BIBLE VERSES FOREVER
              </div>
            )}
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
