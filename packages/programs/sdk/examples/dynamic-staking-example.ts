// Example of using Axiom ID SDK Dynamic Staking functions
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { AnchorProvider } from '@coral-xyz/anchor';
import AxiomIDSDK from '../src/index';

// Example showing the Dynamic Staking workflow
class DynamicStakingExample {
  private sdk: AxiomIDSDK;
  private userKey: Keypair;

  constructor(sdk: AxiomIDSDK, userKey: Keypair) {
    this.sdk = sdk;
    this.userKey = userKey;
  }

  /**
   * Complete workflow for dynamic staking with reputation
   */
  async runDynamicStakingWorkflow() {
    try {
      console.log('Starting Axiom ID Dynamic Staking Workflow');
      console.log('========================================');

      // 1. Stake tokens with reputation boost
      console.log('1. Staking tokens with reputation boost...');
      
      const stakeAmount = 1000; // 1000 tokens
      
      // First, we need to record some PoHW work to build reputation
      console.log('   Recording PoHW work to build reputation...');
      
      const workData = {
        schemaVersion: 1,
        totalTasks: 100,
        qualityScore: 9500,
        lastActiveTs: Math.floor(Date.now() / 1000),
        specializationTier: 2,
      };

      // Record PoHW work (this would normally be done through the TMA)
      // For this example, we'll simulate it
      console.log('   PoHW work recorded successfully');

      // Now stake with reputation
      const stakeTx = await this.sdk.dynamicStaking.stakeWithReputation(stakeAmount, this.userKey.publicKey);
      console.log(`   Tokens staked with reputation boost: ${stakeTx}`);

      // 2. Get user stake information
      console.log('2. Retrieving user stake information...');
      const userStake = await this.sdk.dynamicStaking.getUserStake(this.userKey.publicKey);
      console.log(`   User stake info: ${JSON.stringify(userStake)}`);

      // 3. Get pool information
      console.log('3. Retrieving staking pool information...');
      const poolInfo = await this.sdk.dynamicStaking.getPoolInfo();
      console.log(`   Pool info: ${JSON.stringify(poolInfo)}`);

      console.log('\nDynamic staking workflow completed successfully!');
      return true;
    } catch (error) {
      console.error('Error in dynamic staking workflow:', error);
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

  // Create a dynamic staking example instance
  const dynamicStakingExample = new DynamicStakingExample(sdk, userKey);

  // Run the dynamic staking workflow
  await dynamicStakingExample.runDynamicStakingWorkflow();
}

// Run the example
main().catch(console.error);

export { DynamicStakingExample };