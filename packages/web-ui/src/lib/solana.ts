// Hybrid Solana integration allowing toggle between mock and real modes

export type SolanaMode = 'mock' | 'real';

// Mock data types
export interface MockAgent {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'paused';
  createdAt: string;
  lastActive: string;
  capabilities: string[];
}

export interface MockStakingInfo {
  stakedAmount: number;
  rewards: number;
  apr: number;
  lastClaimed: string;
}

export interface MockTransaction {
  id: string;
  type: 'stake' | 'unstake' | 'payment' | 'reward';
  amount: number;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: string;
  from: string;
  to: string;
}

// Mock service implementations
const mockCreateAgent = async (agentData: Omit<MockAgent, 'id' | 'createdAt' | 'lastActive'>) => {
  return new Promise<MockAgent>((resolve) => {
    setTimeout(() => {
      const newAgent: MockAgent = {
        id: `agent_${Math.random().toString(36).substr(2, 9)}`,
        ...agentData,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      };
      resolve(newAgent);
    }, 500);
  });
};

const mockStakeTokens = async (amount: number) => {
  return new Promise<MockStakingInfo>((resolve) => {
    setTimeout(() => {
      const stakeInfo: MockStakingInfo = {
        stakedAmount: amount,
        rewards: amount * 0.05, // 5% APR
        apr: 5.0,
        lastClaimed: new Date().toISOString(),
      };
      resolve(stakeInfo);
    }, 500);
  });
};

const mockSendPayment = async (to: string, amount: number) => {
  return new Promise<MockTransaction>((resolve, reject) => {
    setTimeout(() => {
      // Simulate occasional failures
      if (Math.random() < 0.1) {
        reject(new Error('Transaction failed due to network error'));
      } else {
        const transaction: MockTransaction = {
          id: `tx_${Math.random().toString(36).substr(2, 9)}`,
          type: 'payment',
          amount,
          status: 'confirmed',
          timestamp: new Date().toISOString(),
          from: 'mock_wallet_address',
          to,
        };
        resolve(transaction);
      }
    }, 500);
  });
};

const mockUnstakeTokens = async (amount: number) => {
  return new Promise<MockStakingInfo>((resolve) => {
    setTimeout(() => {
      const stakeInfo: MockStakingInfo = {
        stakedAmount: Math.max(0, 1000 - amount), // Assuming 1000 staked
        rewards: 50, // Fixed rewards
        apr: 5.0,
        lastClaimed: new Date().toISOString(),
      };
      resolve(stakeInfo);
    }, 500);
  });
};

const mockClaimRewards = async () => {
  return new Promise<MockStakingInfo>((resolve) => {
    setTimeout(() => {
      const stakeInfo: MockStakingInfo = {
        stakedAmount: 1000, // Assuming 1000 staked
        rewards: 0, // Reset rewards after claiming
        apr: 5.0,
        lastClaimed: new Date().toISOString(),
      };
      resolve(stakeInfo);
    }, 500);
  });
};

// Real service implementations (placeholders)
const realCreateAgent = async (agentData: Omit<MockAgent, 'id' | 'createdAt' | 'lastActive'>) => {
  // In a real implementation, this would interact with Solana programs
  throw new Error('Real mode not implemented yet');
};

const realStakeTokens = async (amount: number) => {
  // In a real implementation, this would interact with Solana staking programs
  throw new Error('Real mode not implemented yet');
};

const realSendPayment = async (to: string, amount: number) => {
  // In a real implementation, this would send actual Solana transactions
  throw new Error('Real mode not implemented yet');
};

const realUnstakeTokens = async (amount: number) => {
  // In a real implementation, this would interact with Solana staking programs
  throw new Error('Real mode not implemented yet');
};

const realClaimRewards = async () => {
  // In a real implementation, this would claim actual rewards
  throw new Error('Real mode not implemented yet');
};

// Main hook for Solana connection
export const useSolanaConnection = (mode: SolanaMode) => {
  if (mode === 'mock') {
    return {
      createAgent: mockCreateAgent,
      stakeTokens: mockStakeTokens,
      sendPayment: mockSendPayment,
      unstakeTokens: mockUnstakeTokens,
      claimRewards: mockClaimRewards,
      mode: 'mock' as const,
    };
  }
  
  return {
    createAgent: realCreateAgent,
    stakeTokens: realStakeTokens,
    sendPayment: realSendPayment,
    unstakeTokens: realUnstakeTokens,
    claimRewards: realClaimRewards,
    mode: 'real' as const,
  };
};