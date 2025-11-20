'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import { MockTransaction } from '@/lib/solana';

interface TransactionCardProps {
  transaction: MockTransaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
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

  return (
    <div className="p-4 bg-axiom-dark-lighter rounded-lg border border-gray-800">
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
  );
}