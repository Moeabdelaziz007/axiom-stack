// example.ts
import { Connection, Keypair } from '@solana/web3.js';
import { AnchorProvider } from '@coral-xyz/anchor';
import AxiomIDSDK from './src/index';

async function main() {
  // Initialize connection and provider
  const connection = new Connection('https://api.devnet.solana.com');
  const wallet = new Keypair(); // In practice, use a real wallet
  const provider = new AnchorProvider(connection, wallet, {});

  console.log("Axiom ID SDK Example");
  console.log("===================");

  // Note: In a real implementation, you would need to initialize the programs
  // This is just a demonstration of how the SDK would be used
  console.log("To use the SDK, you would need to:");
  console.log("1. Initialize the Anchor programs");
  console.log("2. Create an instance of AxiomIDSDK");
  console.log("3. Call the SDK methods");
  
  // Example of what the usage would look like:
  console.log("\nExample usage:");
  console.log("const tx = await sdk.createIdentity('DeFi Analyst v1', 100);");
  console.log("console.log('Identity created:', tx);");
}

main().catch(console.error);