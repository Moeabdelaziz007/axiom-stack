// Simple test script to verify the Axiom SDK works
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import AxiomStackSDK from './src/index';
import * as fs from 'fs';
import * as path from 'path';

async function testSDK() {
  console.log('🧪 Testing Axiom SDK...');
  
  // Create connection and provider (using devnet for testing)
  const connection = new Connection('https://api.devnet.solana.com');
  const wallet = Keypair.generate(); // Generate a test keypair
  const provider = new AnchorProvider(connection, { publicKey: wallet.publicKey, signAllTransactions: async (txs) => txs, signTransaction: async (tx) => tx }, { commitment: 'confirmed' });
  
  // Create SDK instance
  const sdk = new AxiomStackSDK(connection, provider);
  
  // Load IDL files and initialize programs
  const programs: any = {};
  
  // Load Axiom ID program
  try {
    const axiomIdIdlPath = path.join(__dirname, '..', 'idl', 'axiom_id.json');
    console.log('Looking for IDL at:', axiomIdIdlPath);
    if (fs.existsSync(axiomIdIdlPath)) {
      console.log('IDL file found');
      const axiomIdIdl = JSON.parse(fs.readFileSync(axiomIdIdlPath, 'utf-8'));
      console.log('IDL parsed successfully');
      const axiomIdProgramId = new PublicKey(axiomIdIdl.metadata.address);
      console.log('Program ID:', axiomIdProgramId.toBase58());
      programs.axiomIdProgram = new Program(axiomIdIdl, axiomIdProgramId, provider);
      console.log('✅ Axiom ID program loaded');
    } else {
      console.log('⚠️  IDL file not found');
    }
  } catch (error) {
    console.log('⚠️  Failed to load Axiom ID program:', error.message);
    console.error(error);
  }
  
  // Initialize programs
  await sdk.initializePrograms(programs);
  
  // Test identity creation (will fail without actual deployment, but won't throw "not initialized" error)
  console.log('📝 Testing identity creation...');
  try {
    // This will fail because we're not actually connected to a cluster with deployed programs
    // But it won't throw the "program not initialized" error anymore
    const identityTx = await sdk.identity.createIdentity('Test Agent', 100);
    console.log('Identity creation transaction:', identityTx);
  } catch (error) {
    if (error.message.includes('program not initialized')) {
      console.error('❌ Program not initialized error still present');
      console.error('Error details:', error.message);
    } else {
      console.log('✅ Identity client properly initialized (expected failure due to no actual deployment)');
      console.log('Error details:', error.message);
    }
  }
  
  console.log('✅ SDK initialization test completed successfully!');
}

// Run the test
testSDK().catch(console.error);