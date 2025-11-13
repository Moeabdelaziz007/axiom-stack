// DeFi Trading Agent Example using Axiom ID SDK
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { AnchorProvider } from '@coral-xyz/anchor';
import AxiomIDSDK from '../../sdk/src/index';

class DeFiTradingAgent {
  private sdk: AxiomIDSDK;
  private agentKey: Keypair;
  private agentPublicKey: PublicKey;

  constructor(sdk: AxiomIDSDK, agentKey: Keypair) {
    this.sdk = sdk;
    this.agentKey = agentKey;
    this.agentPublicKey = agentKey.publicKey;
  }

  /**
   * Initialize the agent with Axiom ID identity
   */
  async initialize() {
    try {
      console.log('Initializing DeFi Trading Agent...');
      
      // Create identity for the agent
      const identityTx = await this.sdk.identity.createIdentity(
        'DeFi Trading Agent v1.0 - Specialized in yield farming and arbitrage',
        1000 // Stake 1000 AXIOM tokens
      );
      console.log(`Identity created with transaction: ${identityTx}`);
      
      // Create soul-bound token for the agent
      const soulTx = await this.sdk.identity.createSoulBoundToken(
        this.agentPublicKey,
        1 // Mint 1 soul-bound token
      );
      console.log(`Soul-bound token created with transaction: ${soulTx}`);
      
      // Stake additional tokens for reputation building
      const stakeTx = await this.sdk.staking.stakeTokens(500);
      console.log(`Tokens staked with transaction: ${stakeTx}`);
      
      console.log('DeFi Trading Agent initialized successfully!');
      return true;
    } catch (error) {
      console.error('Failed to initialize DeFi Trading Agent:', error);
      return false;
    }
  }

  /**
   * Execute a trading strategy and request attestation
   * @param strategyName Name of the trading strategy
   * @param profit Profit from the strategy execution
   */
  async executeTradingStrategy(strategyName: string, profit: number) {
    try {
      console.log(`Executing trading strategy: ${strategyName}`);
      
      // Simulate strategy execution
      console.log(`Strategy ${strategyName} executed with profit: ${profit} USDC`);
      
      // Request attestation for successful strategy execution
      const attestationData = {
        strategy: strategyName,
        profit: profit,
        timestamp: Date.now(),
        agent: this.agentPublicKey.toString()
      };
      
      const attestationTx = await this.sdk.attestations.requestAttestation(
        'trading_strategy_execution',
        JSON.stringify(attestationData)
      );
      console.log(`Attestation requested with transaction: ${attestationTx}`);
      
      // Update reputation based on profit
      const reputationBoost = Math.min(100, Math.floor(profit / 10));
      console.log(`Reputation boosted by ${reputationBoost} points`);
      
      return {
        success: true,
        attestationTx,
        reputationBoost
      };
    } catch (error) {
      console.error('Failed to execute trading strategy:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get the agent's current reputation score
   */
  async getReputationScore() {
    try {
      const score = await this.sdk.attestations.getReputationScore(this.agentPublicKey);
      console.log(`Current reputation score: ${score}`);
      return score;
    } catch (error) {
      console.error('Failed to get reputation score:', error);
      return 0;
    }
  }

  /**
   * Present credentials for verification
   * @param credentialTypes Types of credentials to present
   */
  async presentCredentials(credentialTypes: string[]) {
    try {
      console.log(`Presenting credentials: ${credentialTypes.join(', ')}`);
      
      const credentials = await this.sdk.identity.presentCredentials({
        agent: this.agentPublicKey.toString(),
        types: credentialTypes,
        timestamp: Date.now()
      });
      
      console.log('Credentials presented successfully');
      return credentials;
    } catch (error) {
      console.error('Failed to present credentials:', error);
      return null;
    }
  }

  /**
   * Route a payment to another agent or service
   * @param recipient Public key of the recipient
   * @param amount Amount to send
   * @param memo Optional memo
   */
  async makePayment(recipient: PublicKey, amount: number, memo?: string) {
    try {
      console.log(`Making payment of ${amount} tokens to ${recipient.toString()}`);
      
      const tx = await this.sdk.payments.routePayment(recipient, amount, memo);
      console.log(`Payment sent with transaction: ${tx}`);
      return tx;
    } catch (error) {
      console.error('Failed to make payment:', error);
      return null;
    }
  }

  /**
   * Get staking information for the agent
   */
  async getStakingInfo() {
    try {
      const stakingInfo = await this.sdk.staking.getUserStake(this.agentPublicKey);
      console.log('Staking information retrieved');
      return stakingInfo;
    } catch (error) {
      console.error('Failed to get staking information:', error);
      return null;
    }
  }
}

// Example usage
async function main() {
  try {
    // Initialize connection and provider
    const connection = new Connection('https://api.devnet.solana.com');
    const agentKey = Keypair.generate();
    const provider = new AnchorProvider(
      connection,
      { publicKey: agentKey.publicKey, signTransaction: (() => {}) as any, signAllTransactions: (() => {}) as any },
      {}
    );
    
    // Initialize the Axiom ID SDK
    const sdk = new AxiomIDSDK(connection, provider);
    
    // Create and initialize the DeFi trading agent
    const defiAgent = new DeFiTradingAgent(sdk, agentKey);
    
    console.log('=== DeFi Trading Agent Example ===');
    
    // Initialize the agent
    await defiAgent.initialize();
    
    // Execute some trading strategies
    await defiAgent.executeTradingStrategy('Yield Farming Strategy', 150);
    await defiAgent.executeTradingStrategy('Arbitrage Strategy', 75);
    await defiAgent.executeTradingStrategy('Liquidity Provision Strategy', 200);
    
    // Check reputation score
    await defiAgent.getReputationScore();
    
    // Present credentials
    await defiAgent.presentCredentials(['trading_strategy_execution', 'yield_farming']);
    
    // Get staking information
    await defiAgent.getStakingInfo();
    
    // Make a payment to another agent
    const recipient = Keypair.generate().publicKey;
    await defiAgent.makePayment(recipient, 100, 'Performance fee');
    
    console.log('=== DeFi Trading Agent Example Completed ===');
  } catch (error) {
    console.error('Error in DeFi Trading Agent example:', error);
  }
}

// Run the example
main().catch(console.error);

export { DeFiTradingAgent };