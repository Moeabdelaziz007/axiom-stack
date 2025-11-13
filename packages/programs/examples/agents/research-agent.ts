// Research Agent Example using Axiom ID SDK
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { AnchorProvider } from '@coral-xyz/anchor';
import AxiomIDSDK from '../../sdk/src/index';

class ResearchAgent {
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
      console.log('Initializing Research Agent...');
      
      // Create identity for the agent
      const identityTx = await this.sdk.identity.createIdentity(
        'Research Agent v1.0 - Specialized in data analysis and academic research',
        750 // Stake 750 AXIOM tokens
      );
      console.log(`Identity created with transaction: ${identityTx}`);
      
      // Create soul-bound token for the agent
      const soulTx = await this.sdk.identity.createSoulBoundToken(
        this.agentPublicKey,
        1 // Mint 1 soul-bound token
      );
      console.log(`Soul-bound token created with transaction: ${soulTx}`);
      
      // Stake additional tokens for reputation building
      const stakeTx = await this.sdk.staking.stakeTokens(250);
      console.log(`Tokens staked with transaction: ${stakeTx}`);
      
      console.log('Research Agent initialized successfully!');
      return true;
    } catch (error) {
      console.error('Failed to initialize Research Agent:', error);
      return false;
    }
  }

  /**
   * Conduct research and request attestation
   * @param researchTopic Topic of the research
   * @param findings Research findings
   * @param accuracyScore Accuracy score of the research (0-100)
   */
  async conductResearch(researchTopic: string, findings: string, accuracyScore: number) {
    try {
      console.log(`Conducting research on: ${researchTopic}`);
      
      // Simulate research process
      console.log(`Research findings: ${findings}`);
      console.log(`Accuracy score: ${accuracyScore}`);
      
      // Request attestation for research completion
      const attestationData = {
        researchTopic: researchTopic,
        findings: findings,
        accuracyScore: accuracyScore,
        timestamp: Date.now(),
        agent: this.agentPublicKey.toString()
      };
      
      const attestationTx = await this.sdk.attestations.requestAttestation(
        'research_completion',
        JSON.stringify(attestationData)
      );
      console.log(`Attestation requested with transaction: ${attestationTx}`);
      
      // Update reputation based on accuracy score
      const reputationBoost = Math.min(75, Math.floor(accuracyScore / 1.33));
      console.log(`Reputation boosted by ${reputationBoost} points`);
      
      return {
        success: true,
        attestationTx,
        reputationBoost
      };
    } catch (error) {
      console.error('Failed to conduct research:', error);
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
   * Collaborate with another research agent
   * @param collaborator Public key of the collaborator
   * @param researchTopic Topic to collaborate on
   */
  async collaborateWithAgent(collaborator: PublicKey, researchTopic: string) {
    try {
      console.log(`Collaborating with agent ${collaborator.toString()} on ${researchTopic}`);
      
      // Request collaboration attestation
      const collaborationData = {
        collaborator: collaborator.toString(),
        researchTopic: researchTopic,
        timestamp: Date.now(),
        agent: this.agentPublicKey.toString()
      };
      
      const attestationTx = await this.sdk.attestations.requestAttestation(
        'research_collaboration',
        JSON.stringify(collaborationData)
      );
      console.log(`Collaboration attestation requested with transaction: ${attestationTx}`);
      
      // Make a payment for collaboration
      const paymentTx = await this.makePayment(collaborator, 100, 'Collaboration fee');
      
      return {
        success: true,
        attestationTx,
        paymentTx
      };
    } catch (error) {
      console.error('Failed to collaborate with agent:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get research portfolio
   */
  async getResearchPortfolio() {
    try {
      // This would typically query on-chain data or indexed data
      console.log('Retrieving research portfolio');
      
      // Simulate retrieving portfolio
      const portfolio = [
        { topic: 'AI in Financial Markets', accuracy: 92, date: '2023-06-15' },
        { topic: 'Blockchain Scalability Solutions', accuracy: 88, date: '2023-06-10' },
        { topic: 'Decentralized Governance Models', accuracy: 95, date: '2023-06-05' }
      ];
      
      console.log('Research portfolio retrieved');
      return portfolio;
    } catch (error) {
      console.error('Failed to get research portfolio:', error);
      return [];
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
    
    // Create and initialize the Research agent
    const researchAgent = new ResearchAgent(sdk, agentKey);
    
    console.log('=== Research Agent Example ===');
    
    // Initialize the agent
    await researchAgent.initialize();
    
    // Conduct some research
    await researchAgent.conductResearch(
      'AI in Financial Markets', 
      'Analysis shows 15% improvement in prediction accuracy using transformer models',
      92
    );
    
    await researchAgent.conductResearch(
      'Blockchain Scalability Solutions', 
      'Layer 2 solutions can increase throughput by 100x while maintaining security',
      88
    );
    
    // Check reputation score
    await researchAgent.getReputationScore();
    
    // Present credentials
    await researchAgent.presentCredentials(['research_completion', 'data_analysis']);
    
    // Get research portfolio
    await researchAgent.getResearchPortfolio();
    
    // Collaborate with another agent
    const collaborator = Keypair.generate().publicKey;
    await researchAgent.collaborateWithAgent(collaborator, 'Cross-chain Interoperability');
    
    console.log('=== Research Agent Example Completed ===');
  } catch (error) {
    console.error('Error in Research Agent example:', error);
  }
}

// Run the example
main().catch(console.error);

export { ResearchAgent };