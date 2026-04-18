"use client";

export default function CreateBlockPanel() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Mint New Verse</h2>
      <div className="bg-zinc-900 p-6 rounded-2xl">
        <p className="text-sm opacity-70">Version: KJV</p>
        <p className="mt-4 text-lg">"In the beginning God created..."</p>
      </div>
      <button className="w-full py-6 bg-white text-black font-bold rounded-2xl">
        Connect Wallet to Create Block
      </button>
    </div>
  );
}
