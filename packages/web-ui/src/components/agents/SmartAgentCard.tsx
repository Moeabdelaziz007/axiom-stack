'use client';

import React from 'react';
import { Activity, Cpu, Zap, Globe, Shield, TrendingUp, MoreVertical } from 'lucide-react';
import { AixAgent } from '@/lib/aixLoader';

interface SmartAgentCardProps {
    agent: AixAgent;
    onClick: (agent: AixAgent) => void;
}

export default function SmartAgentCard({ agent, onClick }: SmartAgentCardProps) {
    // Calculate mock ROI for demo (replace with real data later)
    const roi = (Math.random() * 20 + 5).toFixed(1);
    const uptime = (98 + Math.random() * 2).toFixed(1);

    return (
        <div
            onClick={() => onClick(agent)}
            className="group relative w-full h-[400px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02]"
        >
            {/* Holographic Background */}
            <div className="absolute inset-0 bg-dark-void">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-blue-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />

                {/* Moving Gradient Blob */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {/* Glassmorphism Border */}
            <div className="absolute inset-0 border border-white/10 rounded-2xl group-hover:border-cyan-400/50 transition-colors duration-500" />

            {/* Content Container */}
            <div className="relative h-full p-6 flex flex-col justify-between z-10">

                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <Cpu className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-orbitron font-bold text-white group-hover:text-cyan-400 transition-colors">
                                {agent.name}
                            </h3>
                            <p className="text-xs font-rajdhani text-white/60 uppercase tracking-wider">
                                {agent.id.slice(0, 8)}...
                            </p>
                        </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${agent.status === 'active'
                            ? 'bg-green-500/10 border-green-500/30 text-green-400'
                            : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                        }`}>
                        {agent.status.toUpperCase()}
                    </div>
                </div>

                {/* DNA Visualization (Abstract) */}
                <div className="flex-1 flex items-center justify-center py-4 relative">
                    {/* Animated Helix Lines */}
                    <div className="absolute w-full h-20 flex justify-between opacity-30">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="w-1 h-full bg-cyan-400/50 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                        ))}
                    </div>
                    <div className="text-center z-10">
                        <p className="text-4xl font-bold text-white mb-1">+{roi}%</p>
                        <p className="text-xs text-cyan-400 uppercase tracking-widest">Weekly ROI</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white/5 rounded-lg p-3 border border-white/5 group-hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-2 text-white/60 text-xs mb-1">
                            <Activity className="w-3 h-3" /> Uptime
                        </div>
                        <div className="text-white font-mono">{uptime}%</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/5 group-hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-2 text-white/60 text-xs mb-1">
                            <Zap className="w-3 h-3" /> Speed
                        </div>
                        <div className="text-white font-mono">124ms</div>
                    </div>
                </div>

                {/* Footer / Tools */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex -space-x-2">
                        {agent.capabilities.slice(0, 3).map((cap, i) => (
                            <div key={i} className="w-8 h-8 rounded-full bg-dark-void border border-white/20 flex items-center justify-center text-[10px] text-white/80" title={cap}>
                                {cap.charAt(0).toUpperCase()}
                            </div>
                        ))}
                        {agent.capabilities.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-dark-void border border-white/20 flex items-center justify-center text-[10px] text-white/60">
                                +{agent.capabilities.length - 3}
                            </div>
                        )}
                    </div>
                    <button className="text-cyan-400 text-sm font-bold hover:text-white transition-colors flex items-center gap-1">
                        Manage <TrendingUp className="w-4 h-4" />
                    </button>
                </div>

            </div>
        </div>
    );
}
