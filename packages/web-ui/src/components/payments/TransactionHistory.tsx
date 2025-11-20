'use client';

import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import { MockTransaction } from '@/lib/solana';

interface TransactionHistoryProps {
  transactions: MockTransaction[];
  loading: boolean;
}

export function TransactionHistory({ transactions, loading }: TransactionHistoryProps) {
  const [filter, setFilter] = useState<'all' | 'sent' | 'received' | 'stake' | 'reward'>('all');

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    if (filter === 'sent') return transaction.type === 'payment' && transaction.from === 'user_wallet_address';
    if (filter === 'received') return transaction.type === 'payment' && transaction.to === 'user_wallet_address';
    return transaction.type === filter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <ArrowUpRight className="w-5 h-5 text-axiom-error" />;
      case 'stake':
        return <ArrowUpRight className="w-5 h-5 text-axiom-purple" />;
      case 'unstake':
        return <ArrowDownLeft className="w-5 h-5 text-axiom-cyan" />;
      case 'reward':
        return <ArrowDownLeft className="w-5 h-5 text-axiom-success" />;
      default:
        return <ArrowUpRight className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'payment':
        return 'Payment';
      case 'stake':
        return 'Stake';
      case 'unstake':
        return 'Unstake';
      case 'reward':
        return 'Reward';
      default:
        return 'Transaction';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-axiom-success" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-axiom-warning" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-axiom-error" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-axiom-success/20 text-axiom-success border-axiom-success/30';
      case 'pending':
        return 'bg-axiom-warning/20 text-axiom-warning border-axiom-warning/30';
      case 'failed':
        return 'bg-axiom-error/20 text-axiom-error border-axiom-error/30';
      default:
        return 'bg-gray-700/20 text-gray-400 border-gray-700/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
    <div className="glass-panel p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-white">Transaction History</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'all'
                ? 'bg-axiom-cyan text-axiom-dark'
                : 'bg-axiom-dark-lighter text-gray-300 hover:bg-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('sent')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'sent'
                ? 'bg-axiom-error/20 text-axiom-error border border-axiom-error/30'
                : 'bg-axiom-dark-lighter text-gray-300 hover:bg-gray-700'
            }`}
          >
            Sent
          </button>
          <button
            onClick={() => setFilter('received')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'received'
                ? 'bg-axiom-success/20 text-axiom-success border border-axiom-success/30'
                : 'bg-axiom-dark-lighter text-gray-300 hover:bg-gray-700'
            }`}
          >
            Received
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="p-4 bg-axiom-dark-lighter rounded-lg border border-gray-800"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-800 rounded-lg">
                    {getTypeIcon(transaction.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-white">{getTypeLabel(transaction.type)}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getStatusClass(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{formatDate(transaction.timestamp)}</span>
                      </div>
                      <div className="text-sm font-mono text-gray-400">
                        {transaction.id.substring(0, 8)}...{transaction.id.substring(transaction.id.length - 4)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    transaction.type === 'payment' && transaction.from === 'user_wallet_address'
                      ? 'text-axiom-error'
                      : transaction.type === 'payment' && transaction.to === 'user_wallet_address'
                      ? 'text-axiom-success'
                      : transaction.type === 'reward' || transaction.type === 'unstake'
                      ? 'text-axiom-success'
                      : 'text-axiom-purple'
                  }`}>
                    {transaction.type === 'payment' && transaction.from === 'user_wallet_address' ? '-' : '+'}
                    {transaction.amount.toFixed(2)} AXM
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {transaction.type === 'payment' && transaction.from === 'user_wallet_address'
                      ? `To: ${transaction.to.substring(0, 6)}...${transaction.to.substring(transaction.to.length - 4)}`
                      : transaction.type === 'payment' && transaction.to === 'user_wallet_address'
                      ? `From: ${transaction.from.substring(0, 6)}...${transaction.from.substring(transaction.from.length - 4)}`
                      : transaction.type === 'stake'
                      ? 'Staked tokens'
                      : transaction.type === 'unstake'
                      ? 'Unstaked tokens'
                      : 'Rewards claimed'}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
}