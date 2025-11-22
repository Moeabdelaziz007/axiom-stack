'use client';

import React, { useState, useEffect } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, ConfirmedSignatureInfo } from '@solana/web3.js';
import { format } from 'date-fns';
import { Link2, ExternalLink, RefreshCw, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ChainLogsProps {
    agentAddress: string;
    className?: string;
}

interface OnChainTransaction {
    signature: string;
    slot: number;
    timestamp: number;
    type: 'transfer' | 'trade' | 'memo' | 'unknown';
    memo?: string;
    amount?: number;
}

export function ChainLogs({ agentAddress, className }: ChainLogsProps) {
    const { connection } = useConnection();
    const [transactions, setTransactions] = useState<OnChainTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [expandedTx, setExpandedTx] = useState<Set<string>>(new Set());

    // Fetch transaction history
    const fetchTransactions = async () => {
        try {
            setRefreshing(true);
            const pubkey = new PublicKey(agentAddress);

            // Get signatures for address
            const signatures = await connection.getSignaturesForAddress(pubkey, { limit: 20 });

            // Parse transactions
            const txs: OnChainTransaction[] = signatures.map((sig: ConfirmedSignatureInfo) => ({
                signature: sig.signature,
                slot: sig.slot,
                timestamp: sig.blockTime ? sig.blockTime * 1000 : Date.now(),
                type: sig.memo ? 'memo' : 'unknown',
                memo: sig.memo || undefined,
            }));

            setTransactions(txs);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            toast.error('Failed to load on-chain logs');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (agentAddress) {
            fetchTransactions();
            // Refresh every 30 seconds
            const interval = setInterval(fetchTransactions, 30000);
            return () => clearInterval(interval);
        }
    }, [agentAddress, connection]);

    const toggleExpand = (signature: string) => {
        setExpandedTx(prev => {
            const newSet = new Set(prev);
            if (newSet.has(signature)) {
                newSet.delete(signature);
            } else {
                newSet.add(signature);
            }
            return newSet;
        });
    };

    const getTxTypeColor = (type: OnChainTransaction['type']) => {
        switch (type) {
            case 'trade':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'transfer':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'memo':
                return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            default:
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        }
    };

    const getTxTypeLabel = (type: OnChainTransaction['type']) => {
        switch (type) {
            case 'trade':
                return 'TRADE';
            case 'transfer':
                return 'TRANSFER';
            case 'memo':
                return 'MEMO';
            default:
                return 'TX';
        }
    };

    return (
        <div className={cn('glass-panel rounded-xl overflow-hidden', className)}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
                <div className="flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-yellow-400" />
                    <h3 className="font-display text-white">On-Chain Activity</h3>
                    {loading && (
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    )}
                </div>
                <button
                    onClick={fetchTransactions}
                    disabled={refreshing}
                    className="text-gray-400 hover:text-yellow-400 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={cn('w-4 h-4', refreshing && 'animate-spin')} />
                </button>
            </div>

            {/* Transaction List */}
            <div className="divide-y divide-gray-800/50 max-h-96 overflow-y-auto">
                {loading && transactions.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-500">No on-chain activity yet</p>
                    </div>
                ) : (
                    transactions.map((tx) => {
                        const isExpanded = expandedTx.has(tx.signature);
                        return (
                            <div
                                key={tx.signature}
                                className="p-4 hover:bg-gray-800/30 transition-colors"
                            >
                                <div className="flex items-start gap-3">
                                    {/* Timestamp */}
                                    <span className="text-xs text-gray-500 whitespace-nowrap min-w-16">
                                        {format(new Date(tx.timestamp), 'HH:mm:ss')}
                                    </span>

                                    {/* Type Badge */}
                                    <span className={cn(
                                        'px-2 py-1 text-xs font-mono rounded border',
                                        getTxTypeColor(tx.type)
                                    )}>
                                        {getTxTypeLabel(tx.type)}
                                    </span>

                                    {/* Signature */}
                                    <div className="flex-1 min-w-0">
                                        <code className="text-xs text-gray-400 font-mono truncate block">
                                            {tx.signature.slice(0, 16)}...{tx.signature.slice(-8)}
                                        </code>
                                        <p className="text-xs text-gray-600 mt-1">
                                            Slot: {tx.slot.toLocaleString()}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        {tx.memo && (
                                            <button
                                                onClick={() => toggleExpand(tx.signature)}
                                                className="text-purple-400 hover:text-purple-300 transition-colors"
                                            >
                                                {isExpanded ? (
                                                    <ChevronDown className="w-4 h-4" />
                                                ) : (
                                                    <ChevronRight className="w-4 h-4" />
                                                )}
                                            </button>
                                        )}
                                        <a
                                            href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-yellow-400 hover:text-yellow-300 transition-colors"
                                            title="View on Solana Explorer"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>

                                {/* Expanded Memo */}
                                {tx.memo && isExpanded && (
                                    <div className="mt-3 ml-20 p-3 bg-purple-950/30 border border-purple-500/30 rounded-lg">
                                        <p className="text-xs text-purple-300 font-mono whitespace-pre-wrap">
                                            {tx.memo}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-gray-800/50 bg-gray-900/50">
                <span className="text-xs text-gray-500 font-mono">
                    {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
                </span>
                <a
                    href={`https://explorer.solana.com/address/${agentAddress}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1"
                >
                    View All
                    <ExternalLink className="w-3 h-3" />
                </a>
            </div>
        </div>
    );
}
