// app/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
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
    { id: 1, reference: "Genesis 1:1" },
    { id: 2, reference: "John 3:16" },
    { id: 3, reference: "Psalm 23:1" },
    { id: 4, reference: "Matthew 6:9" },
    { id: 5, reference: "Romans 8:28" },
    { id: 6, reference: "Philippians 4:13" },
  ]);
  const [usedIds, setUsedIds] = useState<number[]>([]);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(blocks.length - 1);

  const chainRef = useRef<any>(null);
  const wallets = [new PhantomWalletAdapter()];

  useEffect(() => {
    if (chainRef.current?.focusBlock) {
      chainRef.current.focusBlock(currentBlockIndex);
    }
  }, [currentBlockIndex]);

  const createNewBlock = () => {
    const verse = getRandomUnusedVerse(selectedVersion, usedIds);
    if (!verse) return alert("No verses left!");
    const newBlock = { id: Date.now(), reference: verse.reference };
    setBlocks(prev => [...prev, newBlock]);
    setUsedIds(prev => [...prev, verse.id]);
    setCurrentBlockIndex(blocks.length);
  };

  const navigateToBlock = (index: number) => {
    setCurrentBlockIndex(index);
    if (chainRef.current?.focusBlock) chainRef.current.focusBlock(index);
  };

  return (
    <ConnectionProvider endpoint={connection.rpcEndpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="fixed inset-0 h-screen w-screen bg-[#000000] overflow-hidden">

            {/* 3D Canvas - full background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <VerseChain3D ref={chainRef} blocks={blocks} currentIndex={currentBlockIndex} />
            </div>

            {/* Overlaid content - styled like your Bible search page */}
            <div className="absolute inset-0 z-10 flex flex-col pointer-events-none">
              {/* Header / Title */}
              <div className="px-8 pt-8 pb-6 text-center">
                <h1 className="bible-search-title">
                  Live Bible Chain 3D
                </h1>
              </div>

              {/* Controls */}
              <div className="flex-1 flex justify-end items-start px-8 pt-4 pointer-events-auto">
                <div className="w-80 bg-[#0a0a0a] border border-[#2a2a2a] rounded-3xl p-8 shadow-2xl">
                  <div className="uppercase text-xs tracking-[3px] text-[#e5e7eb] mb-6">MINT NEW VERSE BLOCK</div>
                  
                  <select
                    value={selectedVersion}
                    onChange={(e) => setSelectedVersion(e.target.value as BibleVersion)}
                    className="w-full bg-[#111111] border border-[#2a2a2a] text-white py-4 px-5 mb-6 rounded-2xl focus:border-[#4a4a4a] focus:outline-none"
                  >
                    <option value="KJV">King James Version</option>
                    <option value="ASV">American Standard Version</option>
                    <option value="WEB">World English Bible</option>
                  </select>

                  <button
                    onClick={createNewBlock}
                    className="search-btn w-full"
                  >
                    CREATE NEW BLOCK
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3 overflow-x-auto max-w-[92%] pb-4 pointer-events-auto">
                {blocks.map((block, index) => (
                  <button
                    key={block.id}
                    onClick={() => navigateToBlock(index)}
                    className={`px-7 py-4 text-xs border min-w-[160px] transition-all ${
                      index === currentBlockIndex
                        ? "border-white bg-white text-black"
                        : "border-[#2a2a2a] text-white/70 hover:border-[#4a4a4a]"
                    }`}
                  >
                    BLOCK {String(index + 1).padStart(2, '0')}<br />
                    <span className="opacity-75">{block.reference}</span>
                  </button>
                ))}
              </div>

              {/* Footer note */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-[10px] text-[#888888] tracking-widest">
                ETERNAL ON-CHAIN BIBLE VERSE CHAIN • SOLANA DEVNET
              </div>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
