// test-anchor-client.mjs - Test the Anchor client integration
import AxiomChainInterface from './axiom-chain-interface.mjs';

async function testAnchorClient() {
  try {
    console.log('Testing Anchor client integration...');
    
    // Initialize the Axiom Chain Interface
    const axiomChainInterface = new AxiomChainInterface();
    
    console.log('✅ Axiom Chain Interface initialized with Anchor client');
    
    // Test PDA derivation
    const agentId = 'test-agent-001';
    const [agentInfoPDA, bump] = await axiomChainInterface.program.methods
      .createAgent(agentId, 100)
      .accounts({
        agentInfo: null, // We just need to derive the PDA
        authority: null,
        systemProgram: null,
      })
      ._accounts.agentInfo.pda.find(axiomChainInterface.programId, [
        Buffer.from("agent"), 
        Buffer.from(agentId)
      ]);
    
    console.log(`Agent PDA derived: ${agentInfoPDA.toBase58()}`);
    
    console.log('✅ Anchor client integration test completed successfully');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testAnchorClient();
}

export default testAnchorClient;