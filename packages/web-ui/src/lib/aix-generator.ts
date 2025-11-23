import { PublicKey } from '@solana/web3.js';
import { AGENT_TEMPLATES } from '@/../../core/src/templates';

/**
 * Generate full AIX DNA from simplified Dollar Studio config
 * Transforms a simple template selection into a complete agent genome
 */
export interface AixDNAInput {
    templateId: string;
    knowledgeFile?: {
        filename: string;
        chunksProcessed: number;
        uploadTimestamp: number;
    };
    owner: string; // Solana PublicKey as string
    adkVersion: string;
    businessId: string;
}

export interface AixDNA {
    // Core Identity
    id: string;
    owner: string;
    templateId: string;

    // AIX Genome
    genome: string;
    traits: {
        riskTolerance: number;
        tone: string;
        postingFrequency: string;
    };
    reasoningProtocol: string;
    collaborationLayer: string[];

    // Skills & Tools
    skills: {
        type: 'built-in' | 'knowledge' | 'custom';
        name: string;
        source?: string;
    }[];
    tools: string[];

    // Knowledge Base (RAG)
    knowledgeBase?: {
        businessId: string;
        filename: string;
        chunksProcessed: number;
        embeddingModel: string;
        indexName: string;
    };

    // Metadata
    createdAt: number;
    adkVersion: string;
    version: string;
}

export async function generateAixDNA(input: AixDNAInput): Promise<AixDNA> {
    const template = AGENT_TEMPLATES[input.templateId as keyof typeof AGENT_TEMPLATES];

    if (!template) {
        throw new Error(`Template ${input.templateId} not found`);
    }

    // Generate unique agent ID
    const agentId = `axiom-${input.templateId.toLowerCase()}-${Date.now()}`;

    // Build skills array
    const skills: AixDNA['skills'] = [
        // Built-in skills from template
        ...template.allowedTools.map(tool => ({
            type: 'built-in' as const,
            name: tool
        })),
        // Knowledge skill from uploaded PDF
        ...(input.knowledgeFile ? [{
            type: 'knowledge' as const,
            name: 'rag_query_custom',
            source: input.knowledgeFile.filename
        }] : [])
    ];

    // Construct full AIX DNA
    const dna: AixDNA = {
        id: agentId,
        owner: input.owner,
        templateId: input.templateId,

        genome: template.genome,
        traits: template.traits,
        reasoningProtocol: template.reasoningProtocol,
        collaborationLayer: template.collaborationLayer,

        skills,
        tools: template.allowedTools,

        ...(input.knowledgeFile && {
            knowledgeBase: {
                businessId: input.businessId,
                filename: input.knowledgeFile.filename,
                chunksProcessed: input.knowledgeFile.chunksProcessed,
                embeddingModel: '@cf/baai/bge-m3',
                indexName: 'axiom-rag-index'
            }
        }),

        createdAt: Date.now(),
        adkVersion: input.adkVersion,
        version: '1.0.0'
    };

    return dna;
}

/**
 * Validate AIX DNA structure
 */
export function validateAixDNA(dna: AixDNA): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!dna.id) errors.push('Missing agent ID');
    if (!dna.owner) errors.push('Missing owner address');
    if (!dna.genome) errors.push('Missing genome');
    if (!dna.skills || dna.skills.length === 0) errors.push('No skills defined');
    if (!dna.tools || dna.tools.length === 0) errors.push('No tools defined');

    return {
        valid: errors.length === 0,
        errors
    };
}
