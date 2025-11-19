#!/usr/bin/env node

// axiom-class-test.mjs - Test for AxiomChainInterface class
import AxiomChainInterface from './axiom-chain-interface.mjs';

console.log('Testing AxiomChainInterface class...');

try {
  // Test instantiation
  const axiomChainInterface = new AxiomChainInterface();
  console.log('✅ AxiomChainInterface class instantiated successfully');
  console.log(`  Program ID: ${axiomChainInterface.programId.toBase58()}`);
  
  // Test method existence
  console.log('\nTesting method existence...');
  console.log(`  createAgentIdentity method: ${typeof axiomChainInterface.createAgentIdentity}`);
  console.log(`  updateAgentReputation method: ${typeof axiomChainInterface.updateAgentReputation}`);
  console.log(`  getAgentInfo method: ${typeof axiomChainInterface.getAgentInfo}`);
  
  console.log('\n🎉 AxiomChainInterface class test passed!');
} catch (error) {
  console.error('❌ AxiomChainInterface class test failed:', error);
  process.exit(1);
}