// Example of using Axiom ID SDK PoHW functions
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { AnchorProvider } from '@coral-xyz/anchor';
import AxiomIDSDK from '../src/index';

// Example showing the PoHW workflow
class PoHWExample {
  private sdk: AxiomIDSDK;
  private userKey: Keypair;

  constructor(sdk: AxiomIDSDK, userKey: Keypair) {
    this.sdk = sdk;
    this.userKey = userKey;
  }

  /**
   * Complete workflow for recording human work
   */
  async runPoHWWorkflow() {
    try {
      console.log('Starting Axiom ID PoHW Workflow');
      console.log('==============================');

      // 1. Record initial human work attestation
      console.log('1. Recording initial human work...');
      
      const initialWorkData = {
        schemaVersion: 1,
        totalTasks: 5,
        qualityScore: 9500,
        lastActiveTs: Math.floor(Date.now() / 1000),
        specializationTier: 2,
      };

      const recordTx = await this.sdk.pohw.recordHumanWork(this.userKey.publicKey, initialWorkData);
      console.log(`   Human work recorded with transaction: ${recordTx}`);

      // 2. Get the attestation
      console.log('2. Retrieving human work attestation...');
      const attestation = await this.sdk.pohw.getHumanWorkAttestation(this.userKey.publicKey);
      console.log(`   Attestation retrieved: ${JSON.stringify(attestation)}`);

      // 3. Update human work attestation
      console.log('3. Updating human work attestation...');
      
      const updatedWorkData = {
        schemaVersion: 1,
        totalTasks: 10,
        qualityScore: 9800,
        lastActiveTs: Math.floor(Date.now() / 1000) + 3600, // 1 hour later
        specializationTier: 2,
      };

      const updateTx = await this.sdk.pohw.updateHumanWork(this.userKey.publicKey, updatedWorkData);
      console.log(`   Human work updated with transaction: ${updateTx}`);

      // 4. Get the updated attestation
      console.log('4. Retrieving updated human work attestation...');
      const updatedAttestation = await this.sdk.pohw.getHumanWorkAttestation(this.userKey.publicKey);
      console.log(`   Updated attestation retrieved: ${JSON.stringify(updatedAttestation)}`);

      console.log('\nPoHW workflow completed successfully!');
      return true;
    } catch (error) {
      console.error('Error in PoHW workflow:', error);
      return false;
    }
  }
}

// Example usage
async function main() {
  // Initialize connection and provider
  const connection = new Connection('https://api.devnet.solana.com');
  const userKey = Keypair.generate();
  const provider = new AnchorProvider(connection, { publicKey: userKey.publicKey, signTransaction: (() => {}) as any, signAllTransactions: (() => {}) as any }, {});

  // Initialize the Axiom ID SDK
  const sdk = new AxiomIDSDK(connection, provider);

  // Create a PoHW example instance
  const pohwExample = new PoHWExample(sdk, userKey);

  // Run the PoHW workflow
  await pohwExample.runPoHWWorkflow();
}

// Run the example
main().catch(console.error);

export { PoHWExample };