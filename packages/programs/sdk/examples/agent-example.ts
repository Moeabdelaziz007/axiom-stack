// Example of using Axiom ID SDK with solana-agent-kit
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { AnchorProvider } from '@coral-xyz/anchor';
import AxiomIDSDK from '../src/index';

// Example agent implementation using Axiom ID SDK
class AxiomAgent {
  private sdk: AxiomIDSDK;
  private agentKey: Keypair;

  constructor(sdk: AxiomIDSDK, agentKey: Keypair) {
    this.sdk = sdk;
    this.agentKey = agentKey;
  }

  /**
   * Create a new identity for this agent
   * @param persona Description of the agent's purpose
   * @param stakeAmount Initial amount to stake
   */
  async createIdentity(persona: string, stakeAmount: number) {
    try {
      const tx = await this.sdk.identity.createIdentity(persona, stakeAmount);
      console.log(`Identity created with transaction: ${tx}`);
      return tx;
    } catch (error) {
      console.error('Failed to create identity:', error);
      throw error;
    }
  }

  /**
   * Request an attestation for this agent
   * @param schema Schema for the attestation
   * @param data Attestation data
   */
  async requestAttestation(schema: string, data: string) {
    try {
      const tx = await this.sdk.attestations.requestAttestation(
        this.agentKey.publicKey,
        schema,
        data
      );
      console.log(`Attestation requested with transaction: ${tx}`);
      return tx;
    } catch (error) {
      console.error('Failed to request attestation:', error);
      throw error;
    }
  }

  /**
   * Stake tokens for this agent
   * @param amount Amount to stake
   */
  async stakeTokens(amount: number) {
    try {
      const tx = await this.sdk.staking.stakeTokens(amount);
      console.log(`Tokens staked with transaction: ${tx}`);
      return tx;
    } catch (error) {
      console.error('Failed to stake tokens:', error);
      throw error;
    }
  }

  /**
   * Get the reputation score for this agent
   */
  async getReputationScore() {
    try {
      const score = await this.sdk.attestations.getReputationScore(this.agentKey.publicKey);
      console.log(`Reputation score: ${score}`);
      return score;
    } catch (error) {
      console.error('Failed to get reputation score:', error);
      throw error;
    }
  }

  /**
   * Route a payment to another agent
   * @param recipient Public key of the recipient
   * @param amount Amount to send
   * @param memo Optional memo
   */
  async makePayment(recipient: PublicKey, amount: number, memo?: string) {
    try {
      const tx = await this.sdk.payments.routePayment(recipient, amount, memo);
      console.log(`Payment sent with transaction: ${tx}`);
      return tx;
    } catch (error) {
      console.error('Failed to make payment:', error);
      throw error;
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

  // Create an agent instance
  const agent = new AxiomAgent(sdk, agentKey);

  console.log('Axiom ID SDK Agent Example');
  console.log('==========================');

  try {
    // Create an identity for the agent
    await agent.createIdentity('DeFi Trading Agent v1.0', 1000);

    // Stake tokens for the agent
    await agent.stakeTokens(500);

    // Request an attestation
    await agent.requestAttestation('task_completion', '{"tasks_completed": 10, "success_rate": 0.95}');

    // Get reputation score
    await agent.getReputationScore();

    // Make a payment to another agent
    const recipient = Keypair.generate().publicKey;
    await agent.makePayment(recipient, 100, 'Payment for services');

    console.log('All operations completed successfully!');
  } catch (error) {
    console.error('Error in agent operations:', error);
  }
}

// Run the example
main().catch(console.error);

export { AxiomAgent };// Example of using Axiom ID SDK with solana-agent-kit
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { AnchorProvider } from '@coral-xyz/anchor';
import AxiomIDSDK from '../src/index';

// Example agent implementation using Axiom ID SDK
class AxiomAgent {
  private sdk: AxiomIDSDK;
  private agentKey: Keypair;

  constructor(sdk: AxiomIDSDK, agentKey: Keypair) {
    this.sdk = sdk;
    this.agentKey = agentKey;
  }

  /**
   * Create a new identity for this agent
   * @param persona Description of the agent's purpose
   * @param stakeAmount Initial amount to stake
   */
  async createIdentity(persona: string, stakeAmount: number) {
    try {
      const tx = await this.sdk.identity.createIdentity(persona, stakeAmount);
      console.log(`Identity created with transaction: ${tx}`);
      return tx;
    } catch (error) {
      console.error('Failed to create identity:', error);
      throw error;
    }
  }

  /**
   * Request an attestation for this agent
   * @param schema Schema for the attestation
   * @param data Attestation data
   */
  async requestAttestation(schema: string, data: string) {
    try {
      const tx = await this.sdk.attestations.requestAttestation(
        this.agentKey.publicKey,
        schema,
        data
      );
      console.log(`Attestation requested with transaction: ${tx}`);
      return tx;
    } catch (error) {
      console.error('Failed to request attestation:', error);
      throw error;
    }
  }

  /**
   * Stake tokens for this agent
   * @param amount Amount to stake
   */
  async stakeTokens(amount: number) {
    try {
      const tx = await this.sdk.staking.stakeTokens(amount);
      console.log(`Tokens staked with transaction: ${tx}`);
      return tx;
    } catch (error) {
      console.error('Failed to stake tokens:', error);
      throw error;
    }
  }

  /**
   * Get the reputation score for this agent
   */
  async getReputationScore() {
    try {
      const score = await this.sdk.attestations.getReputationScore(this.agentKey.publicKey);
      console.log(`Reputation score: ${score}`);
      return score;
    } catch (error) {
      console.error('Failed to get reputation score:', error);
      throw error;
    }
  }

  /**
   * Route a payment to another agent
   * @param recipient Public key of the recipient
   * @param amount Amount to send
   * @param memo Optional memo
   */
  async makePayment(recipient: PublicKey, amount: number, memo?: string) {
    try {
      const tx = await this.sdk.payments.routePayment(recipient, amount, memo);
      console.log(`Payment sent with transaction: ${tx}`);
      return tx;
    } catch (error) {
      console.error('Failed to make payment:', error);
      throw error;
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

  // Create an agent instance
  const agent = new AxiomAgent(sdk, agentKey);

  console.log('Axiom ID SDK Agent Example');
  console.log('==========================');

  try {
    // Create an identity for the agent
    await agent.createIdentity('DeFi Trading Agent v1.0', 1000);

    // Stake tokens for the agent
    await agent.stakeTokens(500);

    // Request an attestation
    await agent.requestAttestation('task_completion', '{"tasks_completed": 10, "success_rate": 0.95}');

    // Get reputation score
    await agent.getReputationScore();

    // Make a payment to another agent
    const recipient = Keypair.generate().publicKey;
    await agent.makePayment(recipient, 100, 'Payment for services');

    console.log('All operations completed successfully!');
  } catch (error) {
    console.error('Error in agent operations:', error);
  }
}

// Run the example
main().catch(console.error);

export { AxiomAgent };