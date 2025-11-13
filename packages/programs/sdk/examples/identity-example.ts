// Example of using Axiom ID SDK identity functions
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { AnchorProvider } from '@coral-xyz/anchor';
import AxiomIDSDK from '../src/index';

// Example showing the complete identity workflow
class IdentityExample {
  private sdk: AxiomIDSDK;
  private agentKey: Keypair;

  constructor(sdk: AxiomIDSDK, agentKey: Keypair) {
    this.sdk = sdk;
    this.agentKey = agentKey;
  }

  /**
   * Complete workflow for creating and managing an agent identity
   */
  async runIdentityWorkflow() {
    try {
      console.log('Starting Axiom ID Identity Workflow');
      console.log('====================================');

      // 1. Create a new AI agent identity with NTT minting and Cryptid account creation
      console.log('1. Creating new AI agent identity...');
      const createTx = await this.sdk.identity.createIdentity('DeFi Trading Agent v1.0', 1000);
      console.log(`   Identity created with transaction: ${createTx}`);

      // 2. Stake $AXIOM tokens for the agent identity
      console.log('2. Staking $AXIOM tokens...');
      const stakeTx = await this.sdk.identity.stake(500);
      console.log(`   Tokens staked with transaction: ${stakeTx}`);

      // 3. Request an attestation through SAS integration
      console.log('3. Requesting SAS attestation...');
      const attestationTx = await this.sdk.identity.requestAttestation(
        'task_completion', 
        '{"tasks_completed": 10, "success_rate": 0.95}'
      );
      console.log(`   Attestation requested with transaction: ${attestationTx}`);

      // 4. Get the identity information
      console.log('4. Retrieving identity information...');
      const identity = await this.sdk.identity.getIdentity(this.agentKey.publicKey);
      console.log(`   Identity retrieved: ${JSON.stringify(identity)}`);

      // 5. Create a soul-bound token for the agent
      console.log('5. Creating soul-bound token...');
      const sbtTx = await this.sdk.identity.createSoulBoundToken(this.agentKey.publicKey, 1);
      console.log(`   Soul-bound token created with transaction: ${sbtTx}`);

      console.log('\nIdentity workflow completed successfully!');
      return true;
    } catch (error) {
      console.error('Error in identity workflow:', error);
      return false;
    }
  }
}

// Example usage
async function main() {
  // Initialize connection and provider
  const connection = new Connection('https://api.devnet.solana.com');
  const agentKey = Keypair.generate();
  const provider = new AnchorProvider(connection, { publicKey: agentKey.publicKey, signTransaction: (() => {}) as any, signAllTransactions: (() => {}) as any }, {});

  // Initialize the Axiom ID SDK
  const sdk = new AxiomIDSDK(connection, provider);

  // Create an identity example instance
  const identityExample = new IdentityExample(sdk, agentKey);

  // Run the identity workflow
  await identityExample.runIdentityWorkflow();
}

// Run the example
main().catch(console.error);

export { IdentityExample };