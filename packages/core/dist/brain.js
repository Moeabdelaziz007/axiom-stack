"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxiomBrain = void 0;
// packages/core/src/brain.ts - The Core Brain (Logic Layer)
const axios_1 = __importDefault(require("axios"));
class AxiomBrain {
    constructor() {
        this.cloudflareWorkerUrl = process.env.CLOUDFLARE_WORKER_URL || 'https://axiom-brain.your-subdomain.workers.dev';
        this.vectorizeEndpoint = `${this.cloudflareWorkerUrl}/api/v1`;
    }
    /**
     * Process a user message and return a standardized response
     * @param message - The user's text input
     * @param userId - The user's ID
     * @returns Standardized response object
     */
    async process(message, userId) {
        try {
            console.log(`🧠 AxiomBrain processing message from user ${userId}: ${message}`);
            // Step 1: Check Vectorize memory (RAG)
            const memoryContext = await this.checkMemory(message);
            // Step 2: Call Cloudflare Workers AI
            const aiResponse = await this.callWorkersAI(message, memoryContext);
            // Step 3: Execute Blockchain checks (Solana) if needed
            const blockchainData = await this.checkBlockchain(message);
            // Step 4: Combine responses and format output
            const finalResponse = this.formatResponse(aiResponse, memoryContext, blockchainData);
            console.log(`✅ AxiomBrain response generated for user ${userId}`);
            return finalResponse;
        }
        catch (error) {
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
        try {
            const response = await axios_1.default.post(`${this.vectorizeEndpoint}/knowledge-search`, {
                query
            }, {
                timeout: 5000
            });
            if (response.data && response.data.results && response.data.results.length > 0) {
                return response.data.results[0].text;
            }
            return null;
        }
        catch (error) {
            console.warn('⚠️  Memory check failed:', error);
            return null;
        }
    }
    /**
     * Call Cloudflare Workers AI for inference
     */
    async callWorkersAI(message, context) {
        try {
            // First try cached AI to reduce costs
            const cachedResponse = await this.callCachedAI(message);
            if (cachedResponse) {
                return cachedResponse;
            }
            // If no cache hit, use the main AI endpoint
            const payload = {
                prompt: context ? `${context}\n\nUser: ${message}` : message,
                model: '@cf/meta/llama-3-8b-instruct'
            };
            const response = await axios_1.default.post(`${this.vectorizeEndpoint}/ai`, payload, {
                timeout: 10000
            });
            return response.data.response || "I'm not sure how to respond to that.";
        }
        catch (error) {
            console.error('❌ Workers AI call failed:', error);
            return "I'm having trouble processing your request right now. Please try again later.";
        }
    }
    /**
     * Call cached AI endpoint to reduce costs
     */
    async callCachedAI(message) {
        try {
            const response = await axios_1.default.post(`${this.vectorizeEndpoint}/cached-ai`, {
                prompt: message
            }, {
                timeout: 5000
            });
            if (response.data && response.data.cached) {
                console.log('✅ Using cached AI response');
                return response.data.response;
            }
            return null;
        }
        catch (error) {
            console.warn('⚠️  Cached AI check failed:', error);
            return null;
        }
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
