"use client";

import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { BibleChain3D } from "@/components/BibleChain3D";
import { CreateBlockPanel } from "@/components/CreateBlockPanel";

const wallets = [new PhantomWalletAdapter()];

export default function Home() {
  return (
    <ConnectionProvider endpoint="https://api.devnet.solana.com">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
            {/* 3D Viewer */}
            <div className="flex-1 relative min-h-[600px]">
              <BibleChain3D />
            </div>

            {/* Sidebar Controls */}
            <div className="w-full md:w-96 bg-zinc-950 border-t md:border-l border-white/10 p-6 overflow-auto">
              <CreateBlockPanel />
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
