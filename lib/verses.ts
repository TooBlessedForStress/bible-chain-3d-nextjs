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
    { id: 2, reference: "John 3:16", text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.", version: "KJV" },
    { id: 3, reference: "Psalm 23:1", text: "The Lord is my shepherd; I shall not want.", version: "KJV" },
    // Add 20–50 more KJV verses here for a better demo
  ],
  ASV: [
    { id: 101, reference: "Genesis 1:1", text: "In the beginning God created the heavens and the earth.", version: "ASV" },
  ],
  WEB: [
    { id: 201, reference: "Genesis 1:1", text: "In the beginning God created the heavens and the earth.", version: "WEB" },
  ],
};

export function getRandomUnusedVerse(version: BibleVersion, usedIds: number[]): Verse | null {
  const available = bibleData[version].filter(v => !usedIds.includes(v.id));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}
