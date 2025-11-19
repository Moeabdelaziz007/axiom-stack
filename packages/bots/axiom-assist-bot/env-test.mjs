#!/usr/bin/env node

// env-test.mjs - Environment variable test
import 'dotenv/config';

console.log('Testing environment variables...');
console.log(`SOLANA_RPC_URL: ${process.env.SOLANA_RPC_URL}`);
console.log(`AXIOM_PROGRAM_ID: ${process.env.AXIOM_PROGRAM_ID}`);

if (!process.env.SOLANA_RPC_URL) {
  console.log('SOLANA_RPC_URL not found in environment');
}

if (!process.env.AXIOM_PROGRAM_ID) {
  console.log('AXIOM_PROGRAM_ID not found in environment');
}

console.log('Environment test completed.');