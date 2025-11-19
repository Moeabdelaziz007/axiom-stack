#!/usr/bin/env node

// register-agent.mjs - Register the Superpower Host with Firestore
import TaskService from './task-service.mjs';
import AxiomChainInterface from './axiom-chain-interface.mjs';
import { Keypair } from '@solana/web3.js';
import fs from 'fs';

async function registerAgent() {
  try {
    console.log('Registering Superpower Host with Firestore...');
    
    // Initialize the Task Service
    const taskService = new TaskService();
    await taskService.initialize();
    
    // Initialize the Axiom Chain Interface
    const axiomChainInterface = new AxiomChainInterface();
    
    // Agent configuration
    const agentId = 'axiom-superpower-host-001';
    const cloudRunUrl = process.env.AGENT_SERVICE_URL || 'https://axiom-superpower-host-abc123.a.run.app';
    
    // Capabilities of the Superpower Host
    // These should match the superpowers available in the adk-agents/superpowers directory
    const capabilities = [
      'web_scraping',
      'text_analysis',
      'get_weather',
      'example'
    ];
    
    // Register the agent
    await taskService.registerAgent(agentId, cloudRunUrl, capabilities);
    
    console.log('✅ Superpower Host registered successfully with capabilities:', capabilities);
    
    // Create on-chain identity for the agent
    console.log('Creating on-chain identity for the agent...');
    
    // Load the payer keypair from the Solana wallet
    const keypairPath = process.env.SOLANA_WALLET_PATH || '/Users/cryptojoker710/.config/solana/id.json';
    const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));
    const payerKeypair = Keypair.fromSecretKey(Uint8Array.from(keypairData));
    
    // Create the on-chain identity with initial reputation of 100
    const signature = await axiomChainInterface.createAgentIdentity(
      agentId, 
      100, // Initial reputation score
      payerKeypair
    );
    
    console.log(`✅ On-chain identity created for agent ${agentId} with transaction signature: ${signature}`);
    
  } catch (error) {
    console.error('❌ Failed to register Superpower Host:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  registerAgent();
}

export default registerAgent;