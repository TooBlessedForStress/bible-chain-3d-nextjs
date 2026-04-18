"use client";

import { useState } from "react";

const versions = ["KJV", "ASV", "WEB"];

export default function CreateBlockPanel() {
  const [selectedVersion, setSelectedVersion] = useState(0);
  const [previewRef, setPreviewRef] = useState("Genesis 1:1");
  const [previewText, setPreviewText] = useState("In the beginning God created the heaven and the earth.");

  const generateRandomVerse = () => {
    const sampleVerses = [
      { ref: "Genesis 1:1", text: "In the beginning God created the heaven and the earth." },
      { ref: "John 3:16", text: "For God so loved the world, that he gave his only begotten Son." },
      { ref: "Psalm 23:1", text: "The Lord is my shepherd; I shall not want." },
      { ref: "Romans 8:28", text: "And we know that all things work together for good..." },
      { ref: "Philippians 4:13", text: "I can do all things through Christ who strengthens me." },
    ];
    const random = sampleVerses[Math.floor(Math.random() * sampleVerses.length)];
    setPreviewRef(random.ref);
    setPreviewText(random.text);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Mint New Verse</h2>
        <p className="text-sm opacity-60 mt-1">Add a unique Bible verse to the eternal chain</p>
      </div>

      <div>
        <p className="text-xs opacity-60 mb-3">SELECT BIBLE VERSION</p>
        <div className="flex gap-2">
          {versions.map((v, index) => (
            <button
              key={v}
              onClick={() => setSelectedVersion(index)}
              className={`flex-1 py-4 rounded-2xl font-medium transition-all ${
                selectedVersion === index 
                  ? "bg-white text-black" 
                  : "bg-zinc-900 hover:bg-zinc-800"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900 rounded-3xl p-6 min-h-[180px]">
        <div className="text-xs opacity-60 mb-2">{versions[selectedVersion]}</div>
        <div className="font-semibold text-lg mb-3">{previewRef}</div>
        <p className="text-sm leading-relaxed">{previewText}</p>
      </div>

      <button 
        onClick={generateRandomVerse}
        className="w-full py-4 border border-white/30 rounded-2xl hover:bg-white/5 transition-colors"
      >
        Generate Random Verse
      </button>

      <button className="w-full py-7 bg-white text-black font-bold text-xl rounded-3xl hover:scale-[1.02] transition-transform">
        CONNECT WALLET &amp; CREATE BLOCK
      </button>

      <p className="text-xs text-center opacity-50">
        100 HOLY tokens will be minted • Small fee added to liquidity pool
      </p>
    </div>
  );
}
