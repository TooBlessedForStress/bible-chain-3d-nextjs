"use client";

export default function CreateBlockPanel() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Mint a New Verse</h2>

      <div className="space-y-6">
        <div>
          <p className="text-sm opacity-60 mb-3">BIBLE VERSION</p>
          <div className="flex gap-3">
            {["KJV", "ASV", "WEB"].map((v) => (
              <button key={v} className="flex-1 py-4 bg-white text-black rounded-2xl font-medium">
                {v}
              </button>
            ))}
          </div>
        </div>

        <button className="w-full py-7 bg-white text-black font-bold text-xl rounded-3xl hover:scale-105 transition-transform">
          CONNECT WALLET TO CREATE BLOCK
        </button>
      </div>

      <p className="text-xs text-center mt-12 opacity-50">
        Each block permanently records a unique Bible verse on Solana
      </p>
    </div>
  );
}
