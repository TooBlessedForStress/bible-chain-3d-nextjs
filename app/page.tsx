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
import { Button } from "@/components/ui/button"; // we'll create this next
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Simple shadcn-style button (or install shadcn later)
const Button = ({ children, onClick, disabled }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="px-8 py-4 bg-holy text-black font-bold text-lg rounded-2xl hover:scale-105 transition-all disabled:opacity-50"
  >
    {children}
  </button>
);

export default function Home() {
  const [selectedVersion, setSelectedVersion] = useState<BibleVersion>("KJV");
  const [blocks, setBlocks] = useState<any[]>([
    // demo blocks
    { id: 1, reference: "Genesis 1:1", verse: "In the beginning..." },
  ]);
  const [usedIds, setUsedIds] = useState<number[]>([]);

  const wallets = [new PhantomWalletAdapter()];

  const createNewBlock = async () => {
    const verse = getRandomUnusedVerse(selectedVersion, usedIds);
    if (!verse) {
      alert("No more verses left in this version!");
      return;
    }

    // TODO: Later replace with real Anchor transaction
    console.log("📦 Creating block with verse:", verse);

    setBlocks((prev) => [...prev, { id: Date.now(), reference: verse.reference, verse: verse.text }]);
    setUsedIds((prev) => [...prev, verse.id]);

    // Simulate fee to liquidity pool
    alert(`✅ Block created! ${verse.reference} added.\n\n0.002 SOL fee sent to treasury.`);
  };

  return (
    <ConnectionProvider endpoint={connection.rpcEndpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen bg-darkbg text-white">
            {/* Header */}
            <header className="flex justify-between items-center p-6 border-b border-holy/20">
              <h1 className="text-4xl font-bold tracking-tighter flex items-center gap-3">
                <span className="text-holy">✝️</span> VERSECHAIN
              </h1>
              <WalletMultiButton className="!bg-holy !text-black hover:!scale-105" />
            </header>

            <div className="flex h-[calc(100vh-80px)]">
              {/* 3D Canvas */}
              <div className="flex-1 relative">
                <VerseChain3D blocks={blocks} />
              </div>

              {/* Sidebar Controls */}
              <div className="w-96 bg-black/80 backdrop-blur-xl p-8 flex flex-col gap-8 border-l border-holy/30">
                <div>
                  <label className="text-holy text-sm mb-2 block">Select Bible Version</label>
                  <Select value={selectedVersion} onValueChange={(v) => setSelectedVersion(v as BibleVersion)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KJV">King James Version (KJV)</SelectItem>
                      <SelectItem value="ASV">American Standard Version (ASV)</SelectItem>
                      <SelectItem value="WEB">World English Bible (WEB)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={createNewBlock} className="w-full text-2xl py-8">
                  ✨ CREATE NEW BLOCK (+10 HOLY)
                </Button>

                <div className="text-xs text-holy/70 space-y-4">
                  <p>🔥 Total blocks: <span className="font-mono text-white">{blocks.length}</span></p>
                  <p>💰 Your rewards this session: <span className="font-mono text-white">0 HOLY</span></p>
                  <p className="text-amber-400">Next verse preview will appear here after creation</p>
                </div>

                <div className="mt-auto text-[10px] text-center text-holy/40">
                  Connected to Solana Devnet • Professional 3D Chain
                </div>
              </div>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
