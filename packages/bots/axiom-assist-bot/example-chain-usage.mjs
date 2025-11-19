#!/usr/bin/env node

// example-chain-usage.mjs - Example usage of the Axiom Chain Interface
import { Keypair } from '@solana/web3.js';

function exampleUsage() {
  console.log('Axiom Chain Interface Usage Example');
  console.log('====================================');
  
  // In a real scenario, you would load the payer keypair from a secure source
  // const payer = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(require('fs').readFileSync('path/to/keypair.json'))));
  const payer = Keypair.generate(); // This generates a new keypair for testing
  
  // Agent information
  const agentId = 'axiom-superpower-host-001';
  const capabilities = ['web_scraping', 'text_analysis', 'get_weather'];
  
  console.log(`\nAgent ID: ${agentId}`);
  console.log(`Capabilities: ${capabilities.join(', ')}`);
  
  console.log('\nTo use this interface in production, you need to:');
  console.log('1. Deploy the Axiom Agent DID program to Solana');
  console.log('2. Fund the payer wallet with SOL tokens');
  console.log('3. Set the correct AXIOM_PROGRAM_ID in your .env file');
  console.log('4. Load a valid keypair from a secure source');
  
  console.log('\nExample functions available:');
  console.log('- createAgentIdentity(agentId, capabilities, payer)');
  console.log('- updateAgentReputation(agentId, reputationScore, payer)');
  console.log('- getAgentInfo(agentId)');
  
  console.log('\n✅ Example setup completed');
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  exampleUsage();
}

// Call the function directly for immediate execution
exampleUsage();

export default exampleUsage;