'use client';

import React, { useState } from 'react';
import { Award, Calendar, Clock } from 'lucide-react';

// Mock reward data
const mockRewards = [
  { id: '1', amount: 25.5, date: '2023-06-15T10:30:00Z', status: 'claimed' },
  { id: '2', amount: 32.75, date: '2023-06-10T14:22:00Z', status: 'claimed' },
  { id: '3', amount: 18.25, date: '2023-06-05T09:15:00Z', status: 'claimed' },
  { id: '4', amount: 45.0, date: '2023-05-30T16:45:00Z', status: 'claimed' },
  { id: '5', amount: 22.5, date: '2023-05-25T12:30:00Z', status: 'claimed' },
];

export function RewardsPanel() {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');

  const formatCurrency = (amount: number) => {
    return amount.toFixed(2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateTotalRewards = () => {
    return mockRewards.reduce((total, reward) => total + reward.amount, 0);
  };

  const filteredRewards = mockRewards.filter(reward => {
    const rewardDate = new Date(reward.date);
    const now = new Date();
    
    switch (timeframe) {
      case '7d':
        return rewardDate > new Date(now.setDate(now.getDate() - 7));
      case '30d':
        return rewardDate > new Date(now.setDate(now.getDate() - 30));
      case '90d':
        return rewardDate > new Date(now.setDate(now.getDate() - 90));
      default:
        return true;
    }
  });

  return (
    <div className="glass-panel p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-white">Reward History</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTimeframe('7d')}
            className={`px-3 py-1 text-sm rounded-full ${
              timeframe === '7d'
                ? 'bg-axiom-cyan text-axiom-dark'
                : 'bg-axiom-dark-lighter text-gray-300 hover:bg-gray-700'
            }`}
          >
            7D
          </button>
          <button
            onClick={() => setTimeframe('30d')}
            className={`px-3 py-1 text-sm rounded-full ${
              timeframe === '30d'
                ? 'bg-axiom-cyan text-axiom-dark'
                : 'bg-axiom-dark-lighter text-gray-300 hover:bg-gray-700'
            }`}
          >
            30D
          </button>
          <button
            onClick={() => setTimeframe('90d')}
            className={`px-3 py-1 text-sm rounded-full ${
              timeframe === '90d'
                ? 'bg-axiom-cyan text-axiom-dark'
                : 'bg-axiom-dark-lighter text-gray-300 hover:bg-gray-700'
            }`}
          >
            90D
          </button>
        </div>
      </div>

      <div className="mb-6 p-4 bg-axiom-dark-lighter rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Total Rewards (Selected Period)</p>
            <p className="text-2xl font-bold text-axiom-cyan mt-1">
              {formatCurrency(calculateTotalRewards())} AXM
            </p>
          </div>
          <div className="p-3 bg-axiom-cyan/20 rounded-lg">
            <Award className="w-6 h-6 text-axiom-cyan" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredRewards.length > 0 ? (
          filteredRewards.map((reward) => (
            <div
              key={reward.id}
              className="flex items-center justify-between p-4 bg-axiom-dark-lighter rounded-lg border border-gray-800"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-axiom-purple/20 rounded-lg">
                  <Award className="w-5 h-5 text-axiom-purple" />
                </div>
                <div>
                  <p className="font-medium text-white">Reward Claimed</p>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{formatDate(reward.date)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">
                        {new Date(reward.date).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-axiom-cyan">+{formatCurrency(reward.amount)} AXM</p>
                <p className="text-xs text-gray-400 capitalize">{reward.status}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Award className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No rewards found for the selected period</p>
          </div>
        )}
      </div>
    </div>
  );
}