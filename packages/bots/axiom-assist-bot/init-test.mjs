#!/usr/bin/env node

// init-test.mjs - Simple test for Axiom Chain Interface initialization
import AxiomChainInterface from './axiom-chain-interface.mjs';
import 'dotenv/config';

async function runInitTest() {
  try {
    console.log('🚀 Testing Axiom Chain Interface initialization...');
    
    // Initialize the Axiom Chain Interface
    const axiomChainInterface = new AxiomChainInterface();
    console.log('✅ Axiom Chain Interface initialized successfully');
    
    console.log('\n📋 Configuration:');
    console.log(`  - Program ID: ${axiomChainInterface.programId.toBase58()}`);
    console.log(`  - RPC Endpoint: ${process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com'}`);
    
    console.log('\n🎉 Initialization test passed!');
    
  } catch (error) {
    console.error('❌ Initialization test failed:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runInitTest();
}