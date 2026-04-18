// lib/solana.ts
import { Connection, PublicKey } from "@solana/web3.js";

export const NETWORK = "devnet"; // change to "mainnet-beta" later
export const connection = new Connection(
  `https://api.${NETWORK}.solana.com`,
  "confirmed"
);

// Placeholder — replace with your real Anchor program ID after deployment
export const PROGRAM_ID = new PublicKey("YourProgramIdHere1111111111111111111111111111");
