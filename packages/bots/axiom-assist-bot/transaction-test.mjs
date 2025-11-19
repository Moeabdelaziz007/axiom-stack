#!/usr/bin/env node

// transaction-test.mjs - Test for Solana transaction sending
import { Connection, PublicKey, Keypair, Transaction, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js';
import fs from 'fs';
import 'dotenv/config';

async function runTransactionTest() {
  try {
    console.log('Testing Solana transaction sending...');
    
    // Connect to Solana
    const connection = new Connection(
      process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
      'confirmed'
    );
    console.log('✅ Connected to Solana');
    
    // Load keypair
    const keypairPath = process.env.SOLANA_WALLET_PATH || '/Users/cryptojoker710/.config/solana/id.json';
    const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));
    const payerKeypair = Keypair.fromSecretKey(Uint8Array.from(keypairData));
    console.log(`✅ Loaded keypair: ${payerKeypair.publicKey.toBase58()}`);
    
    // Check balance
    const balance = await connection.getBalance(payerKeypair.publicKey);
    console.log(`✅ Wallet balance: ${balance / 1e9} SOL`);
    
    // Create a simple transfer transaction to test
    console.log('\nTesting simple transfer transaction...');
    const recipient = Keypair.generate().publicKey;
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: payerKeypair.publicKey,
        toPubkey: recipient,
        lamports: 1000, // 0.000001 SOL
      })
    );
    
    // Send and confirm transaction
    const signature = await sendAndConfirmTransaction(connection, transaction, [payerKeypair]);
    console.log(`✅ Transaction sent successfully with signature: ${signature}`);
    
    console.log('\n🎉 Transaction test passed!');
  } catch (error) {
    console.error('❌ Transaction test failed:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTransactionTest();
}