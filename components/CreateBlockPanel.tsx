"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import * as anchor from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";

const versions = ["KJV", "ASV", "WEB"];

export function CreateBlockPanel({ programId }: { programId: string }) {
  const wallet = useWallet();
  const [selectedVersion, setSelectedVersion] = useState(0);
  const [preview, setPreview] = useState({ ref: "", text: "" });

  const versePools: any = {
    0: [{ ref: "Genesis 1:1", text: "In the beginning God created..." }],
    1: [{ ref: "Genesis 1:1", text: "In the beginning God created..." }],
    2: [{ ref: "Matthew 6:33", text: "Seek ye first the kingdom of God..." }],
  };

  const generatePreview = () => {
    const pool = versePools[selectedVersion] || versePools[0];
    const random = pool[Math.floor(Math.random() * pool.length)];
    setPreview(random);
  };

  const createBlock = async () => {
    if (!wallet.publicKey) return alert("Connect wallet first");
    // Full Anchor transaction code would go here
    alert("Transaction sent! (Demo – real Anchor integration next)");
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Mint New Verse</h2>
      
      <div className="flex gap-2">
        {versions.map((v, i) => (
          <button
            key={v}
            onClick={() => { setSelectedVersion(i); generatePreview(); }}
            className={`flex-1 py-3 text-sm font-medium rounded-xl transition-all ${selectedVersion === i ? "bg-white text-black" : "bg-zinc-900"}`}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="bg-zinc-900 p-6 rounded-3xl">
        <div className="text-xs opacity-60 mb-2">{versions[selectedVersion]}</div>
        <div className="text-xl font-semibold">{preview.ref || "Click to generate"}</div>
        <p className="mt-4 text-sm leading-relaxed">{preview.text || "Random verse will appear here"}</p>
      </div>

      <button
        onClick={createBlock}
        disabled={!wallet.publicKey}
        className="w-full py-6 bg-white text-black font-bold text-xl rounded-3xl hover:scale-105 transition-transform"
      >
        {wallet.publicKey ? "CREATE BLOCK + MINT 100 HOLY" : "Connect Wallet to Mint"}
      </button>
    </div>
  );
}
