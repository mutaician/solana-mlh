import { LAMPORTS_PER_SOL } from "@solana/web3.js";

// sol to lamports
const solAmount = 0.000005495;
const lamports = solAmount * LAMPORTS_PER_SOL
console.log(lamports)

// lamborts to sol
const lamportsAmount = 2500000000;
const sol = lamportsAmount / LAMPORTS_PER_SOL
console.log(sol)