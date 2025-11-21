// cloudflare-workers/axiom-brain/src/services/vector.ts - Vector Memory Service
// Uses Cloudflare Vectorize + Workers AI for native memory storage

export interface VectorMemory {
    text: string;
    metadata: {
        timestamp: number;
        type: 'decision' | 'trade' | 'conversation' | 'insight';
        agentId?: string;
        userId?: string;
        [key: string]: any;
    };
}

export interface VectorMatch {
    id: string;
    score: number;
    metadata: any;
}

export class VectorMemoryService {
    private vectorizeIndex: any;
    private ai: any;

    constructor(vectorizeIndex: any, ai: any) {
        this.vectorizeIndex = vectorizeIndex;
        this.ai = ai;
    }

    /**
     * Store a memory with its embedding
     * Uses Cloudflare Workers AI for embedding generation (Nano Banana optimization)
     */
    async storeMemory(text: string, metadata: VectorMemory['metadata']): Promise<void> {
        try {
            // Generate embedding using Cloudflare Workers AI
            const embeddingResponse: any = await this.ai.run('@cf/baai/bge-base-en-v1.5', {
                text: text,
            });

            const embedding = embeddingResponse.data[0];

            if (!embedding || !Array.isArray(embedding)) {
                throw new Error('Failed to generate embedding');
            }

            // Create unique ID for this memory
            const memoryId = `mem_${Date.now()}_${Math.random().toString(36).substring(7)}`;

            // Insert into Vectorize
            await this.vectorizeIndex.insert([
                {
                    id: memoryId,
                    values: embedding,
                    metadata: {
                        text: text,
                        ...metadata,
                    },
                },
            ]);

            console.log(`Stored memory: ${memoryId}`);
        } catch (error: any) {
            console.error('Error storing memory:', error);
            throw new Error(`Failed to store memory: ${error.message}`);
        }
    }

    /**
     * Recall memories similar to a query
     * Returns top matching memories with their scores
     */
    async recallMemory(query: string, topK: number = 3): Promise<VectorMatch[]> {
        try {
            // Generate query embedding
            const embeddingResponse: any = await this.ai.run('@cf/baai/bge-base-en-v1.5', {
                text: query,
            });

            const queryEmbedding = embeddingResponse.data[0];

            if (!queryEmbedding || !Array.isArray(queryEmbedding)) {
                throw new Error('Failed to generate query embedding');
            }

            // Query Vectorize for similar memories
            const results = await this.vectorizeIndex.query(queryEmbedding, {
                topK: topK,
                returnMetadata: true,
            });

            // Format results
            const matches: VectorMatch[] = results.matches.map((match: any) => ({
                id: match.id,
                score: match.score,
                metadata: match.metadata,
            }));

            console.log(`Recalled ${matches.length} memories for query: "${query}"`);
            return matches;
        } catch (error: any) {
            console.error('Error recalling memory:', error);
            throw new Error(`Failed to recall memory: ${error.message}`);
        }
    }

    /**
     * Store a decision log (for Chain of Thought reasoning)
     */
    async storeDecisionLog(reasoning: string, decision: string, metadata: any): Promise<void> {
        const logText = `Reasoning: ${reasoning}\nDecision: ${decision}`;
        await this.storeMemory(logText, {
            ...metadata,
            type: 'decision',
            timestamp: Date.now(),
        });
    }
}
