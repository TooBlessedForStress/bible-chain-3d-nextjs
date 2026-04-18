import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VERSECHAIN - Eternal Bible Verse Blockchain",
  description: "Create blocks. Mint unique verses on Solana.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full m-0 p-0 overflow-hidden bg-black">
        {children}
      </body>
    </html>
  );
}
