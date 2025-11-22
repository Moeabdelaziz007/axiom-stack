"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxiomBrain = void 0;
class AxiomBrain {
    constructor() {
        // Use AXIOM_BRAIN_URL if available, otherwise fallback to CLOUDFLARE_WORKER_URL, then default
    }
    constructor(workerUrl = 'https://axiom-brain.amrikyy.workers.dev') {
        this.workerUrl = workerUrl;
    }
    /**
     * Process a message through the Axiom Brain
     * Supports text, image, and audio inputs
     */
    async process(request, userId) {
        try {
            // Backward compatibility for (message, userId) signature
            let payload = {};
            if (typeof request === 'string') {
                if (!userId)
                    throw new Error('userId is required when passing message as string');
                payload = {
                    chatId: userId,
                    message: request
                };
            }
            else {
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
        }
        catch (error) {
        }
        /**
         * Call Cloudflare Workers AI for inference
         */
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
            }
            catch (error) {
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
exports.AxiomBrain = AxiomBrain;
