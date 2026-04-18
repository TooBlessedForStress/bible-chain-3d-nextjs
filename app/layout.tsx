import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VERSECHAIN — Eternal Bible Verse Blockchain on Solana",
  description: "Mint unique verses. Build the eternal chain.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full overflow-hidden">
      <body className="h-full overflow-hidden bg-black m-0 p-0">
        {children}
      </body>
    </html>
  );
}
