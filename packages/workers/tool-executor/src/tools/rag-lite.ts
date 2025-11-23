import { Ai } from '@cloudflare/ai';
import { VectorizeIndex } from '@cloudflare/workers-types';

export interface RagLiteEnv {
    AI: any;
    VECTORIZE: VectorizeIndex;
}

export class RagLiteTool {
    private ai: Ai;
    private vectorize: VectorizeIndex;

    constructor(env: RagLiteEnv) {
        this.ai = new Ai(env.AI);
        this.vectorize = env.VECTORIZE;
    }

    /**
     * Ingest text chunks into Vectorize
     * @param chunks Array of text chunks
     * @param metadata Common metadata for all chunks (e.g., businessId)
     */
    async ingest(chunks: string[], metadata: Record<string, any>): Promise<any> {
        console.log(`Processing ${chunks.length} chunks for ingestion...`);

        // Generate embeddings in batches (Cloudflare AI limit is usually 100 max)
        // Using bge-m3 for Arabic support (1024 dimensions)
        const embeddingsResponse = await this.ai.run('@cf/baai/bge-m3', {
            text: chunks
        });

        const vectors = embeddingsResponse.data.map((vector: number[], index: number) => ({
            id: `${metadata.businessId}-${Date.now()}-${index}`,
            values: vector,
            metadata: {
                ...metadata,
                text: chunks[index]
            }
        }));

        // Upsert to Vectorize
        // Note: Vectorize has a limit on batch size (1000 vectors), but we are likely under that for a single PDF.
        const inserted = await this.vectorize.upsert(vectors);

        return {
            status: 'success',
            chunksProcessed: chunks.length,
            vectorizeResult: inserted
        };
    }

    /**
     * Query the vector index
     * @param query User question
     * @param businessId Filter by business ID
     */
    async query(query: string, businessId: string): Promise<any> {
        // 1. Generate embedding for the query
        const queryEmbedding = await this.ai.run('@cf/baai/bge-m3', {
            text: [query]
        });

        // 2. Search Vectorize
        const matches = await this.vectorize.query(queryEmbedding.data[0], {
            topK: 5,
            returnMetadata: true,
            filter: { businessId: businessId } // Ensure we only search this business's data
        });

        return {
            matches: matches.matches.map(match => ({
                score: match.score,
                text: match.metadata?.text
            }))
        };
    }
}
