// Example of using Axiom ID SDK with solana-agent-kit
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { AnchorProvider } from '@coral-xyz/anchor';
import AxiomIDSDK from '../src/index';

// This example demonstrates how to integrate Axiom ID SDK with solana-agent-kit
// Note: In a real implementation, you would import from 'solana-agent-kit'
// For this example, we'll create mock classes to demonstrate the integration pattern

// Mock solana-agent-kit classes to demonstrate integration pattern
class MockSolanaAgentKit {
  private keypair: Keypair;
  
  constructor(keypair: Keypair) {
    this.keypair = keypair;
  }
  
  get publicKey(): PublicKey {
    return this.keypair.publicKey;
  }
  
  // Example agent method that would use Axiom ID for identity management
  async executeTask(taskDescription: string) {
    console.log(`Executing task: ${taskDescription}`);
    // In a real implementation, this would execute the actual task
    return {
      success: true,
      result: `Task "${taskDescription}" completed successfully`
    };
  }
  
  // Example method that integrates with Axiom ID for reputation management
  async reportTaskCompletion(taskId: string, success: boolean) {
    console.log(`Reporting completion for task: ${taskId}`);
    // In a real implementation, this would report to Axiom ID for attestation
    return {
      reported: true,
      taskId
    };
  }
}

// Wrapper class that combines solana-agent-kit with Axiom ID functionality
class AxiomIntegratedAgent {
  private sdk: AxiomIDSDK;
  private agentKit: MockSolanaAgentKit;
  private agentKey: Keypair;
  
  constructor(sdk: AxiomIDSDK, agentKit: MockSolanaAgentKit, agentKey: Keypair) {
    this.sdk = sdk;
    this.agentKit = agentKit;
    this.agentKey = agentKey;
  }
  
  /**
   * Initialize the agent with Axiom ID identity
   * @param persona Description of the agent's purpose
   * @param stakeAmount Initial amount to stake
   */
  async initializeIdentity(persona: string, stakeAmount: number) {
    try {
      console.log('Initializing Axiom ID identity for agent...');
      
      // Create identity on-chain
      const identityTx = await this.sdk.identity.createIdentity(persona, stakeAmount);
      console.log(`Identity created with transaction: ${identityTx}`);
      
      // Stake tokens for reputation building
      const stakeTx = await this.sdk.staking.stakeTokens(stakeAmount * 0.5);
      console.log(`Tokens staked with transaction: ${stakeTx}`);
      
      return {
        identityTx,
        stakeTx
      };
    } catch (error) {
      console.error('Failed to initialize identity:', error);
      throw error;
    }
  }
  
  /**
   * Execute a task using solana-agent-kit and report to Axiom ID
   * @param taskDescription Description of the task to execute
   */
  async executeAndReportTask(taskDescription: string) {
    try {
      console.log(`Executing task with Axiom ID integration: ${taskDescription}`);
      
      // Execute task using solana-agent-kit
      const taskResult = await this.agentKit.executeTask(taskDescription);
      
      if (taskResult.success) {
        // Report successful completion to Axiom ID for attestation
        const taskId = `task_${Date.now()}`;
        const reportResult = await this.agentKit.reportTaskCompletion(taskId, true);
        
        // Request attestation for the completed task
        const attestationData = JSON.stringify({
          task_id: taskId,
          description: taskDescription,
          completed_at: new Date().toISOString(),
          result: taskResult.result
        });
        
        const attestationTx = await this.sdk.attestations.requestAttestation(
          this.agentKey.publicKey,
          'task_completion',
          attestationData
        );
        
        console.log(`Task completed and attested with transaction: ${attestationTx}`);
        
        return {
          taskResult,
          reportResult,
          attestationTx
        };
      } else {
        console.error('Task execution failed:', taskResult);
        throw new Error('Task execution failed');
      }
    } catch (error) {
      console.error('Failed to execute and report task:', error);
      throw error;
    }
  }
  
  /**
   * Get the agent's reputation score from Axiom ID
   */
  async getReputationScore() {
    try {
      const score = await this.sdk.attestations.getReputationScore(this.agentKey.publicKey);
      console.log(`Current reputation score: ${score}`);
      return score;
    } catch (error) {
      console.error('Failed to get reputation score:', error);
      throw error;
    }
  }
  
  /**
   * Present credentials to another agent or service
   * @param schemas List of credential schemas to present
   */
  async presentCredentials(schemas: string[]) {
    try {
      const credentials = await this.sdk.identity.presentCredentials(schemas);
      console.log(`Presented credentials: ${JSON.stringify(credentials)}`);
      return credentials;
    } catch (error) {
      console.error('Failed to present credentials:', error);
      throw error;
    }
  }
  
  /**
   * Route a payment to another agent through Axiom ID
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
  console.log('Axiom ID SDK + solana-agent-kit Integration Example');
  console.log('==================================================');
  
  try {
    // Initialize connection and provider
    const connection = new Connection('https://api.devnet.solana.com');
    const agentKey = Keypair.generate();
    const provider = new AnchorProvider(
      connection, 
      { 
        publicKey: agentKey.publicKey, 
        signTransaction: (() => {}) as any, 
        signAllTransactions: (() => {}) as any 
      }, 
      {}
    );
    
    // Initialize the Axiom ID SDK
    const sdk = new AxiomIDSDK(connection, provider);
    
    // Initialize solana-agent-kit
    const agentKit = new MockSolanaAgentKit(agentKey);
    
    // Create integrated agent
    const integratedAgent = new AxiomIntegratedAgent(sdk, agentKit, agentKey);
    
    // Initialize identity
    await integratedAgent.initializeIdentity('DeFi Trading Agent v1.0', 1000);
    
    // Execute and report tasks
    await integratedAgent.executeAndReportTask('Analyze market trends');
    await integratedAgent.executeAndReportTask('Execute trade strategy');
    await integratedAgent.executeAndReportTask('Generate performance report');
    
    // Check reputation score
    await integratedAgent.getReputationScore();
    
    // Present credentials
    await integratedAgent.presentCredentials(['task_completion']);
    
    // Make a payment
    const recipient = Keypair.generate().publicKey;
    await integratedAgent.makePayment(recipient, 100, 'Payment for services');
    
    console.log('All operations completed successfully!');
  } catch (error) {
    console.error('Error in integrated agent operations:', error);
  }
}

// Run the example
main().catch(console.error);

export { AxiomIntegratedAgent, MockSolanaAgentKit };