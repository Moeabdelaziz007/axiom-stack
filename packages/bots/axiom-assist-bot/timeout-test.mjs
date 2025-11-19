#!/usr/bin/env node

// timeout-test.mjs - Test with timeout to identify hanging issues
import AxiomChainInterface from './axiom-chain-interface.mjs';
import { Keypair } from '@solana/web3.js';
import fs from 'fs';
import 'dotenv/config';

async function runTimeoutTest() {
  try {
    console.log('Running timeout test...');
    
    // Initialize the Axiom Chain Interface
    const axiomChainInterface = new AxiomChainInterface();
    console.log('✅ Axiom Chain Interface initialized');
    
    // Load the payer keypair
    const keypairPath = process.env.SOLANA_WALLET_PATH || '/Users/cryptojoker710/.config/solana/id.json';
    const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));
    const payerKeypair = Keypair.fromSecretKey(Uint8Array.from(keypairData));
    console.log('✅ Keypair loaded');
    
    // Test with timeout
    console.log('Testing createAgentIdentity with timeout...');
    
    // Set a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Operation timed out')), 30000); // 30 second timeout
    });
    
    // Create agent identity promise
    const createAgentPromise = axiomChainInterface.createAgentIdentity(
      'timeout-test-agent',
      50,
      payerKeypair
    );
    
    // Race between the two promises
    const signature = await Promise.race([createAgentPromise, timeoutPromise]);
    console.log(`✅ Agent identity created with signature: ${signature}`);
    
    console.log('\n🎉 Timeout test passed!');
  } catch (error) {
    console.error('❌ Timeout test failed:', error);
    process.exit(1);
  }
}

runTimeoutTest();