"use client";

import dynamic from 'next/dynamic';

const BibleChain3D = dynamic(
  () => import('@/components/BibleChain3D'),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <div className="h-screen w-full">
        <BibleChain3D />
      </div>
    </div>
  );
}
