#!/usr/bin/env node

// debug-test.mjs - Debug test for Axiom Chain Interface
import { Connection, PublicKey } from '@solana/web3.js';
import 'dotenv/config';

async function runDebugTest() {
  try {
    console.log('🚀 Starting debug test...');
    
    // Test basic Solana imports
    console.log('Testing Solana imports...');
    
    // Test Connection
    const connection = new Connection(
      process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
      'confirmed'
    );
    console.log('✅ Connection class works');
    
    // Test PublicKey
    const programId = new PublicKey(process.env.AXIOM_PROGRAM_ID || 'CcrbGS99N45XPZBLRxeN6q76P93iog6qGdLAiK839d6g');
    console.log('✅ PublicKey class works');
    console.log(`  Program ID: ${programId.toBase58()}`);
    
    // Test PDA derivation
    console.log('\nTesting PDA derivation...');
    const [agentInfoPDA, bump] = await PublicKey.findProgramAddress(
      [Buffer.from("agent"), Buffer.from("test-agent")],
      programId
    );
    console.log(`✅ PDA derivation works`);
    console.log(`  Agent PDA: ${agentInfoPDA.toBase58()}`);
    console.log(`  Bump: ${bump}`);
    
    console.log('\n🎉 Debug test passed! All basic functionality works.');
    
  } catch (error) {
    console.error('❌ Debug test failed:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runDebugTest();
}