import React from 'react';
import { AgentWallet } from '@/components/agents/AgentWallet';
import { ChainLogs } from '@/components/terminal/ChainLogs';
import { ArrowLeft, Bot, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import VoiceInteraction from '@/components/voice/VoiceInteraction';
import { useAgentLogic } from '@/hooks/useAgentLogic';

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

// Required for static export with dynamic routes
export async function generateStaticParams() {
    // In production, fetch all agent IDs from API
    return [
        { id: '1' },
    ];
}

export default function AgentDetailPage({ params }: { params: { id: string } }) {
    const agentId = params.id;

    // In production, fetch agent data from API
    const agent = MOCK_AGENT;

    // Voice Engine Logic
    const { sendMessage, lastResponse, isThinking } = useAgentLogic();

    const handleVoiceInput = async (text: string) => {
        await sendMessage(text);
    };

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

            {/* Voice Interaction Section (The "Natik" Engine) */}
            <div className="mb-8 flex flex-col items-center justify-center py-12 glass-panel rounded-2xl border-axiom-cyan/20 bg-gradient-to-b from-gray-900/80 to-black/80">
                <h2 className="text-3xl font-bold text-white mb-2 font-rajdhani">
                    وكيل "موعد"
                </h2>
                <p className="text-gray-400 mb-8 font-rajdhani">
                    اضغط الزر وتحدث لحجز موعدك
                </p>

                <div className="scale-125 transform transition-transform hover:scale-130">
                    <VoiceInteraction
                        onTranscript={handleVoiceInput}
                        isProcessing={isThinking}
                        isArabic={true}
                        responseToSpeak={lastResponse}
                    />
                </div>

                {/* Text Response Display */}
                {lastResponse && (
                    <div className="mt-12 p-6 bg-white/5 rounded-xl border border-white/10 max-w-lg text-center backdrop-blur-md animate-in fade-in slide-in-from-bottom-4">
                        <p className="text-xl text-axiom-cyan leading-relaxed font-rajdhani" dir="rtl">
                            {lastResponse}
                        </p>
                    </div>
                )}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 opacity-50 hover:opacity-100 transition-opacity duration-500">
                {/* Left Column: Activity & Stats */}
                <div className="lg:col-span-8 space-y-6">
                    {/* On-Chain Logs */}
                    <ChainLogs agentAddress={agent.walletAddress} />
                </div>

                {/* Right Column: Wallet & Controls */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Agent Wallet */}
                    <AgentWallet agentAddress={agent.walletAddress} />
                </div>
            </div>
        </div>
    );
}
