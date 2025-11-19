// packages/core/dist/brain.js - The Core Brain (Logic Layer)
const axios = require('axios');

class AxiomBrain {
  constructor() {
    // Use AXIOM_BRAIN_URL if available, otherwise fallback to CLOUDFLARE_WORKER_URL, then default
    this.cloudflareWorkerUrl = process.env.AXIOM_BRAIN_URL || 
                              process.env.CLOUDFLARE_WORKER_URL || 
                              'https://axiom-brain.your-subdomain.workers.dev';
  }

  /**
   * Process a user message and return a standardized response
   * @param {string} message - The user's text input
   * @param {string} userId - The user's ID
   * @returns {Promise<object>} Standardized response object
   */
  async process(message, userId) {
    try {
      console.log(`🧠 AxiomBrain processing message from user ${userId}: ${message}`);

      // For now, we'll use the chat endpoint directly since that's what's available
      const response = await axios.post(`${this.cloudflareWorkerUrl}/chat`, {
        chatId: userId,
        message: message
      }, {
        timeout: 15000
      });

      return {
        text: response.data.response || "I'm not sure how to respond to that.",
        actions: ['processed']
      };
    } catch (error) {
      console.error('❌ Error in AxiomBrain.process:', error);
      return {
        text: "Sorry, I encountered an error while processing your request. Please try again later.",
        actions: ['error']
      };
    }
  }

  /**
   * Check Vectorize memory (RAG) for relevant context
   */
  async checkMemory(query) {
    // This functionality is now handled by the Cloudflare worker's chat endpoint
    return null;
  }

  /**
   * Call Cloudflare Workers AI for inference
   */
  async callWorkersAI(message, context) {
    // This functionality is now handled by the Cloudflare worker's chat endpoint
    return "AI response would be here";
  }

  /**
   * Call cached AI endpoint to reduce costs
   */
  async callCachedAI(message) {
    // This functionality is now handled by the Cloudflare worker's chat endpoint
    return null;
  }

  /**
   * Execute Blockchain checks (Solana) if needed
   */
  async checkBlockchain(message) {
    // Only check blockchain for specific keywords
    const blockchainKeywords = ['solana', 'wallet', 'transaction', 'balance', 'nft', 'token'];
    const lowerMessage = message.toLowerCase();
    
    if (blockchainKeywords.some(keyword => lowerMessage.includes(keyword))) {
      try {
        // This would connect to your Solana integration
        // For now, we'll return a placeholder
        console.log('🔍 Blockchain check triggered for:', message);
        return {
          type: 'blockchain_info',
          relevant: true,
          // In a real implementation, you would call your Solana integration here
          data: 'Blockchain data would be here'
        };
      } catch (error) {
        console.warn('⚠️  Blockchain check failed:', error);
        return { type: 'blockchain_info', relevant: true, error: 'Failed to fetch blockchain data' };
      }
    }
    
    return { type: 'blockchain_info', relevant: false };
  }

  /**
   * Format the final response
   */
  formatResponse(aiResponse, memoryContext, blockchainData) {
    let text = aiResponse;
    
    // Add blockchain information if relevant
    if (blockchainData.relevant && blockchainData.data) {
      text += `\n\n[Blockchain Info]: ${blockchainData.data}`;
    }
    
    return {
      text,
      actions: memoryContext ? ['used_memory'] : []
    };
  }
}

module.exports = { AxiomBrain };