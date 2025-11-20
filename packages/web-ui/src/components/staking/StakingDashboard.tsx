'use client';

import React, { useState } from 'react';
import { TrendingUp, DollarSign, Award, Calculator } from 'lucide-react';
import { MockStakingInfo } from '@/lib/solana';

interface StakingDashboardProps {
  stakingInfo: MockStakingInfo | null;
  loading: boolean;
  onStake: (amount: number) => void;
  onUnstake: (amount: number) => void;
  onClaimRewards: () => void;
}

export function StakingDashboard({
  stakingInfo,
  loading,
  onStake,
  onUnstake,
  onClaimRewards
}: StakingDashboardProps) {
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [showStakeForm, setShowStakeForm] = useState(false);
  const [showUnstakeForm, setShowUnstakeForm] = useState(false);

  const handleStake = () => {
    const amount = parseFloat(stakeAmount);
    if (!isNaN(amount) && amount > 0) {
      onStake(amount);
      setStakeAmount('');
      setShowStakeForm(false);
    }
  };

  const handleUnstake = () => {
    const amount = parseFloat(unstakeAmount);
    if (!isNaN(amount) && amount > 0) {
      onUnstake(amount);
      setUnstakeAmount('');
      setShowUnstakeForm(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel p-6 rounded-lg">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-axiom-cyan"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Staking Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Staked */}
        <div className="glass-panel p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Staked</p>
              <p className="text-2xl font-bold text-white mt-1">
                {stakingInfo ? stakingInfo.stakedAmount.toFixed(2) : '0.00'} AXM
              </p>
            </div>
            <div className="p-3 bg-axiom-cyan/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-axiom-cyan" />
            </div>
          </div>
        </div>

        {/* Rewards */}
        <div className="glass-panel p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Rewards</p>
              <p className="text-2xl font-bold text-white mt-1">
                {stakingInfo ? stakingInfo.rewards.toFixed(2) : '0.00'} AXM
              </p>
            </div>
            <div className="p-3 bg-axiom-purple/20 rounded-lg">
              <Award className="w-6 h-6 text-axiom-purple" />
            </div>
          </div>
        </div>

        {/* APY */}
        <div className="glass-panel p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">APY</p>
              <p className="text-2xl font-bold text-white mt-1">
                {stakingInfo ? stakingInfo.apr.toFixed(2) : '0.00'}%
              </p>
            </div>
            <div className="p-3 bg-axiom-success/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-axiom-success" />
            </div>
          </div>
        </div>
      </div>

      {/* Staking Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stake Tokens */}
        <div className="glass-panel p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Stake Tokens</h3>
            <button
              onClick={() => setShowStakeForm(!showStakeForm)}
              className="text-axiom-cyan hover:text-axiom-cyan/80"
            >
              {showStakeForm ? 'Cancel' : 'Stake'}
            </button>
          </div>

          {showStakeForm ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Amount to Stake
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-axiom-dark-lighter border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-axiom-cyan/30"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-400">AXM</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleStake}
                className="w-full px-4 py-2 bg-axiom-cyan text-axiom-dark rounded-lg hover:bg-cyan-300 font-medium"
              >
                Confirm Stake
              </button>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">
              Stake your AXM tokens to earn rewards and support the network.
            </p>
          )}
        </div>

        {/* Unstake Tokens */}
        <div className="glass-panel p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Unstake Tokens</h3>
            <button
              onClick={() => setShowUnstakeForm(!showUnstakeForm)}
              className="text-axiom-purple hover:text-axiom-purple/80"
            >
              {showUnstakeForm ? 'Cancel' : 'Unstake'}
            </button>
          </div>

          {showUnstakeForm ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Amount to Unstake
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={unstakeAmount}
                    onChange={(e) => setUnstakeAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-axiom-dark-lighter border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-axiom-purple/30"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-400">AXM</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleUnstake}
                className="w-full px-4 py-2 bg-axiom-purple text-white rounded-lg hover:bg-purple-600 font-medium"
              >
                Confirm Unstake
              </button>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">
              Unstake your tokens. Note that there may be a cooldown period.
            </p>
          )}
        </div>
      </div>

      {/* Claim Rewards */}
      <div className="glass-panel p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-white">Claim Rewards</h3>
            <p className="text-gray-400 text-sm mt-1">
              Claim your accumulated staking rewards
            </p>
          </div>
          <button
            onClick={onClaimRewards}
            disabled={!stakingInfo || stakingInfo.rewards <= 0}
            className={`px-4 py-2 rounded-lg font-medium ${
              stakingInfo && stakingInfo.rewards > 0
                ? 'bg-axiom-success text-axiom-dark hover:bg-green-400'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            Claim {stakingInfo ? stakingInfo.rewards.toFixed(2) : '0.00'} AXM
          </button>
        </div>
      </div>
    </div>
  );
}