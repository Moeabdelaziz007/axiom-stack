export interface BrainResponse {
    text: string;
    media?: string;
    actions?: string[];
}
export declare class AxiomBrain {
    private cloudflareWorkerUrl;
    private vectorizeEndpoint;
    constructor();
    /**
     * Process a user message and return a standardized response
     * @param message - The user's text input
     * @param userId - The user's ID
     * @returns Standardized response object
     */
    process(message: string, userId: string): Promise<BrainResponse>;
    /**
     * Check Vectorize memory (RAG) for relevant context
     */
    private checkMemory;
    /**
     * Call Cloudflare Workers AI for inference
     */
    private callWorkersAI;
    /**
     * Call cached AI endpoint to reduce costs
     */
    private callCachedAI;
    /**
     * Execute Blockchain checks (Solana) if needed
     */
    private checkBlockchain;
    /**
     * Format the final response
     */
    private formatResponse;
}
