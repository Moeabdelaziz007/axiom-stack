#!/usr/bin/env node

// basic-program-test.mjs - Basic test to call the deployed program
import { Connection, PublicKey, Keypair, Transaction, TransactionInstruction, sendAndConfirmTransaction } from '@solana/web3.js';
import fs from 'fs';
import 'dotenv/config';

async function runBasicProgramTest() {
  try {
    console.log('Running basic program test...');
    
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
    console.log('✅ Keypair loaded');
    
    // Program ID
    const programId = new PublicKey(process.env.AXIOM_PROGRAM_ID || 'CcrbGS99N45XPZBLRxeN6q76P93iog6qGdLAiK839d6g');
    console.log(`✅ Program ID: ${programId.toBase58()}`);
    
    // Derive PDA
    const agentId = 'basic-test-agent';
    const [agentInfoPDA, bump] = await PublicKey.findProgramAddress(
      [Buffer.from("agent"), Buffer.from(agentId)],
      programId
    );
    console.log(`✅ PDA derived: ${agentInfoPDA.toBase58()}`);
    
    // Create a very simple instruction with just the instruction index
    const instructionData = Buffer.from([0]); // Just the instruction index for create_agent
    
    // Create instruction
    const instruction = new TransactionInstruction({
      keys: [
        {
          pubkey: agentInfoPDA,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: payerKeypair.publicKey,
          isSigner: true,
          isWritable: true,
        },
        {
          pubkey: new PublicKey('11111111111111111111111111111111'), // System program
          isSigner: false,
          isWritable: false,
        }
      ],
      programId: programId,
      data: instructionData,
    });
    
    console.log('✅ Instruction created');
    
    // Create transaction
    const transaction = new Transaction().add(instruction);
    console.log('✅ Transaction created');
    
    // Send transaction with a short timeout
    console.log('Sending transaction...');
    const signature = await sendAndConfirmTransaction(connection, transaction, [payerKeypair]);
    console.log(`✅ Transaction sent with signature: ${signature}`);
    
    console.log('\n🎉 Basic program test passed!');
  } catch (error) {
    console.error('❌ Basic program test failed:', error);
    if (error.transactionLogs) {
      console.error('Transaction logs:', error.transactionLogs);
    }
    process.exit(1);
  }
}

runBasicProgramTest();