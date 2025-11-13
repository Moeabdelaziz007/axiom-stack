// test_solana_connector.mjs - Test the Solana connector
import SolanaConnector from './SolanaConnector.mjs';
import { Keypair } from '@solana/web3.js';

async function testSolanaConnector() {
  console.log('Testing Solana Connector...');
  
  try {
    // Create connector instance
    const connector = new SolanaConnector();
    
    // Get connection status
    console.log('\n1. Checking connection status...');
    const status = await connector.getConnectionStatus();
    console.log('Connection Status:', status);
    
    // Generate a test keypair
    console.log('\n2. Generating test keypair...');
    const testKeypair = Keypair.generate();
    console.log('Test Public Key:', testKeypair.publicKey.toString());
    
    // Request airdrop for testing
    console.log('\n3. Requesting airdrop...');
    try {
      const airdropSignature = await connector.requestAirdrop(testKeypair.publicKey, 1);
      console.log('Airdrop successful:', airdropSignature);
    } catch (error) {
      console.log('Airdrop failed (expected on testnet):', error.message);
    }
    
    // Test program info retrieval (using a known program ID)
    console.log('\n4. Checking program info...');
    const programId = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'; // Token program ID
    const programInfo = await connector.getProgramInfo(programId);
    console.log('Program Info:', programInfo);
    
    console.log('\nSolana Connector test completed.');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testSolanaConnector();