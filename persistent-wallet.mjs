import{
    createSolanaRpc,
    devnet,
    generateKeyPair,
    createKeyPairSignerFromBytes,
    createSignerFromKeyPair
} from '@solana/kit';

import {readFile, writeFile} from "node:fs/promises";

const WALLET_FILE = "wallet.json"
const rpc = createSolanaRpc(devnet("https://api.devnet.solana.com"))

async function loadOrCreateWallet() {
    try{
        // try to load an existing wallet
        const data = JSON.parse(await readFile(WALLET_FILE, "utf-8"))
        const secretBytes = new Uint8Array(data.secretKey)
        const wallet = await createKeyPairSignerFromBytes(secretBytes)
        return wallet
    } catch {
        // create a new one if not found
        // 'true' is passed so the keys are extractible for persistence
        const keyPair = await generateKeyPair(true)

        // export public key with raw method
        const publicKeyBytes = new Uint8Array(
            await crypto.subtle.exportKey("raw", keyPair.publicKey)
        )

        // export private key using pkcs8 format
        // nodejs doesn't support 'raw' export for Ed25519 private keys

        const pkcs8 = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey)
        const privateKeyBytes = new Uint8Array(pkcs8).slice(-32)

        // Solana keypair format: 64bytes (32 for private and 32 for public)
        const keypairBytes = new Uint8Array(64)
        keypairBytes.set(privateKeyBytes, 0)
        keypairBytes.set(publicKeyBytes, 32)

        await writeFile(
            WALLET_FILE,
            JSON.stringify({secretKey: Array.from(keypairBytes)})
        )

        const wallet = await createSignerFromKeyPair(keyPair)
        console.log("Created new wallet:", wallet.address)
        console.log(`Saved to ${WALLET_FILE}`)
        return wallet
    }
}

const wallet = await loadOrCreateWallet()

// check balance
const {value: balance} = await rpc.getBalance(wallet.address).send()
const balanceInSol = Number(balance) / 1_000_000_000


console.log(`\nAddress: ${wallet.address}`);
console.log(`Balance: ${balanceInSol} SOL`);

console.log(wallet)