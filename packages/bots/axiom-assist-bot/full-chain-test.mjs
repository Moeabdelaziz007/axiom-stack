#!/usr/bin/env node

// full-chain-test.mjs - Comprehensive test for Axiom Chain Interface integration
import AxiomChainInterface from './axiom-chain-interface.mjs';
import { Keypair } from '@solana/web3.js';
import fs from 'fs';
import 'dotenv/config';

async function runFullChainTest() {
  try {
    console.log('🚀 Starting comprehensive Axiom Chain Interface test...');
    
    // Initialize the Axiom Chain Interface
    const axiomChainInterface = new AxiomChainInterface();
    console.log('✅ Axiom Chain Interface initialized successfully');
    
    // Load the payer keypair from the Solana wallet
    const keypairPath = process.env.SOLANA_WALLET_PATH || '/Users/cryptojoker710/.config/solana/id.json';
    console.log(`🔑 Loading keypair from: ${keypairPath}`);
    
    if (!fs.existsSync(keypairPath)) {
      throw new Error(`Keypair file not found at ${keypairPath}`);
    }
    
    const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));
    const payerKeypair = Keypair.fromSecretKey(Uint8Array.from(keypairData));
    console.log(`✅ Payer keypair loaded: ${payerKeypair.publicKey.toBase58()}`);
    
    // Test creating an agent identity
    const testAgentId = `test-agent-${Date.now()}`;
    console.log(`\n🧪 Testing agent identity creation for: ${testAgentId}`);
    
    const signature = await axiomChainInterface.createAgentIdentity(
      testAgentId,
      50, // Initial reputation
      payerKeypair
    );
    
    console.log(`✅ Agent identity created successfully with signature: ${signature}`);
    
    // Test updating agent reputation
    console.log(`\n📈 Testing reputation update for: ${testAgentId}`);
    
    const reputationSignature = await axiomChainInterface.updateAgentReputation(
      testAgentId,
      10, // Increase reputation by 10 points
      payerKeypair
    );
    
    console.log(`✅ Agent reputation updated successfully with signature: ${reputationSignature}`);
    
    // Test fetching agent information
    console.log(`\n🔍 Testing agent information retrieval for: ${testAgentId}`);
    
    const agentInfo = await axiomChainInterface.getAgentInfo(testAgentId);
    console.log('✅ Agent information retrieved successfully:', agentInfo);
    
    console.log('\n🎉 All tests passed! Axiom Chain Interface is fully functional.');
    console.log('\n📋 Summary:');
    console.log(`  - Program ID: ${axiomChainInterface.programId.toBase58()}`);
    console.log(`  - RPC Endpoint: ${process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com'}`);
    console.log(`  - Test Agent ID: ${testAgentId}`);
    console.log(`  - Creation Signature: ${signature}`);
    console.log(`  - Reputation Update Signature: ${reputationSignature}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runFullChainTest();
}

export default runFullChainTest;