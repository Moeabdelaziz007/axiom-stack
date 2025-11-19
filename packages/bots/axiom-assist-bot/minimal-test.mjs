#!/usr/bin/env node

// minimal-test.mjs - Minimal test to isolate the issue
import { Connection, PublicKey } from '@solana/web3.js';
import 'dotenv/config';

async function runMinimalTest() {
  try {
    console.log('Running minimal test...');
    
    // Test connection
    const connection = new Connection(
      process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
      'confirmed'
    );
    console.log('✅ Connection created');
    
    // Test program ID
    const programId = new PublicKey(process.env.AXIOM_PROGRAM_ID || 'CcrbGS99N45XPZBLRxeN6q76P93iog6qGdLAiK839d6g');
    console.log('✅ Program ID created');
    
    // Test PDA derivation
    const [agentInfoPDA, bump] = await PublicKey.findProgramAddress(
      [Buffer.from("agent"), Buffer.from("test")],
      programId
    );
    console.log('✅ PDA derived');
    console.log(`  PDA: ${agentInfoPDA.toBase58()}`);
    
    console.log('\n🎉 Minimal test passed!');
  } catch (error) {
    console.error('❌ Minimal test failed:', error);
    process.exit(1);
  }
}

runMinimalTest();