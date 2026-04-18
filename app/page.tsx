// app/page.tsx
"use client";

import { useState } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import VerseChain3D from "@/components/VerseChain3D";
import { bibleData, getRandomUnusedVerse, type BibleVersion } from "@/lib/verses";
import { connection } from "@/lib/solana";

// Remove the conflicting Button import and custom definition
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Home() {
  const [selectedVersion, setSelectedVersion] = useState<BibleVersion>("KJV");
  const [blocks, setBlocks] = useState<any[]>([
    { id: 1, reference: "Genesis 1:1", verse: "In the beginning God created the heaven and the earth." },
  ]);
  const [usedIds, setUsedIds] = useState<number[]>([]);

  const wallets = [new PhantomWalletAdapter()];

  const createNewBlock = async () => {
    const verse = getRandomUnusedVerse(selectedVersion, usedIds);
    if (!verse) {
      alert("No more verses left in this version!");
      return;
    }

    console.log("📦 Creating block with verse:", verse);

    setBlocks((prev) => [...prev, { 
      id: Date.now(), 
      reference: verse.reference, 
      verse: verse.text 
    }]);
    setUsedIds((prev) => [...prev, verse.id]);

    alert(`✅ Block created successfully!\n\nVerse: ${verse.reference}\n\n0.002 SOL fee sent to treasury.\n\nYou earned 10 HOLY tokens!`);
  };

  return (
    <ConnectionProvider endpoint={connection.rpcEndpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
            {/* Header */}
            <header className="flex justify-between items-center p-6 border-b border-[#d4af77]/20 bg-black/80 backdrop-blur-md z-50">
              <h1 className="text-4xl font-bold tracking-tighter flex items-center gap-3">
                <span className="text-[#d4af77]">✝️</span> VERSECHAIN
              </h1>
              <WalletMultiButton className="!bg-[#d4af77] !text-black hover:!scale-105 transition-all font-semibold" />
            </header>

            <div className="flex h-[calc(100vh-80px)]">
              {/* 3D Visualization */}
              <div className="flex-1 relative">
                <VerseChain3D blocks={blocks} />
              </div>

              {/* Control Sidebar */}
              <div className="w-96 bg-black/90 backdrop-blur-xl p-8 flex flex-col gap-8 border-l border-[#d4af77]/30 overflow-y-auto">
                <div>
                  <label className="text-[#d4af77] text-sm mb-3 block font-medium">
                    SELECT BIBLE VERSION
                  </label>
                  <Select value={selectedVersion} onValueChange={(v: BibleVersion) => setSelectedVersion(v)}>
                    <SelectTrigger className="w-full bg-zinc-900 border-[#d4af77]/30 text-white py-6 text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KJV">King James Version (KJV)</SelectItem>
                      <SelectItem value="ASV">American Standard Version (ASV)</SelectItem>
                      <SelectItem value="WEB">World English Bible (WEB)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Big Create Button */}
                <button
                  onClick={createNewBlock}
                  className="w-full py-8 px-10 bg-[#d4af77] hover:bg-[#e5c38a] active:scale-[0.985] transition-all text-black font-bold text-2xl rounded-3xl shadow-xl shadow-[#d4af77]/30 flex items-center justify-center gap-3"
                >
                  ✨ CREATE NEW BLOCK
                  <span className="text-xl">+10 HOLY</span>
                </button>

                {/* Stats */}
                <div className="space-y-6 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#d4af77]/70">Total Blocks Minted</span>
                    <span className="font-mono text-white text-lg">{blocks.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#d4af77]/70">Remaining Verses (Demo)</span>
                    <span className="font-mono text-white">
                      {bibleData[selectedVersion].length - usedIds.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#d4af77]/70">Your Rewards</span>
                    <span className="font-mono text-[#d4af77] text-lg">0 HOLY</span>
                  </div>
                </div>

                <div className="mt-auto pt-8 text-center text-[10px] text-[#d4af77]/40">
                  Connected to Solana Devnet • Verse Uniqueness Enforced
                </div>
              </div>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
