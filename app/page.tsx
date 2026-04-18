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
  { id: 1, reference: "Genesis 1:1", verse: "In the beginning God created the heaven and the earth." },
  { id: 2, reference: "John 3:16", verse: "For God so loved the world..." },
  { id: 3, reference: "Psalm 23:1", verse: "The Lord is my shepherd..." },
  { id: 4, reference: "Matthew 6:9", verse: "Our Father which art in heaven..." },
  { id: 5, reference: "Romans 8:28", verse: "And we know that all things work together..." },
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
          <div className="fixed inset-0 h-screen w-screen bg-black overflow-hidden">

            {/* 3D Canvas - Full screen but lower z-index */}
            <div className="absolute inset-0 z-0">
              <VerseChain3D 
                ref={chainRef}
                blocks={blocks} 
                currentIndex={currentBlockIndex}
              />
            </div>

            {/* All UI Overlays with higher z-index */}
            <header className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-6 bg-gradient-to-b from-black/90 to-transparent">
              <div className="text-3xl tracking-[6px] font-light text-white">VERSECHAIN</div>
              <div className="flex items-center gap-4">
                <WalletMultiButton className="!bg-white !text-black px-6 py-2.5 text-sm hover:bg-white/90" />
                <button
                  onClick={() => setShowUI(!showUI)}
                  className="px-6 py-2.5 border border-white/40 hover:border-white text-xs tracking-widest transition-colors"
                >
                  {showUI ? "HIDE UI" : "SHOW UI"}
                </button>
              </div>
            </header>

            {showUI && (
              <>
                {/* Create Controls - Top Right */}
                <div className="absolute top-28 right-8 z-50 w-80 bg-black/90 backdrop-blur-2xl border border-white/20 p-8">
                  <div className="uppercase text-xs tracking-[3px] text-white/60 mb-6">MINT NEW VERSE BLOCK</div>
                  <select
                    value={selectedVersion}
                    onChange={(e) => setSelectedVersion(e.target.value as BibleVersion)}
                    className="w-full bg-black border border-white/30 text-white py-4 px-5 mb-6 focus:border-white"
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
                </div>

                {/* Block Navigation - Bottom */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-3 overflow-x-auto max-w-[92%] pb-4">
                  {blocks.map((block, index) => (
                    <button
                      key={block.id}
                      onClick={() => navigateToBlock(index)}
                      className={`px-7 py-4 text-xs border min-w-[160px] transition-all ${
                        index === currentBlockIndex 
                          ? "border-white bg-white text-black" 
                          : "border-white/30 text-white/70 hover:border-white"
                      }`}
                    >
                      BLOCK {String(index + 1).padStart(2, '0')}<br />
                      <span className="opacity-75 font-light">{block.reference}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {showUI && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 text-[10px] text-white/40 tracking-widest">
                ETERNAL ON-CHAIN BIBLE VERSE CHAIN • SOLANA DEVNET
              </div>
            )}
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
