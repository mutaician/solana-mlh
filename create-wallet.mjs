import {generateKeyPairSigner, createSolanaRpc, devnet} from "@solana/kit"

// generate brand new keypair
// const wallet = await generateKeyPairSigner();

// console.log("Your new wallet address:", wallet.address);
// console.log(
//     "\nThis address is the public key so its safe to share."
// )

// console.log("The private key stays in memory. In a real app it needs secure saving.")

const rpc = createSolanaRpc(devnet("https://api.devnet.solana.com"))
const {value: balance} = await rpc.getBalance("9pHdfXThWBE4B49oz2cPcWkdQixCzVy8UBR3AEY3bCXr").send()
const balanceInSol = Number(balance) / 1_000_000_000;

console.log(`Balance is: ${balanceInSol}`);