/**
 * Agent Manifest Interface
 * Represents the core identity and metadata of an agent
 */
export interface AgentManifest {
    id: string;
    type: string;
    publicKey: string;
    createdAt: number;
    lastActive?: number;
    status: 'active' | 'paused' | 'archived';
}
/**
 * Genesis Rules Interface
 * Configuration rules that govern agent behavior at creation time
 */
export interface GenesisRules {
    stopLoss?: number;
    maxSlippage?: number;
    maxPositionSize?: number;
    maxDailyTrades?: number;
    tokenAllowlist?: string[];
    tokenDenylist?: string[];
    exchangeAllowlist?: string[];
    maxLeverage?: number;
    minConfidenceScore?: number;
    requireConfirmation?: boolean;
    whitelistAddresses?: string[];
}
/**
 * Decision Log Interface
 * Records the reasoning and context behind agent decisions
 */
export interface DecisionLog {
    traceId: string;
    agentId: string;
    timestamp: number;
    reasoning: string;
    context: any;
    action: string;
    confidenceScore?: number;
    riskAssessment?: string;
    snapshot?: any;
    outcome?: any;
    metadata?: Record<string, any>;
}
/**
 * Agent Channels Interface
 * Configuration for communication channels connected to an agent
 */
export interface AgentChannels {
    telegram?: {
        botToken: string;
        active: boolean;
        webhookUrl?: string;
    };
    discord?: {
        webhookUrl: string;
        active: boolean;
    };
    whatsapp?: {
        phoneId: string;
        accessToken: string;
        active: boolean;
        webhookUrl?: string;
    };
}
/**
 * Agent Configuration Interface
 * Complete configuration for an agent
 */
export interface AgentConfig {
    manifest: AgentManifest;
    strategy: any;
    channels?: AgentChannels;
}
/**
 * Spawn Request Interface
 * Request payload for creating a new agent
 */
export interface SpawnRequest {
    type: string;
    config: AgentConfig;
}
