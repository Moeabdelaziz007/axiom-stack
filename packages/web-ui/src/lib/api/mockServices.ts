// Mock services for the Axiom Command Center

import { MockAgent, MockStakingInfo, MockTransaction } from '../solana';
import { parseAgentFromAix, AixManifest, AixAgent } from '@/lib/aixLoader';

// Import AIX manifest data from JSON files
import agent1Data from '@/data/aix/agent1.json';
import agent2Data from '@/data/aix/agent2.json';
import agent3Data from '@/data/aix/agent3.json';
import agent4Data from '@/data/aix/agent4.json';

// AIX manifest data
const aixManifests: AixManifest[] = [
  agent1Data as AixManifest,
  agent2Data as AixManifest,
  agent3Data as AixManifest,
  agent4Data as AixManifest
];

// Convert AIX manifests to UI agents using the new parseAgentFromAix function
const uiAgents: AixAgent[] = aixManifests.map(parseAgentFromAix);

// Mock staking information
export const mockStakingInfo: MockStakingInfo = {
  stakedAmount: 1250.50,
  rewards: 62.75,
  apr: 5.0,
  lastClaimed: '2023-06-18T10:00:00Z'
};

// Mock transaction history
export const mockTransactions: MockTransaction[] = [
  {
    id: 'tx_1',
    type: 'stake',
    amount: 500.00,
    status: 'confirmed',
    timestamp: '2023-06-15T10:30:00Z',
    from: 'user_wallet_1',
    to: 'staking_contract'
  },
  {
    id: 'tx_2',
    type: 'payment',
    amount: 25.99,
    status: 'confirmed',
    timestamp: '2023-06-16T14:22:00Z',
    from: 'user_wallet_1',
    to: 'agent_creator_1'
  },
  {
    id: 'tx_3',
    type: 'reward',
    amount: 12.50,
    status: 'confirmed',
    timestamp: '2023-06-17T09:15:00Z',
    from: 'staking_contract',
    to: 'user_wallet_1'
  },
  {
    id: 'tx_4',
    type: 'payment',
    amount: 15.75,
    status: 'confirmed',
    timestamp: '2023-06-18T16:45:00Z',
    from: 'user_wallet_1',
    to: 'agent_creator_2'
  },
  {
    id: 'tx_5',
    type: 'unstake',
    amount: 100.00,
    status: 'confirmed',
    timestamp: '2023-06-19T12:30:00Z',
    from: 'staking_contract',
    to: 'user_wallet_1'
  }
];

// Service functions
export const getMockAgents = async (): Promise<MockAgent[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...uiAgents]);
    }, 300);
  });
};

export const getMockAgentById = async (id: string): Promise<MockAgent | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const agent = uiAgents.find(a => a.id === id);
      resolve(agent);
    }, 300);
  });
};

export const createMockAgent = async (agentData: Omit<MockAgent, 'id' | 'createdAt' | 'lastActive'>): Promise<MockAgent> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newAgent: AixAgent = {
        id: `agent_${Date.now()}`,
        ...agentData,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        reputation: 50, // Default reputation
        loadFactor: 0, // Default load factor
        costPerAction: 0.1, // Default cost per action
        status: 'active' // Default status
      };
      uiAgents.push(newAgent);
      resolve(newAgent);
    }, 500);
  });
};

export const updateMockAgent = async (id: string, updates: Partial<MockAgent>): Promise<MockAgent | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = uiAgents.findIndex(a => a.id === id);
      if (index !== -1) {
        uiAgents[index] = { ...uiAgents[index], ...updates };
        resolve(uiAgents[index]);
      } else {
        resolve(undefined);
      }
    }, 500);
  });
};

export const deleteMockAgent = async (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = uiAgents.findIndex(a => a.id === id);
      if (index !== -1) {
        uiAgents.splice(index, 1);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 300);
  });
};

export const getMockStakingInfo = async (): Promise<MockStakingInfo> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...mockStakingInfo });
    }, 300);
  });
};

export const getMockTransactions = async (): Promise<MockTransaction[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockTransactions]);
    }, 300);
  });
};