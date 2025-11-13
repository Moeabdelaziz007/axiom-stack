// Agent.mjs - Base Agent Class for POC
import { Keypair, PublicKey } from '@solana/web3.js';
import crypto from 'crypto';
import AxiomIDClient from './AxiomIDClient.mjs';

class Agent {
  constructor(name, capabilities = []) {
    this.name = name;
    this.capabilities = capabilities;
    this.keypair = Keypair.generate();
    this.publicKey = this.keypair.publicKey;
    this.tasks = [];
    this.reputation = 0;
    this.createdAt = new Date();
    this.lastActive = new Date();
    this.axiomClient = new AxiomIDClient();
    this.identity = null;
  }

  /**
   * Execute a task
   * @param {Object} task - The task to execute
   * @returns {Object} Result of the task execution
   */
  async executeTask(task) {
    console.log(`Agent ${this.name} executing task: ${task.title}`);
    
    // Simulate task execution time
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));
    
    // Simulate task result based on agent capabilities
    const success = Math.random() > 0.1; // 90% success rate
    const quality = Math.random() * 0.5 + 0.5; // Quality between 0.5 and 1.0
    
    const result = {
      taskId: task.id,
      agent: this.publicKey.toString(),
      success,
      quality,
      timestamp: new Date(),
      signature: this.signData({ taskId: task.id, success, quality, timestamp: new Date() })
    };
    
    // Update agent state
    this.lastActive = new Date();
    if (success) {
      this.reputation += quality * 10;
    }
    
    // Store task result
    this.tasks.push(result);
    
    return result;
  }

  /**
   * Sign data with the agent's keypair
   * @param {Object} data - Data to sign
   * @returns {string} Signature
   */
  signData(data) {
    const dataString = JSON.stringify(data);
    const hash = crypto.createHash('sha256').update(dataString).digest('hex');
    // In a real implementation, we would use the Solana keypair to sign
    // For this POC, we'll just return a mock signature
    return `mock_signature_${hash.substring(0, 32)}`;
  }

  /**
   * Get agent information
   * @returns {Object} Agent information
   */
  getInfo() {
    return {
      name: this.name,
      publicKey: this.publicKey.toString(),
      capabilities: this.capabilities,
      reputation: this.reputation,
      taskCount: this.tasks.length,
      createdAt: this.createdAt,
      lastActive: this.lastActive
    };
  }

  /**
   * Get task history
   * @returns {Array} Task history
   */
  getTaskHistory() {
    return this.tasks;
  }

  /**
   * Create on-chain identity for the agent
   * @returns {Object} Identity creation result
   */
  async createIdentity() {
    if (this.identity) {
      console.log('Agent already has an identity');
      return this.identity;
    }

    console.log(`Creating on-chain identity for agent: ${this.name}`);
    this.identity = await this.axiomClient.createAgentIdentity(this.keypair, this.name);
    return this.identity;
  }

  /**
   * Get agent's reputation score from the blockchain
   * @returns {number} Reputation score
   */
  async getReputationScore() {
    if (!this.identity) {
      console.log('Agent does not have an identity yet');
      return 0;
    }

    const score = await this.axiomClient.getReputationScore(this.publicKey);
    this.reputation = score;
    return score;
  }

  /**
   * Present credentials for verification
   * @param {Object} credentials - Credentials to present
   * @returns {boolean} Verification result
   */
  async presentCredentials(credentials) {
    if (!this.identity) {
      console.log('Agent does not have an identity yet');
      return false;
    }

    return await this.axiomClient.presentCredentials(credentials);
  }

  /**
   * Stake tokens for the agent
   * @param {number} amount - Amount of tokens to stake
   * @returns {Object} Staking result
   */
  async stakeTokens(amount) {
    if (!this.identity) {
      console.log('Agent does not have an identity yet');
      return { success: false, error: 'Agent has no identity' };
    }

    return await this.axiomClient.stakeTokens(this.keypair, amount);
  }

  /**
   * Verify this agent's identity
   * @param {Object} credentials - Additional credentials to verify
   * @returns {Object} Verification result
   */
  async verifyIdentity(credentials = {}) {
    if (!this.identity) {
      console.log('Agent does not have an identity yet');
      return { verified: false, error: 'Agent has no identity' };
    }

    return await this.axiomClient.verifyAgentIdentity(this.publicKey.toString(), credentials);
  }

  /**
   * Verify a transaction signature
   * @param {string} transactionSignature - Transaction signature to verify
   * @param {string} receiverPublicKey - Receiver's public key
   * @param {number} amount - Transaction amount
   * @returns {Object} Transaction verification result
   */
  async verifyTransaction(transactionSignature, receiverPublicKey, amount) {
    if (!this.identity) {
      console.log('Agent does not have an identity yet');
      return { verified: false, error: 'Agent has no identity' };
    }

    return await this.axiomClient.verifyTransaction(
      transactionSignature,
      this.publicKey.toString(),
      receiverPublicKey,
      amount
    );
  }
}

export default Agent;