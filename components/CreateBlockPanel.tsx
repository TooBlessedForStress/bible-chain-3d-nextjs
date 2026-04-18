"use client";

export default function CreateBlockPanel() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Mint New Verse</h2>
        <p className="text-sm opacity-60 mt-1">Add a Bible verse to the eternal chain</p>
      </div>

      <div className="bg-zinc-900 rounded-3xl p-6">
        <p className="text-xs opacity-60 mb-3">SELECT VERSION</p>
        <div className="grid grid-cols-3 gap-3">
          {["KJV", "ASV", "WEB"].map((v) => (
            <button 
              key={v}
              className="py-4 bg-white text-black rounded-2xl font-medium hover:bg-gray-200 transition-colors"
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <button className="w-full py-7 bg-white text-black font-bold text-xl rounded-3xl hover:scale-[1.02] transition-transform">
        CONNECT WALLET &amp; CREATE BLOCK
      </button>

      <p className="text-xs text-center opacity-50">
        100 HOLY tokens minted • 0.001 SOL fee to liquidity pool
      </p>
    </div>
  );
}
