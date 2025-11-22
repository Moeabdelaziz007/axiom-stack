// packages/core/src/types/aix.ts - AIX Schema Definitions

/**
 * Agent Manifest Interface
 * Represents the core identity and metadata of an agent
 */
export interface AgentManifest {
  id: string;              // Unique identifier for the agent
  type: string;            // Agent type (e.g., 'trader', 'analyst', 'executor')
  publicKey: string;       // Public key of the agent (stored in registry)
  createdAt: number;       // Timestamp of agent creation
  lastActive?: number;     // Timestamp of last activity
  status: 'active' | 'paused' | 'archived'; // Current status
}

/**
 * Genesis Rules Interface
 * Configuration rules that govern agent behavior at creation time
 */
export interface GenesisRules {
  // Risk Management
  stopLoss?: number;              // Maximum percentage loss before liquidation (e.g., 0.1 = 10%)
  maxSlippage?: number;           // Maximum acceptable slippage for trades (e.g., 0.005 = 0.5%)
  maxPositionSize?: number;       // Maximum position size in USD
  maxDailyTrades?: number;        // Maximum number of trades per day

  // Asset Restrictions
  tokenAllowlist?: string[];      // List of allowed token symbols (e.g., ['SOL', 'USDC'])
  tokenDenylist?: string[];       // List of forbidden token symbols
  exchangeAllowlist?: string[];   // List of allowed exchanges/protocols

  // Behavioral Constraints
  maxLeverage?: number;           // Maximum leverage allowed (e.g., 1.0 = no leverage)
  minConfidenceScore?: number;    // Minimum confidence score for trade execution (0.0 - 1.0)

  // Security Settings
  requireConfirmation?: boolean;  // Whether manual confirmation is required for trades
  whitelistAddresses?: string[];  // Whitelisted wallet addresses for interactions
}

/**
 * Decision Log Interface
 * Records the reasoning and context behind agent decisions
 */
export interface DecisionLog {
  traceId: string;                // Unique identifier for this decision trace
  agentId: string;                // ID of the agent that made the decision
  timestamp: number;              // When the decision was made
  reasoning: string;              // Natural language explanation of the decision
  context: any;                   // Context data that influenced the decision
  action: string;                 // The action taken or proposed
  confidenceScore?: number;       // Confidence level in the decision (0.0 - 1.0)
  riskAssessment?: string;        // Risk assessment of the decision
  snapshot?: any;                 // Snapshot of relevant data at decision time
  outcome?: any;                  // Actual outcome of the decision (filled later)
  metadata?: Record<string, any>; // Additional metadata
}

/**
 * Agent Channels Interface
 * Configuration for communication channels connected to an agent
 */
export interface AgentChannels {
  telegram?: {
    botToken: string;           // Telegram Bot API token
    active: boolean;            // Whether this channel is active
    webhookUrl?: string;        // Registered webhook URL (set after registration)
  };
  discord?: {
    webhookUrl: string;         // Discord webhook URL for notifications
    active: boolean;            // Whether this channel is active
  };
  whatsapp?: {
    phoneId: string;            // WhatsApp Business Phone Number ID
    accessToken: string;        // WhatsApp Business API access token
    active: boolean;            // Whether this channel is active
    webhookUrl?: string;        // Registered webhook URL (set after registration)
  };
}

/**
 * Agent Configuration Interface
 * Complete configuration for an agent
 */
export interface AgentConfig {
  manifest: AgentManifest;
  strategy: any;
  channels?: AgentChannels;     // NEW: Communication channels configuration
}

/**
 * Spawn Request Interface
 * Request payload for creating a new agent
 */
export interface SpawnRequest {
  type: string;                   // Agent type (e.g., 'trader', 'analyst')
  config: AgentConfig;            // Agent configuration
}