// Staking hook for the Axiom Command Center

import { useState, useEffect, useCallback } from 'react';
import { MockStakingInfo } from '@/lib/solana';
import { getMockStakingInfo } from '@/lib/api/mockServices';
import { useToast } from '@/components/common/Toast';

export const useStaking = () => {
  const [stakingInfo, setStakingInfo] = useState<MockStakingInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const fetchStakingInfo = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMockStakingInfo();
      setStakingInfo(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch staking information');
      addToast('Failed to fetch staking information', 'error');
      console.error('Error fetching staking info:', err);
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const stakeTokens = async (amount: number) => {
    try {
      // In a real implementation, this would call the staking contract
      // For now, we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (stakingInfo) {
        const updatedInfo: MockStakingInfo = {
          ...stakingInfo,
          stakedAmount: stakingInfo.stakedAmount + amount,
          rewards: stakingInfo.rewards + (amount * 0.05), // 5% APR
        };
        setStakingInfo(updatedInfo);
        addToast(`Successfully staked ${amount} tokens`, 'success');
        return updatedInfo;
      }
    } catch (err) {
      addToast('Failed to stake tokens', 'error');
      console.error('Error staking tokens:', err);
      throw err;
    }
  };

  const unstakeTokens = async (amount: number) => {
    try {
      // In a real implementation, this would call the staking contract
      // For now, we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (stakingInfo) {
        const updatedInfo: MockStakingInfo = {
          ...stakingInfo,
          stakedAmount: Math.max(0, stakingInfo.stakedAmount - amount),
        };
        setStakingInfo(updatedInfo);
        addToast(`Successfully unstaked ${amount} tokens`, 'success');
        return updatedInfo;
      }
    } catch (err) {
      addToast('Failed to unstake tokens', 'error');
      console.error('Error unstaking tokens:', err);
      throw err;
    }
  };

  const claimRewards = async () => {
    try {
      // In a real implementation, this would call the staking contract
      // For now, we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (stakingInfo) {
        const updatedInfo: MockStakingInfo = {
          ...stakingInfo,
          rewards: 0, // Reset rewards after claiming
        };
        setStakingInfo(updatedInfo);
        addToast(`Successfully claimed ${stakingInfo.rewards} rewards`, 'success');
        return updatedInfo;
      }
    } catch (err) {
      addToast('Failed to claim rewards', 'error');
      console.error('Error claiming rewards:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchStakingInfo();
  }, [fetchStakingInfo]);

  return {
    stakingInfo,
    loading,
    error,
    fetchStakingInfo,
    stakeTokens,
    unstakeTokens,
    claimRewards,
  };
};