"use client";

import { useState, useEffect } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { BibleChain3D } from "@/components/BibleChain3D";
import { CreateBlockPanel } from "@/components/CreateBlockPanel";

const network = WalletAdapterNetwork.Devnet;

export default function Home() {
  const [programId] = useState("YOUR_PROGRAM_ID_HERE"); // ← replace after deploy

  const wallets = [new PhantomWalletAdapter()];

  return (
    <ConnectionProvider endpoint="https://api.devnet.solana.com">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Header */}
            <header className="border-b border-white/10 bg-black/80 backdrop-blur-md z-50">
              <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">✝️</span>
                  <h1 className="text-3xl font-bold tracking-tighter">THE ETERNAL CHAIN</h1>
                </div>
                <div className="text-sm text-white/60">On Solana • Live Bible Ledger</div>
              </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
              {/* 3D Canvas */}
              <div className="flex-1 relative">
                <BibleChain3D programId={programId} />
              </div>

              {/* Right Panel */}
              <div className="w-96 bg-zinc-950 border-l border-white/10 p-6 overflow-auto">
                <CreateBlockPanel programId={programId} />
              </div>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
