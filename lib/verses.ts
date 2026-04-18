// lib/verses.ts
export type BibleVersion = "KJV" | "ASV" | "WEB";

export interface Verse {
  id: number;
  reference: string;
  text: string;
  version: BibleVersion;
}

export const bibleData: Record<BibleVersion, Verse[]> = {
  KJV: [
    { id: 1, reference: "Genesis 1:1", text: "In the beginning God created the heaven and the earth.", version: "KJV" },
    { id: 2, reference: "John 3:16", text: "For God so loved the world, that he gave his only begotten Son...", version: "KJV" },
    // Add 50–100 more from any public KJV JSON. For now this is enough for demo.
  ],
  // Add ASV and WEB the same way
  ASV: [],
  WEB: [],
};

export function getRandomUnusedVerse(version: BibleVersion, usedIds: number[]): Verse | null {
  const available = bibleData[version].filter(v => !usedIds.includes(v.id));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}
