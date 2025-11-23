// packages/core/src/schema/AixSchema.ts

/** Definition of a single function that an agent can call */
export interface AixToolFunction {
    /** Unique function name, e.g., 'binance_execute_limit_order' */
    name: string;
    /** Human‑readable description of the function */
    description: string;
    /** JSON‑Schema style parameters definition */
    parameters: {
        type: 'object';
        properties: { [key: string]: { type: string; description: string; required?: boolean } };
        required: string[];
    };
}

/** A toolbox entry groups related functions under a tool name */
export interface AixToolboxEntry {
    /** Display name of the tool, e.g., 'Binance API' */
    toolName: string;
    /** Category for UI grouping */
    category: 'Finance' | 'Content' | 'Data' | 'Social' | 'Other';
    /** Functions provided by this tool */
    functions: AixToolFunction[];
}

/** Updated AIX DNA schema including the toolbox */
export interface AixDNASchema {
    // ... other DNA sections (omitted for brevity)
    toolbox: AixToolboxEntry[];

    /** Quantum signature: The agent's unique "soul" from vacuum fluctuations */
    genesis_signature?: {
        /** 256-bit hexadecimal seed from quantum vacuum or crypto fallback */
        quantum_seed: string;
        /** Source of entropy: ANU Quantum Vacuum or System Crypto */
        entropy_source: 'ANU Quantum Vacuum' | 'System Crypto Entropy (The Ether is Quiet)';
        /** Timestamp when the seed was generated */
        timestamp: number;
        /** Entropy quality score (0-100, typically 98 for quantum, 70 for fallback) */
        entropy_score: number;
    };
}
