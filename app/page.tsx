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
    setCurrentBlockIndex(blocks.length);

    alert(`✅ Block ${blocks.length + 1} added to the chain\nVerse: ${verse.reference}`);
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
          {/* Full page body = the blockchain */}
          <div className="fixed inset-0 h-screen w-screen bg-black overflow-hidden m-0 p-0">

            {/* 3D Chain - Covers the entire screen */}
            <div className="absolute inset-0 z-0">
              <VerseChain3D 
                ref={chainRef}
                blocks={blocks} 
                currentIndex={currentBlockIndex}
              />
            </div>

            {/* Overlays on top of the chain */}

            {/* Top Header */}
            <header className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-6 bg-gradient-to-b from-black/90 to-transparent">
              <div className="text-3xl tracking-[4px] font-light text-white">VERSECHAIN</div>
              <div className="flex items-center gap-4">
                <WalletMultiButton className="!bg-white !text-black px-6 py-2.5 text-sm hover:bg-white/90" />
                <button 
                  onClick={() => setShowUI(!showUI)}
                  className="px-5 py-2 border border-white/50 hover:border-white text-xs tracking-widest transition-colors"
                >
                  {showUI ? "HIDE UI" : "SHOW UI"}
                </button>
              </div>
            </header>

            {/* Create Controls - Top Right Overlay */}
            {showUI && (
              <div className="absolute top-28 right-8 z-50 w-80 bg-black/85 backdrop-blur-xl border border-white/20 p-8 rounded">
                <div className="uppercase text-xs tracking-[2px] text-white/60 mb-6">MINT NEW VERSE BLOCK</div>
                
                <select
                  value={selectedVersion}
                  onChange={(e) => setSelectedVersion(e.target.value as BibleVersion)}
                  className="w-full bg-black border border-white/30 text-white py-3.5 px-5 mb-6 text-sm focus:border-white"
                >
                  <option value="KJV">King James Version</option>
                  <option value="ASV">American Standard Version</option>
                  <option value="WEB">World English Bible</option>
                </select>

                <button
                  onClick={createNewBlock}
                  className="w-full py-4 border border-white text-white hover:bg-white hover:text-black transition-all text-sm tracking-widest"
                >
                  CREATE NEW BLOCK
                </button>

                <div className="mt-8 text-xs text-white/70 space-y-1">
                  <div className="flex justify-between">
                    <span>Blocks Minted</span>
                    <span className="text-white font-mono">{blocks.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Verses Remaining</span>
                    <span className="text-white font-mono">
                      {(bibleData[selectedVersion]?.length || 0) - usedIds.length}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Block Navigation Menu - Bottom Overlay */}
            {showUI && blocks.length > 0 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-3 overflow-x-auto pb-2 max-w-[90%]">
                {blocks.map((block, index) => (
                  <button
                    key={block.id}
                    onClick={() => navigateToBlock(index)}
                    className={`px-6 py-3.5 text-xs border min-w-[150px] transition-all ${
                      index === currentBlockIndex 
                        ? "border-white bg-white text-black" 
                        : "border-white/30 text-white/70 hover:border-white"
                    }`}
                  >
                    BLOCK {String(index + 1).padStart(2, '0')}<br />
                    <span className="opacity-75">{block.reference}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Bottom Status */}
            {showUI && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-40 text-[10px] text-white/40 tracking-widest">
                ETERNAL ON-CHAIN BIBLE VERSE CHAIN • SOLANA DEVNET
              </div>
            )}
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
