'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { AgentWallet } from '@/components/agents/AgentWallet';
import { ChainLogs } from '@/components/terminal/ChainLogs';
import { ArrowLeft, Bot, TrendingUp } from 'lucide-react';
import Link from 'next/link';

// Mock agent data - would come from API
interface Agent {
    id: string;
    name: string;
    ticker: string;
    walletAddress: string;
    description: string;
    riskTolerance: number;
    createdAt: string;
}

const MOCK_AGENT: Agent = {
    id: '1',
    name: 'Alpha Trader',
    ticker: 'ALPHA',
    walletAddress: 'DemoWa11etAddressSo1anaTestnetExamp1e12345678',
    description: 'Autonomous trading agent focused on DeFi opportunities',
    riskTolerance: 7,
    createdAt: '2025-01-15T00:00:00Z',
};

export default function AgentDetailPage() {
    const params = useParams();
    const agentId = params.id as string;

    // In production, fetch agent data from API
    const agent = MOCK_AGENT;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
            {/* Back Button */}
            <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </Link>

            {/* Agent Header */}
            <div className="glass-panel rounded-xl p-6 mb-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        {/* Agent Icon */}
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-axiom-cyan to-axiom-purple flex items-center justify-center">
                            <Bot className="w-8 h-8 text-white" />
                        </div>

                        {/* Agent Info */}
                        <div>
                            <h1 className="text-2xl font-display text-white mb-1">
                                {agent.name}
                            </h1>
                            <p className="text-sm text-axiom-cyan font-mono mb-2">
                                ${agent.ticker}
                            </p>
                            <p className="text-sm text-gray-400 max-w-2xl">
                                {agent.description}
                            </p>
                        </div>
                    </div>

                    {/* Risk Badge */}
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-800">
                        <TrendingUp className="w-4 h-4 text-axiom-purple" />
                        <span className="text-sm text-gray-300">
                            Risk: <span className="text-axiom-purple font-semibold">{agent.riskTolerance}/10</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Activity & Stats */}
                <div className="lg:col-span-8 space-y-6">
                    {/* On-Chain Logs */}
                    <ChainLogs agentAddress={agent.walletAddress} />

                    {/* Agent Stats */}
                    <div className="glass-panel rounded-xl p-6">
                        <h3 className="text-lg font-display text-white mb-4">Performance Stats</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-4 rounded-lg bg-gray-900/30">
                                <p className="text-2xl font-mono font-bold text-axiom-cyan">$0.00</p>
                                <p className="text-xs text-gray-500 mt-1">Total PnL</p>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-gray-900/30">
                                <p className="text-2xl font-mono font-bold text-white">0</p>
                                <p className="text-xs text-gray-500 mt-1">Trades</p>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-gray-900/30">
                                <p className="text-2xl font-mono font-bold text-axiom-purple">0%</p>
                                <p className="text-xs text-gray-500 mt-1">Win Rate</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Wallet & Controls */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Agent Wallet */}
                    <AgentWallet agentAddress={agent.walletAddress} />

                    {/* Agent Controls */}
                    <div className="glass-panel rounded-xl p-6">
                        <h3 className="text-lg font-display text-white mb-4">Controls</h3>
                        <div className="space-y-3">
                            <button className="w-full px-4 py-2 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-colors font-semibold">
                                Start Trading
                            </button>
                            <button className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700 transition-colors">
                                Pause Agent
                            </button>
                            <button className="w-full px-4 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors">
                                Emergency Stop
                            </button>
                        </div>
                    </div>

                    {/* Agent Metadata */}
                    <div className="glass-panel rounded-xl p-6">
                        <h3 className="text-lg font-display text-white mb-4">Details</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Created</p>
                                <p className="text-sm text-gray-300 font-mono">
                                    {new Date(agent.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Agent ID</p>
                                <p className="text-sm text-gray-300 font-mono truncate">
                                    {agent.id}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Status</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-axiom-success animate-pulse" />
                                    <span className="text-sm text-axiom-success">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
