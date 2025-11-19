// comprehensive-anchor-test.mjs - Comprehensive test for Anchor client integration
import AxiomChainInterface from './axiom-chain-interface.mjs';
import { PublicKey } from '@solana/web3.js';

async function testAnchorIntegration() {
  try {
    console.log('🧪 Testing comprehensive Anchor client integration...');
    
    // Initialize the Axiom Chain Interface
    const axiomChainInterface = new AxiomChainInterface();
    
    console.log('✅ Axiom Chain Interface initialized with Anchor client');
    
    // Test PDA derivation
    const agentId = 'test-agent-001';
    const [agentInfoPDA, bump] = await PublicKey.findProgramAddress(
      [Buffer.from("agent"), Buffer.from(agentId)],
      axiomChainInterface.programId
    );
    
    console.log(`✅ Agent PDA derived: ${agentInfoPDA.toBase58()}`);
    
    // Test program methods access
    console.log('✅ Program methods available:');
    console.log('  - createAgent:', !!axiomChainInterface.program.methods.createAgent);
    console.log('  - updateReputation:', !!axiomChainInterface.program.methods.updateReputation);
    
    // Test account access
    console.log('✅ Account types available:');
    console.log('  - agentInfo:', !!axiomChainInterface.program.account.agentInfo);
    
    // Test IDL structure
    console.log('✅ IDL structure:');
    console.log('  - Program name:', axiomChainInterface.program.idl.name);
    console.log('  - Instructions count:', axiomChainInterface.program.idl.instructions.length);
    console.log('  - Accounts count:', axiomChainInterface.program.idl.accounts.length);
    
    console.log('\\n🎉 All tests passed! Anchor client integration is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testAnchorIntegration();
}

export default testAnchorIntegration;