export interface BrainResponse {
    text: string;
    media?: string;
    actions?: string[];
}
export declare class AxiomBrain {
    private cloudflareWorkerUrl;
    private workerUrl;
    /**
     * Process a message through the Axiom Brain
     * Supports text, image, and audio inputs
     */
    process(request: BrainRequest | string, userId?: string): Promise<BrainResponse>;
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
