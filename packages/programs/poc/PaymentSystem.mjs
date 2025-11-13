// PaymentSystem.mjs - Payment System for POC
import AxiomIDClient from './AxiomIDClient.mjs';

class PaymentSystem {
  constructor() {
    this.axiomClient = new AxiomIDClient();
    this.balances = new Map(); // In a real implementation, this would be on-chain
  }

  /**
   * Initialize an agent's balance
   * @param {string} agentPublicKey - Agent's public key
   * @param {number} initialBalance - Initial balance
   */
  initializeBalance(agentPublicKey, initialBalance = 1000) {
    this.balances.set(agentPublicKey, initialBalance);
    console.log(`Initialized balance for ${agentPublicKey}: ${initialBalance} tokens`);
  }

  /**
   * Get an agent's balance
   * @param {string} agentPublicKey - Agent's public key
   * @returns {number} Balance
   */
  getBalance(agentPublicKey) {
    return this.balances.get(agentPublicKey) || 0;
  }

  /**
   * Execute a trusted atomic transaction between two agents
   * @param {string} senderPublicKey - Sender's public key
   * @param {string} receiverPublicKey - Receiver's public key
   * @param {number} amount - Amount to transfer
   * @param {Object} taskInfo - Information about the task being paid for
   * @returns {Object} Transaction result
   */
  async executeAtomicTransaction(senderPublicKey, receiverPublicKey, amount, taskInfo) {
    console.log(`Executing atomic transaction: ${senderPublicKey} -> ${receiverPublicKey} (${amount} tokens)`);
    
    // Verify both agents have identities
    const senderBalance = this.getBalance(senderPublicKey);
    const receiverBalance = this.getBalance(receiverPublicKey);
    
    if (senderBalance < amount) {
      return {
        success: false,
        error: 'Insufficient balance',
        senderBalance,
        receiverBalance
      };
    }
    
    // Present credentials for verification before transaction
    console.log('Verifying sender credentials...');
    const senderVerified = await this.axiomClient.presentCredentials({
      type: 'payment_sender',
      publicKey: senderPublicKey,
      amount: amount,
      task: taskInfo,
      timestamp: new Date()
    });
    
    if (!senderVerified) {
      return {
        success: false,
        error: 'Sender verification failed',
        senderBalance,
        receiverBalance
      };
    }
    
    console.log('Verifying receiver credentials...');
    const receiverVerified = await this.axiomClient.presentCredentials({
      type: 'payment_receiver',
      publicKey: receiverPublicKey,
      amount: amount,
      task: taskInfo,
      timestamp: new Date()
    });
    
    if (!receiverVerified) {
      return {
        success: false,
        error: 'Receiver verification failed',
        senderBalance,
        receiverBalance
      };
    }
    
    // Get reputation scores for both parties
    console.log('Fetching reputation scores...');
    const senderReputation = await this.axiomClient.getReputationScore(senderPublicKey);
    const receiverReputation = await this.axiomClient.getReputationScore(receiverPublicKey);
    
    // Check if both parties have sufficient reputation
    const minReputation = 20;
    if (senderReputation < minReputation) {
      return {
        success: false,
        error: `Sender reputation too low: ${senderReputation} < ${minReputation}`,
        senderReputation,
        receiverReputation
      };
    }
    
    if (receiverReputation < minReputation) {
      return {
        success: false,
        error: `Receiver reputation too low: ${receiverReputation} < ${minReputation}`,
        senderReputation,
        receiverReputation
      };
    }
    
    // Execute the transaction
    console.log('Executing transaction...');
    
    // Simulate transaction processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update balances
    this.balances.set(senderPublicKey, senderBalance - amount);
    this.balances.set(receiverPublicKey, receiverBalance + amount);
    
    // Generate a mock transaction signature
    const transactionSignature = `mock_tx_signature_${Math.random().toString(36).substring(2, 15)}`;
    
    const result = {
      success: true,
      amount,
      sender: senderPublicKey,
      receiver: receiverPublicKey,
      senderBalance: this.getBalance(senderPublicKey),
      receiverBalance: this.getBalance(receiverPublicKey),
      senderReputation,
      receiverReputation,
      taskInfo,
      timestamp: new Date(),
      transactionSignature
    };
    
    console.log(`Transaction successful: ${transactionSignature}`);
    return result;
  }

  /**
   * Get payment history for an agent
   * @param {string} agentPublicKey - Agent's public key
   * @returns {Array} Payment history
   */
  getPaymentHistory(agentPublicKey) {
    // In a real implementation, this would query on-chain data
    // For this POC, we'll return an empty array
    return [];
  }
}

export default PaymentSystem;