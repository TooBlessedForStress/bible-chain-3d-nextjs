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
    setCurrentBlockIndex(blocks.length); // focus new block

    alert(`✅ New Block Minted\n\nVerse: ${verse.reference}\n\n+10 HOLY tokens rewarded`);
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
          {/* Full page = the blockchain */}
          <div className="relative h-screen w-full overflow-hidden bg-black">

            {/* 3D Blockchain - Takes up the entire body */}
            <div className="absolute inset-0 z-0">
              <VerseChain3D 
                ref={chainRef}
                blocks={blocks} 
                currentIndex={currentBlockIndex}
              />
            </div>

            {/* Overlay Elements */}

            {/* Top Header */}
            <header className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center px-10 py-6 bg-gradient-to-b from-black/80 to-transparent">
              <div className="text-3xl tracking-[6px] font-light">VERSECHAIN</div>
              <div className="flex items-center gap-6">
                <WalletMultiButton className="!bg-white !text-black px-7 py-3 text-sm hover:bg-white/90 transition-all" />
                <button
                  onClick={() => setShowUI(!showUI)}
                  className="px-6 py-3 border border-white/40 hover:border-white text-xs tracking-widest transition-colors"
                >
                  {showUI ? "HIDE OVERLAYS" : "SHOW OVERLAYS"}
                </button>
              </div>
            </header>

            {/* Floating Create Panel (Top Right) */}
            {showUI && (
              <div className="absolute top-28 right-10 z-50 w-80 bg-black/90 backdrop-blur-2xl border border-white/20 p-8">
                <div className="text-[10px] uppercase tracking-[3px] text-white/50 mb-5">MINT A NEW VERSE BLOCK</div>
                
                <select
                  value={selectedVersion}
                  onChange={(e) => setSelectedVersion(e.target.value as BibleVersion)}
                  className="w-full bg-black border border-white/30 text-white py-4 px-5 mb-6 focus:border-white focus:outline-none text-sm"
                >
                  <option value="KJV">King James Version</option>
                  <option value="ASV">American Standard Version</option>
                  <option value="WEB">World English Bible</option>
                </select>

                <button
                  onClick={createNewBlock}
                  className="w-full py-5 border border-white hover:bg-white hover:text-black transition-all tracking-widest text-sm"
                >
                  CREATE NEW BLOCK
                </button>

                <div className="mt-8 grid grid-cols-2 gap-4 text-xs text-white/70">
                  <div>Blocks Minted</div>
                  <div className="text-right text-white">{blocks.length}</div>
                  <div>Verses Remaining</div>
                  <div className="text-right text-white">
                    {(bibleData[selectedVersion]?.length || 0) - usedIds.length}
                  </div>
                </div>
              </div>
            )}

            {/* Block Navigation (Bottom) */}
            {showUI && blocks.length > 0 && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex gap-3 overflow-x-auto pb-4 max-w-[95%] scrollbar-hide">
                {blocks.map((block, index) => (
                  <button
                    key={block.id}
                    onClick={() => navigateToBlock(index)}
                    className={`px-7 py-4 text-xs border min-w-[160px] transition-all whitespace-nowrap ${
                      index === currentBlockIndex
                        ? "border-white bg-white text-black"
                        : "border-white/30 text-white/70 hover:border-white hover:text-white"
                    }`}
                  >
                    BLOCK {String(index + 1).padStart(2, "0")}<br />
                    <span className="opacity-75 font-light">{block.reference}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Bottom Info */}
            {showUI && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 text-[10px] text-white/40 tracking-[2px]">
                ETERNAL ON-CHAIN BIBLE VERSE CHAIN • SOLANA DEVNET
              </div>
            )}
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
