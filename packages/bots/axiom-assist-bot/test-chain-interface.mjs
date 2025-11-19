#!/usr/bin/env node

// test-chain-interface.mjs - Test the Axiom Chain Interface
import AxiomChainInterface from './axiom-chain-interface.mjs';
import { Keypair } from '@solana/web3.js';

async function testChainInterface() {
  try {
    console.log('Testing Axiom Chain Interface...');
    
    // Create an instance of the chain interface
    const chainInterface = new AxiomChainInterface();
    
    // Create a test keypair (in a real scenario, you would load this from a secure source)
    const payer = Keypair.generate();
    
    // Test creating an agent identity
    console.log('\n1. Testing createAgentIdentity...');
    const agentId = 'axiom-superpower-host-001';
    const capabilities = ['web_scraping', 'text_analysis', 'get_weather'];
    
    // Note: This will fail because we don't have real funds, but we can test the structure
    try {
      const signature = await chainInterface.createAgentIdentity(agentId, capabilities, payer);
      console.log(`   Created agent identity with signature: ${signature}`);
    } catch (error) {
      console.log(`   Expected error (no funds): ${error.message}`);
    }
    
    // Test updating agent reputation
    console.log('\n2. Testing updateAgentReputation...');
    const reputationScore = 95;
    
    try {
      const signature = await chainInterface.updateAgentReputation(agentId, reputationScore, payer);
      console.log(`   Updated agent reputation with signature: ${signature}`);
    } catch (error) {
      console.log(`   Expected error (no funds): ${error.message}`);
    }
    
    // Test getting agent information
    console.log('\n3. Testing getAgentInfo...');
    const agentInfo = await chainInterface.getAgentInfo(agentId);
    console.log('   Agent Info:', JSON.stringify(agentInfo, null, 2));
    
    console.log('\n✅ Chain interface tests completed');
  } catch (error) {
    console.error('❌ Failed to test chain interface:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testChainInterface();
}

export default testChainInterface;