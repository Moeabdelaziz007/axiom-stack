// packages/core/src/brain.ts - The Core Brain (Logic Layer)
import axios from 'axios';

export interface BrainResponse {
  text: string;
  media?: string;
  actions?: string[];
}

export class AxiomBrain {
  private cloudflareWorkerUrl: string;

  constructor() {
    // Use AXIOM_BRAIN_URL if available, otherwise fallback to CLOUDFLARE_WORKER_URL, then default
  private workerUrl: string;

  constructor(workerUrl: string = 'https://axiom-brain.amrikyy.workers.dev') {
    this.workerUrl = workerUrl;
  }

  /**
   * Process a message through the Axiom Brain
   * Supports text, image, and audio inputs
   */
  async process(request: BrainRequest | string, userId?: string): Promise<BrainResponse> {
    try {
      // Backward compatibility for (message, userId) signature
      let payload: any = {};

      if (typeof request === 'string') {
        if (!userId) throw new Error('userId is required when passing message as string');
        payload = {
          chatId: userId,
          message: request
        };
      } else {
        payload = {
          chatId: request.userId,
          message: request.message,
          image: request.image,
          audio: request.audio
        };
      }

      const response = await fetch(`${this.workerUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Brain API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        text: data.response || 'No response from brain',
        data: data.data
      };
    } catch (error) {
    }

  /**
   * Call Cloudflare Workers AI for inference
   */
  private async callWorkersAI(message: string, context?: string | null): Promise<string> {
    // This functionality is now handled by the Cloudflare worker's chat endpoint
    return "AI response would be here";
  }

  /**
   * Call cached AI endpoint to reduce costs
   */
  private async callCachedAI(message: string): Promise<string | null> {
    // This functionality is now handled by the Cloudflare worker's chat endpoint
    return null;
  }

  /**
   * Execute Blockchain checks (Solana) if needed
   */
  private async checkBlockchain(message: string): Promise<any> {
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
  private formatResponse(
    aiResponse: string,
    memoryContext: string | null,
    blockchainData: any
  ): BrainResponse {
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