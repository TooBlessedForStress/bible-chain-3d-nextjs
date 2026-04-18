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
    { id: 1, reference: "Genesis 1:1", verse: "In the beginning God created the heaven and the earth." },
  ]);
  const [usedIds, setUsedIds] = useState<number[]>([]);

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

    alert(`✅ Block created!\n\nVerse: ${verse.reference}\nReward: +10 HOLY\nFee: 0.002 SOL to treasury`);
  };

  return (
    <ConnectionProvider endpoint={connection.rpcEndpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
            <header className="flex justify-between items-center p-6 border-b border-[#d4af77]/20 bg-black/80 backdrop-blur-md z-50">
              <h1 className="text-4xl font-bold tracking-tighter flex items-center gap-3">
                <span className="text-[#d4af77]">✝️</span> VERSECHAIN
              </h1>
              <WalletMultiButton className="!bg-[#d4af77] !text-black hover:!scale-105 transition-all font-semibold px-6 py-3 rounded-2xl" />
            </header>

            <div className="flex h-[calc(100vh-80px)]">
              <div className="flex-1 relative">
                <VerseChain3D blocks={blocks} />
              </div>

              <div className="w-96 bg-black/90 backdrop-blur-xl p-8 flex flex-col gap-8 border-l border-[#d4af77]/30 overflow-y-auto">
                <div>
                  <label className="text-[#d4af77] text-sm mb-3 block font-medium tracking-widest">
                    BIBLE VERSION
                  </label>
                  <select
                    value={selectedVersion}
                    onChange={(e) => setSelectedVersion(e.target.value as BibleVersion)}
                    className="w-full bg-zinc-900 border border-[#d4af77]/30 text-white py-4 px-5 text-lg rounded-2xl focus:outline-none focus:border-[#d4af77]"
                  >
                    <option value="KJV">King James Version (KJV)</option>
                    <option value="ASV">American Standard Version (ASV)</option>
                    <option value="WEB">World English Bible (WEB)</option>
                  </select>
                </div>

                <button
                  onClick={createNewBlock}
                  className="w-full py-8 px-10 bg-[#d4af77] hover:bg-[#e5c38a] active:scale-95 transition-all text-black font-bold text-2xl rounded-3xl shadow-xl shadow-[#d4af77]/30"
                >
                  ✨ CREATE NEW BLOCK +10 HOLY
                </button>

                <div className="space-y-6 pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#d4af77]/70">Total Blocks</span>
                    <span className="font-mono text-white">{blocks.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#d4af77]/70">Remaining Verses</span>
                    <span className="font-mono text-white">
                      {(bibleData[selectedVersion]?.length || 0) - usedIds.length}
                    </span>
                  </div>
                </div>

                <div className="mt-auto text-center text-xs text-[#d4af77]/40">
                  Solana Devnet • 3D Chain • Verses locked forever
                </div>
              </div>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
