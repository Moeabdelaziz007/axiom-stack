// packages/workers/agent-factory/src/types.ts
// Shared types for agent orchestration

export interface Mission {
    /** Unique mission identifier */
    id: string;
    /** High-level objective the user wants to accomplish */
    objective: string;
    /** Optional context or parameters for the mission */
    context?: Record<string, any>;
    /** Priority level (1-10) */
    priority?: number;
    /** Deadline timestamp (optional) */
    deadline?: number;
}

export interface ExecutionStep {
    /** Step ID in the execution plan */
    id: number;
    /** Skill ID from SkillsRegistry */
    skillId: string;
    /** Parameters to pass to the skill */
    parameters: Record<string, any>;
    /** Dependencies (other step IDs that must complete first) */
    dependencies?: number[];
    /** Conditional execution (optional) */
    condition?: {
        type: 'IF' | 'UNLESS';
        expression: string;
    };
}

export interface SkillExecutionResult {
    /** Whether the skill executed successfully */
    success: boolean;
    /** Output data from the skill */
    data?: any;
    /** Error message if failed */
    error?: string;
    /** Compliance check result */
    complianceFailed?: boolean;
    /** Execution metadata */
    metadata?: {
        executionTime: number;
        toolsCalled: string[];
        tokensUsed?: number;
    };
}

export interface MissionResult {
    /** Overall mission status */
    status: 'SUCCESS' | 'FAILED' | 'PARTIAL';
    /** Final synthesized output */
    finalOutput: any;
    /** Reason for failure (if applicable) */
    reason?: string;
    /** All step results */
    stepResults?: SkillExecutionResult[];
    /** Total execution time */
    totalExecutionTime?: number;
}
