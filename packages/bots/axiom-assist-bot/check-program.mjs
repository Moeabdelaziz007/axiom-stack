#!/usr/bin/env node

// check-program.mjs - Check which Solana program is actually deployed
import { Connection, PublicKey } from '@solana/web3.js';
import 'dotenv/config';

async function checkProgram() {
  try {
    // Connect to Solana Devnet
    const connection = new Connection(
      process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
      'confirmed'
    );
    
    // Check both program IDs
    const programId1 = new PublicKey('5E7eosX9X34CWCeGpw2C4ua2JRYTZqZ8MsFkxj3y6T7C'); // axiom_id
    const programId2 = new PublicKey('CcrbGS99N45XPZBLRxeN6q76P93iog6qGdLAiK839d6g'); // axiom_id_final
    
    console.log('Checking program ID: 5E7eosX9X34CWCeGpw2C4ua2JRYTZqZ8MsFkxj3y6T7C (axiom_id)');
    try {
      const accountInfo1 = await connection.getAccountInfo(programId1);
      if (accountInfo1) {
        console.log('✅ Program 1 is deployed');
        console.log('Account type:', accountInfo1.owner.toBase58());
        console.log('Executable:', accountInfo1.executable);
      } else {
        console.log('❌ Program 1 is not deployed');
      }
    } catch (error) {
      console.log('❌ Error checking program 1:', error.message);
    }
    
    console.log('\nChecking program ID: CcrbGS99N45XPZBLRxeN6q76P93iog6qGdLAiK839d6g (axiom_id_final)');
    try {
      const accountInfo2 = await connection.getAccountInfo(programId2);
      if (accountInfo2) {
        console.log('✅ Program 2 is deployed');
        console.log('Account type:', accountInfo2.owner.toBase58());
        console.log('Executable:', accountInfo2.executable);
      } else {
        console.log('❌ Program 2 is not deployed');
      }
    } catch (error) {
      console.log('❌ Error checking program 2:', error.message);
    }
    
  } catch (error) {
    console.error('Error checking programs:', error);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  checkProgram();
}

export default checkProgram;