#!/usr/bin/env node

// solana-test.mjs - Solana web3.js library test
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import 'dotenv/config';

console.log('Testing Solana web3.js library...');

try {
  // Test Connection
  const connection = new Connection(
    process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
    'confirmed'
  );
  console.log('✅ Connection class imported and instantiated successfully');
  
  // Test PublicKey
  const programId = new PublicKey(process.env.AXIOM_PROGRAM_ID || 'CcrbGS99N45XPZBLRxeN6q76P93iog6qGdLAiK839d6g');
  console.log('✅ PublicKey class imported and instantiated successfully');
  console.log(`  Program ID: ${programId.toBase58()}`);
  
  // Test Keypair
  const keypair = Keypair.generate();
  console.log('✅ Keypair class imported and generated successfully');
  console.log(`  Public Key: ${keypair.publicKey.toBase58()}`);
  
  console.log('\n🎉 All Solana web3.js tests passed!');
} catch (error) {
  console.error('❌ Solana web3.js test failed:', error);
  process.exit(1);
}