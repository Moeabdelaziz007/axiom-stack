// test_enhanced_client.mjs - Test the enhanced AxiomIDClient
import AxiomIDClient from './AxiomIDClient.mjs';
import { Keypair } from '@solana/web3.js';

async function testEnhancedClient() {
  console.log('Testing Enhanced Axiom ID Client...');
  
  try {
    // Create client instance
    const client = new AxiomIDClient();
    
    // Test connection (this will fail gracefully since we don't have a real wallet)
    console.log('\n1. Testing connection to Solana...');
    const connected = await client.connect();
    console.log('Connected:', connected);
    
    // Generate a test keypair
    console.log('\n2. Generating test keypair...');
    const testKeypair = Keypair.generate();
    console.log('Test Public Key:', testKeypair.publicKey.toString());
    
    // Test identity creation
    console.log('\n3. Creating agent identity...');
    const identityResult = await client.createAgentIdentity(testKeypair, 'Test AI Agent');
    console.log('Identity Result:', identityResult);
    
    // Test reputation score
    console.log('\n4. Getting reputation score...');
    const reputationScore = await client.getReputationScore(testKeypair.publicKey);
    console.log('Reputation Score:', reputationScore);
    
    // Test credential presentation
    console.log('\n5. Presenting credentials...');
    const credentialResult = await client.presentCredentials({
      type: 'test_credential',
      agent: testKeypair.publicKey.toString()
    });
    console.log('Credential Result:', credentialResult);
    
    // Test staking
    console.log('\n6. Staking tokens...');
    const stakeResult = await client.stakeTokens(testKeypair, 100);
    console.log('Stake Result:', stakeResult);
    
    // Test verification
    console.log('\n7. Verifying agent identity...');
    const verificationResult = await client.verifyAgentIdentity(testKeypair.publicKey, {
      credential: 'test_credential'
    });
    console.log('Verification Result:', verificationResult);
    
    console.log('\nEnhanced Axiom ID Client test completed.');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testEnhancedClient();