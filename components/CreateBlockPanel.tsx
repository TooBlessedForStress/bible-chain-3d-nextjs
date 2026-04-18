"use client";

export function CreateBlockPanel() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Mint New Verse</h2>
      
      <div className="bg-zinc-900 p-6 rounded-2xl">
        <p className="text-sm opacity-70 mb-4">Select Bible Version</p>
        <div className="flex gap-2 mb-6">
          <button className="flex-1 py-3 bg-white text-black rounded-xl font-medium">KJV</button>
          <button className="flex-1 py-3 bg-zinc-800 rounded-xl font-medium">ASV</button>
          <button className="flex-1 py-3 bg-zinc-800 rounded-xl font-medium">WEB</button>
        </div>

        <button className="w-full py-6 bg-white text-black font-bold text-lg rounded-2xl">
          Connect Wallet to Create Block
        </button>
      </div>

      <p className="text-xs text-center opacity-60">
        The 3D chain will update after you mint a verse on Solana.
      </p>
    </div>
  );
}
