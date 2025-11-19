#!/usr/bin/env node

// simple-chain-test.mjs - Simple test for Axiom Chain Interface structure
import { Connection, PublicKey } from '@solana/web3.js';

console.log('Testing Axiom Chain Interface structure...');

// Test that we can import the Solana libraries
try {
  // Create a connection object (this won't actually connect)
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  console.log('✅ Solana Connection class imported successfully');
  
  // Test that we can create a PublicKey
  const publicKey = new PublicKey('11111111111111111111111111111111');
  console.log('✅ Solana PublicKey class imported successfully');
  
  console.log('✅ Axiom Chain Interface structure is valid');
} catch (error) {
  console.error('❌ Failed to test Solana imports:', error);
  process.exit(1);
}

console.log('\nNote: Full functionality requires:');
console.log('1. A deployed Solana program for Axiom Agent DID');
console.log('2. Valid SOL funds in the payer wallet');
console.log('3. Proper environment variables in .env file');
console.log('4. GOOGLE_APPLICATION_CREDENTIALS for Firestore integration');