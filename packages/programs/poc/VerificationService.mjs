// VerificationService.mjs - Verification Service for POC
import AxiomIDClient from './AxiomIDClient.mjs';

class VerificationService {
  constructor() {
    this.axiomClient = new AxiomIDClient();
  }

  /**
   * Verify an agent's identity and return trust metrics
   * This serves as the endpoint for identity verification
   * @param {string} agentPublicKey - The agent's public key to verify
   * @param {Object} credentials - Optional credentials to verify
   * @returns {Object} Verification result with trust metrics
   */
  async verifyAgentEndpoint(agentPublicKey, credentials = {}) {
    console.log(`Verification endpoint called for agent: ${agentPublicKey}`);
    
    try {
      // Verify the agent's identity
      const verificationResult = await this.axiomClient.verifyAgentIdentity(agentPublicKey, credentials);
      
      return {
        success: true,
        agentPublicKey,
        verified: verificationResult.verified,
        trustScore: verificationResult.trustScore,
        reputationScore: verificationResult.reputationScore,
        timestamp: new Date(),
        verificationSignature: verificationResult.verificationSignature
      };
    } catch (error) {
      console.error(`Verification failed for agent ${agentPublicKey}:`, error);
      return {
        success: false,
        agentPublicKey,
        error: error.message || 'Verification failed',
        timestamp: new Date()
      };
    }
  }

  /**
   * Verify a transaction and its participants
   * @param {string} transactionSignature - Transaction signature to verify
   * @param {string} senderPublicKey - Sender's public key
   * @param {string} receiverPublicKey - Receiver's public key
   * @param {number} amount - Transaction amount
   * @returns {Object} Transaction verification result
   */
  async verifyTransactionEndpoint(transactionSignature, senderPublicKey, receiverPublicKey, amount) {
    console.log(`Transaction verification endpoint called for: ${transactionSignature}`);
    
    try {
      // Verify the transaction
      const verificationResult = await this.axiomClient.verifyTransaction(
        transactionSignature,
        senderPublicKey,
        receiverPublicKey,
        amount
      );
      
      // Handle case where verification failed
      if (!verificationResult.verified) {
        return {
          success: false,
          transactionSignature,
          verified: false,
          error: verificationResult.error || 'Transaction verification failed',
          timestamp: new Date()
        };
      }
      
      return {
        success: true,
        transactionSignature,
        verified: verificationResult.verified,
        senderPublicKey,
        receiverPublicKey,
        amount,
        transactionTrustScore: verificationResult.transactionTrustScore,
        senderReputation: verificationResult.senderReputation,
        receiverReputation: verificationResult.receiverReputation,
        timestamp: new Date()
      };
    } catch (error) {
      console.error(`Transaction verification failed for ${transactionSignature}:`, error);
      return {
        success: false,
        transactionSignature,
        verified: false,
        error: error.message || 'Transaction verification failed',
        timestamp: new Date()
      };
    }
  }

  /**
   * Batch verify multiple agents
   * @param {Array} agentPublicKeys - Array of agent public keys to verify
   * @returns {Object} Batch verification results
   */
  async batchVerifyAgents(agentPublicKeys) {
    console.log(`Batch verification endpoint called for ${agentPublicKeys.length} agents`);
    
    const results = [];
    
    for (const publicKey of agentPublicKeys) {
      try {
        const result = await this.axiomClient.verifyAgentIdentity(publicKey);
        results.push({
          agentPublicKey: publicKey,
          verified: result.verified,
          trustScore: result.trustScore,
          reputationScore: result.reputationScore,
          error: null
        });
      } catch (error) {
        results.push({
          agentPublicKey: publicKey,
          verified: false,
          trustScore: 0,
          reputationScore: 0,
          error: error.message || 'Verification failed'
        });
      }
    }
    
    return {
      success: true,
      results,
      timestamp: new Date()
    };
  }
}

export default VerificationService;