"use client";

export default function CreateBlockPanel() {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Mint New Verse</h2>
      <div className="bg-zinc-900 p-6 rounded-2xl">
        <p className="text-sm opacity-70">Version: KJV</p>
        <p className="mt-6 text-lg">"In the beginning God created the heaven and the earth."</p>
      </div>
      <button className="mt-8 w-full py-6 bg-white text-black font-bold rounded-2xl">
        Create Block
      </button>
    </div>
  );
}
