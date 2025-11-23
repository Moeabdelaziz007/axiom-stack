// packages/web-ui/src/lib/schema/AixSchema.ts

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

/** A Skill is a composite workflow that uses multiple tools to accomplish a complex task */
export interface AixSkill {
    /** Unique identifier, e.g., 'flash_arbitrage', 'seo_content_optimizer' */
    skill_id: string;
    /** Display name for UI */
    skill_name: string;
    /** Category for UI grouping */
    category: 'Trading' | 'Content' | 'Research' | 'Social' | 'Meta' | 'Other';
    /** What the skill accomplishes */
    description: string;
    /** Step-by-step execution logic (Chain-of-Thought) */
    reasoning_protocol: string;
    /** Tool function names required by this skill */
    required_tools: string[];
    /** Optional configurable parameters */
    parameters?: { [key: string]: any };
    /** Example prompt to trigger this skill */
    example_usage?: string;
}

/** Updated AIX DNA schema including both tools and skills */
export interface AixDNASchema {
    /** High-level skills this agent can perform (composite workflows) */
    skills_manifest: AixSkill[];
    /** Low-level tools available to the agent (backward compatibility) */
    toolbox?: AixToolboxEntry[];
}
