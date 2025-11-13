// Content Creation Agent Example using Axiom ID SDK
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { AnchorProvider } from '@coral-xyz/anchor';
import AxiomIDSDK from '../../sdk/src/index';

class ContentCreationAgent {
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
      console.log('Initializing Content Creation Agent...');
      
      // Create identity for the agent
      const identityTx = await this.sdk.identity.createIdentity(
        'Content Creation Agent v1.0 - Specialized in AI-generated articles and social media content',
        500 // Stake 500 AXIOM tokens
      );
      console.log(`Identity created with transaction: ${identityTx}`);
      
      // Create soul-bound token for the agent
      const soulTx = await this.sdk.identity.createSoulBoundToken(
        this.agentPublicKey,
        1 // Mint 1 soul-bound token
      );
      console.log(`Soul-bound token created with transaction: ${soulTx}`);
      
      console.log('Content Creation Agent initialized successfully!');
      return true;
    } catch (error) {
      console.error('Failed to initialize Content Creation Agent:', error);
      return false;
    }
  }

  /**
   * Create content and request attestation
   * @param contentType Type of content created
   * @param contentTitle Title of the content
   * @param qualityScore Quality score of the content (0-100)
   */
  async createContent(contentType: string, contentTitle: string, qualityScore: number) {
    try {
      console.log(`Creating ${contentType}: ${contentTitle}`);
      
      // Simulate content creation
      console.log(`Content "${contentTitle}" created with quality score: ${qualityScore}`);
      
      // Request attestation for content creation
      const attestationData = {
        contentType: contentType,
        contentTitle: contentTitle,
        qualityScore: qualityScore,
        timestamp: Date.now(),
        agent: this.agentPublicKey.toString()
      };
      
      const attestationTx = await this.sdk.attestations.requestAttestation(
        'content_creation',
        JSON.stringify(attestationData)
      );
      console.log(`Attestation requested with transaction: ${attestationTx}`);
      
      // Update reputation based on quality score
      const reputationBoost = Math.min(50, Math.floor(qualityScore / 2));
      console.log(`Reputation boosted by ${reputationBoost} points`);
      
      return {
        success: true,
        attestationTx,
        reputationBoost
      };
    } catch (error) {
      console.error('Failed to create content:', error);
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
   * Get content creation history
   */
  async getContentHistory() {
    try {
      // This would typically query on-chain data or indexed data
      console.log('Retrieving content creation history');
      
      // Simulate retrieving history
      const history = [
        { type: 'article', title: 'The Future of AI in Finance', quality: 95, date: '2023-06-15' },
        { type: 'social_post', title: 'Market Update Tweet', quality: 85, date: '2023-06-14' },
        { type: 'blog_post', title: 'Understanding DeFi Protocols', quality: 90, date: '2023-06-10' }
      ];
      
      console.log('Content history retrieved');
      return history;
    } catch (error) {
      console.error('Failed to get content history:', error);
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
    
    // Create and initialize the Content Creation agent
    const contentAgent = new ContentCreationAgent(sdk, agentKey);
    
    console.log('=== Content Creation Agent Example ===');
    
    // Initialize the agent
    await contentAgent.initialize();
    
    // Create some content
    await contentAgent.createContent('article', 'The Future of AI in Finance', 95);
    await contentAgent.createContent('social_post', 'Market Update Tweet', 85);
    await contentAgent.createContent('blog_post', 'Understanding DeFi Protocols', 90);
    
    // Check reputation score
    await contentAgent.getReputationScore();
    
    // Present credentials
    await contentAgent.presentCredentials(['content_creation', 'article_writing']);
    
    // Get content history
    await contentAgent.getContentHistory();
    
    // Make a payment to another agent
    const recipient = Keypair.generate().publicKey;
    await contentAgent.makePayment(recipient, 50, 'Content licensing fee');
    
    console.log('=== Content Creation Agent Example Completed ===');
  } catch (error) {
    console.error('Error in Content Creation Agent example:', error);
  }
}

// Run the example
main().catch(console.error);

export { ContentCreationAgent };