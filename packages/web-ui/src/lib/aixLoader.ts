// AIX Standard Loader for Axiom ID
// Maps AIX manifest structure to UI Agent interface

import { MockAgent } from './solana';

export interface AixManifest {
  meta: {
    id: string;
    name: string;
    description: string;
    version: string;
    created_at: string;
  };
  persona: {
    role: string;
    personality: string;
    communication_style: string;
  };
  identity_layer: {
    solana_wallet: string;
    reputation: number;
    verified: boolean;
  };
  economics: {
    token: string;
    cost_per_action: number;
    balance: number;
  };
  superpowers: Array<{
    name: string;
    description: string;
    version: string;
  }>;
}

// Extended agent interface for UI with AIX properties
export interface AixAgent extends MockAgent {
  reputation: number;
  loadFactor: number;
  costPerAction: number; // Added to store cost_per_action from economics
}

/**
 * Parses AIX manifest data to UI Agent interface with precise field mapping
 * @param aixData - AIX manifest object
 * @returns AixAgent object
 */
export const parseAgentFromAix = (aixData: AixManifest): AixAgent => {
  // Combine persona.role and all superpowers[].name values into a single capabilities array
  const capabilities = [
    aixData.persona.role,
    ...aixData.superpowers.map(sp => sp.name)
  ];

  // Calculate load factor based on capabilities and reputation (for internal use)
  const capabilityCount = capabilities.length;
  const reputationScore = aixData.identity_layer.reputation;
  const loadFactor = Math.min(100, Math.round((capabilityCount * 10) + (reputationScore / 2)));

  return {
    id: aixData.meta.id,
    name: aixData.meta.name,
    description: aixData.meta.description,
    status: 'active', // Default to active for AIX agents
    createdAt: aixData.meta.created_at,
    lastActive: new Date().toISOString(), // Current time as last active
    capabilities: capabilities,
    // Extended properties for UI use
    reputation: aixData.identity_layer.reputation,
    loadFactor: loadFactor,
    costPerAction: aixData.economics.cost_per_action // Extract economics.cost_per_action value
  };
};

/**
 * Loads multiple agents from AIX manifests using the new parseAgentFromAix function
 * @param aixManifests - Array of AIX manifest objects
 * @returns Array of agent objects
 */
export const loadAgentsFromAix = (aixManifests: AixManifest[]): AixAgent[] => {
  return aixManifests.map(parseAgentFromAix);
};