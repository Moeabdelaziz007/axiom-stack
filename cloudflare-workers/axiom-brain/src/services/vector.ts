import { Ai } from '@cloudflare/ai';

export class VectorMemory {
    private ai: Ai;
    private index: VectorizeIndex;

    constructor(ai: Ai, index: VectorizeIndex) {
        this.ai = ai;
        this.index = index;
    }

    async storeMemory(text: string, metadata: Record<string, any> = {}): Promise<void> {
        try {
            // Generate embedding using BGE-Base (Nano Banana Model)
            const { data } = await this.ai.run('@cf/baai/bge-base-en-v1.5', {
                text: [text]
            });

            const values = data[0];

            if (!values) {
                throw new Error('Failed to generate embedding');
            }

            // Insert into Vectorize Index
            await this.index.insert([
                {
                    id: crypto.randomUUID(),
                    values,
                    metadata: {
                        ...metadata,
                        text,
                        timestamp: Date.now()
                    }
                }
            ]);

            console.log(`Stored memory: "${text.substring(0, 50)}..."`);
        } catch (error) {
            console.error('Error storing memory:', error);
            throw error;
        }
    }

    async recallMemory(query: string, topK: number = 3): Promise<any[]> {
        try {
            // Generate query embedding
            const { data } = await this.ai.run('@cf/baai/bge-base-en-v1.5', {
                text: [query]
            });

            const values = data[0];

            if (!values) {
                throw new Error('Failed to generate query embedding');
            }

            // Query Vectorize
            const results = await this.index.query(values, {
                topK,
                returnMetadata: true
            });

            return results.matches.map(match => ({
                score: match.score,
                text: match.metadata?.text,
                metadata: match.metadata
            }));
        } catch (error) {
            console.error('Error recalling memory:', error);
            return [];
        }
    }
}
