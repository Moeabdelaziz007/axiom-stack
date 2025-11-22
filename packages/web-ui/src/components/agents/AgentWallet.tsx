'use client';

import React, { useState, useEffect } from 'react';
import { PublicKey, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { Copy, ExternalLink, Wallet, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AgentWalletProps {
    agentAddress: string;
    className?: string;
}

interface TokenBalance {
    mint: string;
    symbol: string;
    amount: number;
    decimals: number;
    usdValue?: number;
}

export function AgentWallet({ agentAddress, className }: AgentWalletProps) {
    const { publicKey, sendTransaction } = useWallet();
    const [solBalance, setSolBalance] = useState<number>(0);
    const [tokens, setTokens] = useState<TokenBalance[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFundModal, setShowFundModal] = useState(false);

    // Initialize Solana connection (use Helius RPC)
    const connection = new Connection(
        process.env.NEXT_PUBLIC_HELIUS_RPC_URL || 'https://api.mainnet-beta.solana.com',
        'confirmed'
    );

    // Fetch agent wallet balance
    useEffect(() => {
        const fetchBalance = async () => {
            try {
                setLoading(true);
                const pubkey = new PublicKey(agentAddress);

                // Get SOL balance
                const balance = await connection.getBalance(pubkey);
                setSolBalance(balance / LAMPORTS_PER_SOL);

                // Get token balances (SPL tokens)
                const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubkey, {
                    programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), // SPL Token Program
                });

                const tokenBalances: TokenBalance[] = tokenAccounts.value.map((accountInfo) => {
                    const parsedInfo = accountInfo.account.data.parsed.info;
                    return {
                        mint: parsedInfo.mint,
                        symbol: 'Unknown', // Would need token metadata lookup
                        amount: parsedInfo.tokenAmount.uiAmount || 0,
                        decimals: parsedInfo.tokenAmount.decimals,
                    };
                }).filter(token => token.amount > 0);

                setTokens(tokenBalances);
            } catch (error) {
                console.error('Error fetching wallet balance:', error);
                toast.error('Failed to load wallet balance');
            } finally {
                setLoading(false);
            }
        };

        if (agentAddress) {
            fetchBalance();
            // Refresh every 30 seconds
            const interval = setInterval(fetchBalance, 30000);
            return () => clearInterval(interval);
        }
    }, [agentAddress, connection]);

    // Copy address to clipboard
    const copyAddress = () => {
        navigator.clipboard.writeText(agentAddress);
        toast.success('Address copied to clipboard!');
    };

    // Calculate total value in USD (simplified - would need price API)
    const totalValueUSD = solBalance * 100; // Placeholder: Assume $100 per SOL

    return (
        <div className={cn('glass-panel rounded-xl p-6', className)}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-axiom-cyan" />
                    <h3 className="text-lg font-display text-white">Agent Wallet</h3>
                </div>
                {loading && (
                    <div className="w-2 h-2 bg-axiom-warning rounded-full animate-pulse" />
                )}
            </div>

            {/* Total Value */}
            <div className="mb-6">
                <p className="text-sm text-gray-400 mb-1">Total Value</p>
                <p className="text-3xl font-mono font-bold text-axiom-cyan">
                    ${totalValueUSD.toFixed(2)}
                </p>
            </div>

            {/* Address */}
            <div className="mb-6">
                <p className="text-sm text-gray-400 mb-2">Wallet Address</p>
                <div className="flex items-center gap-2 bg-gray-900/50 rounded-lg p-3">
                    <code className="text-xs text-gray-300 flex-1 truncate">
                        {agentAddress}
                    </code>
                    <button
                        onClick={copyAddress}
                        className="text-gray-400 hover:text-axiom-cyan transition-colors"
                    >
                        <Copy className="w-4 h-4" />
                    </button>
                    <a
                        href={`https://solscan.io/account/${agentAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-axiom-cyan transition-colors"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>

            {/* Assets Breakdown */}
            <div className="mb-6">
                <p className="text-sm text-gray-400 mb-3">Assets</p>
                <div className="space-y-2">
                    {/* SOL Balance */}
                    <div className="flex items-center justify-between bg-gray-900/30 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500" />
                            <span className="text-sm font-medium text-white">SOL</span>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-mono text-white">{solBalance.toFixed(4)}</p>
                            <p className="text-xs text-gray-400">${(solBalance * 100).toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Token Balances */}
                    {tokens.map((token, index) => (
                        <div key={token.mint} className="flex items-center justify-between bg-gray-900/30 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gray-700" />
                                <span className="text-sm font-medium text-white">{token.symbol}</span>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-mono text-white">{token.amount.toFixed(2)}</p>
                                {token.usdValue && (
                                    <p className="text-xs text-gray-400">${token.usdValue.toFixed(2)}</p>
                                )}
                            </div>
                        </div>
                    ))}

                    {tokens.length === 0 && !loading && (
                        <p className="text-xs text-gray-500 text-center py-2">No tokens yet</p>
                    )}
                </div>
            </div>

            {/* Fund Agent Button */}
            <Button
                className="w-full bg-gradient-to-r from-axiom-cyan to-axiom-purple text-black font-semibold hover:opacity-90 transition-opacity"
                onClick={() => setShowFundModal(true)}
                disabled={!publicKey}
            >
                <Send className="w-4 h-4 mr-2" />
                Fund Agent
            </Button>

            {!publicKey && (
                <p className="text-xs text-center text-gray-500 mt-2">
                    Connect your wallet to fund this agent
                </p>
            )}

            {/* TODO: Fund Modal - Would implement transfer UI here */}
        </div>
    );
}
