// lib/solana.ts
import { Connection } from "@solana/web3.js";

export const NETWORK = "devnet";
export const connection = new Connection(
  `https://api.${NETWORK}.solana.com`,
  "confirmed"
);
