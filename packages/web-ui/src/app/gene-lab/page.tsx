'use client';

import React, { useState } from 'react';
import { Dna, Wallet, Sparkles, Clock } from 'lucide-react';
import DNAHelix from '@/components/3d/DNAHelix';
import { useWallet } from '@/contexts/WalletContext';

export default function GeneLabPage() {
    const { status, connectWallet } = useWallet();
    const connected = status === 'connected';

    const [agentName, setAgentName] = useState('');
    const [systemPrompt, setSystemPrompt] = useState('');
    const [royaltyFee, setRoyaltyFee] = useState(5);
    const [isMinting, setIsMinting] = useState(false);
    const [mintedAgent, setMintedAgent] = useState<string | null>(null);

    const handleMint = () => {
        if (!connected) {
            connectWallet();
            return;
        }
        if (!agentName) return;

        setIsMinting(true);

        // Simulate minting delay
        setTimeout(() => {
            setIsMinting(false);
            setMintedAgent(agentName);
            // Reset form
            setAgentName('');
            setSystemPrompt('');
        }, 4000);
    };

    const recentMints = [
        { name: 'Alpha Trader X', type: 'DeFi Trader', time: '2 mins ago' },
        { name: 'Creative Soul v2', type: 'Content Creator', time: '15 mins ago' },
        { name: 'Voyager 9000', type: 'Travel Assistant', time: '1 hour ago' },
        { name: 'Arbitrage King', type: 'DeFi Trader', time: '3 hours ago' },
    ];

    return (
        <div className="p-8 min-h-screen text-white">
            {/* Header */}
            <div className="mb-12">
                <h1 className="text-5xl font-orbitron font-bold text-gradient-cyber mb-4">
                    GENE LAB
                </h1>
                <p className="text-xl text-white/60 font-rajdhani max-w-2xl">
                    Mint sovereign AI agents with unique DNA sequences. Define their genesis parameters and deploy them to the blockchain.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Minting Form (7 cols) */}
                <div className="lg:col-span-7 space-y-8">

                    {/* Minting Console */}
                    <div className="glass-panel p-8 rounded-2xl border border-cyber-cyan/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <Dna className="w-32 h-32 text-cyber-cyan" />
                        </div>

                        <h2 className="text-2xl font-orbitron text-white mb-6 flex items-center gap-3">
                            <Sparkles className="w-6 h-6 text-cyber-cyan" />
                            Genesis Configuration
                        </h2>

                        <div className="space-y-6 relative z-10">
                            {/* Agent Name */}
                            <div>
                                <label className="block text-sm font-rajdhani text-cyber-cyan mb-2">
                                    Agent Designation (Name)
                                </label>
                                <input
                                    type="text"
                                    value={agentName}
                                    onChange={(e) => setAgentName(e.target.value)}
                                    placeholder="e.g. Nexus Prime"
                                    className="w-full bg-dark-void/80 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyber-cyan focus:shadow-glow-cyan focus:outline-none transition-all font-orbitron"
                                />
                            </div>

                            {/* System Prompt */}
                            <div>
                                <label className="block text-sm font-rajdhani text-cyber-cyan mb-2">
                                    Core DNA (System Prompt)
                                </label>
                                <textarea
                                    value={systemPrompt}
                                    onChange={(e) => setSystemPrompt(e.target.value)}
                                    placeholder="// Define the agent's core personality and directives..."
                                    className="w-full h-32 bg-dark-void/80 border border-white/10 rounded-xl px-4 py-3 text-white/80 font-mono text-sm focus:border-cyber-cyan focus:shadow-glow-cyan focus:outline-none transition-all resize-none"
                                />
                            </div>

                            {/* Royalty Slider */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-rajdhani text-cyber-cyan">Creator Royalty</label>
                                    <span className="text-sm font-mono text-axiom-success">{royaltyFee}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="15"
                                    step="0.5"
                                    value={royaltyFee}
                                    onChange={(e) => setRoyaltyFee(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider-green"
                                />
                            </div>

                            {/* Action Button */}
                            <div className="pt-4">
                                {!connected ? (
                                    <button
                                        onClick={connectWallet}
                                        className="w-full py-4 bg-white/5 border border-white/20 text-white font-bold rounded-xl hover:bg-white/10 transition flex items-center justify-center gap-2 font-orbitron"
                                    >
                                        <Wallet className="w-5 h-5" />
                                        Connect Wallet to Mint
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleMint}
                                        disabled={isMinting || !agentName}
                                        className="w-full py-4 bg-gradient-to-r from-cyber-cyan to-holo-blue text-dark-void font-bold rounded-xl hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-orbitron relative overflow-hidden group"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {isMinting ? 'SEQUENCING DNA...' : 'MINT GENESIS NFT'}
                                            {!isMinting && <Dna className="w-5 h-5 group-hover:animate-spin-slow" />}
                                        </span>
                                        {isMinting && (
                                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent Mints */}
                    <div>
                        <h3 className="text-xl font-orbitron text-white mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-white/50" />
                            Recent Mints
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {recentMints.map((mint, i) => (
                                <div key={i} className="glass-card p-4 flex items-center justify-between group hover:border-cyber-cyan/50">
                                    <div>
                                        <p className="font-orbitron text-white text-sm group-hover:text-cyber-cyan transition-colors">{mint.name}</p>
                                        <p className="text-xs text-white/50 font-rajdhani">{mint.type}</p>
                                    </div>
                                    <span className="text-xs font-mono text-white/30">{mint.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: DNA Visualization (5 cols) */}
                <div className="lg:col-span-5">
                    <div className="sticky top-8">
                        <div className="glass-panel p-1 rounded-2xl border border-cyber-cyan/30 h-[600px] relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-cyber-cyan/5 to-neon-purple/5 rounded-2xl"></div>

                            {/* DNA Component */}
                            <DNAHelix
                                isMinting={isMinting}
                                agentName={agentName.includes('Trader') ? 'DeFi Trader' : agentName.includes('Travel') ? 'Travel Assistant' : 'Content Creator'}
                            />

                            {/* Success Overlay */}
                            {mintedAgent && !isMinting && (
                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-dark-void/90 backdrop-blur-sm rounded-2xl animate-fade-in">
                                    <div className="w-20 h-20 rounded-full bg-axiom-success/20 border-2 border-axiom-success flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(0,255,148,0.4)]">
                                        <Dna className="w-10 h-10 text-axiom-success" />
                                    </div>
                                    <h3 className="text-2xl font-orbitron text-white mb-2">Mint Successful!</h3>
                                    <p className="text-axiom-success font-mono mb-6">{mintedAgent}</p>
                                    <button
                                        onClick={() => setMintedAgent(null)}
                                        className="px-6 py-2 border border-white/30 rounded-lg text-white/70 hover:text-white hover:border-white transition font-rajdhani"
                                    >
                                        Mint Another
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
