'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, TrendingUp, Users, Mic, Activity, Globe, Zap } from 'lucide-react';
import ExampleAgentCard from '@/components/dashboard/ExampleAgentCard';
import HeliosChatPanel from '@/components/dashboard/HeliosChatPanel';
import VoiceFactoryModal from '@/components/aix-studio/VoiceFactoryModal';

// Agent Data
const INITIAL_AGENTS = [
  {
    name: 'Content Creator AI',
    role: 'Social Media & Content Strategist',
    status: 'ONLINE' as const,
    activity: 'Posted 3 updates today',
    tools: ['YouTube API', 'NotebookLLM', 'Imagen 3', 'Gemini 1.5 Pro']
  },
  {
    name: 'DeFi Trader AI',
    role: 'Crypto Trading + Flash Loans',
    status: 'ONLINE' as const,
    activity: '2 trades executed, +$450 profit',
    tools: ['Binance', 'Phantom', 'Aave']
  },
  {
    name: 'Travel Assistant AI',
    role: 'Trip Planning & Booking',
    status: 'ONLINE' as const,
    activity: '3 itineraries created',
    tools: ['Open-Meteo', 'ExchangeRate-API', 'Google Flights', 'Maps']
  }
];

export default function CommandCenterDashboard() {
  const [isVoiceFactoryOpen, setIsVoiceFactoryOpen] = useState(false);
  const [agents, setAgents] = useState(INITIAL_AGENTS);

  const handleAgentCreated = (newAgent: any) => {
    setAgents(prev => [newAgent, ...prev]);
  };

  return (
    <div className="min-h-screen p-8 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="holographic-grid-bg"></div>

      {/* Helios Talent Agent */}
      <HeliosChatPanel />

      {/* Voice Factory Modal */}
      <VoiceFactoryModal
        isOpen={isVoiceFactoryOpen}
        onClose={() => setIsVoiceFactoryOpen(false)}
        onAgentCreated={handleAgentCreated}
      />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header Section */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl md:text-6xl font-orbitron font-bold mb-2 text-gradient-cyber animate-float">
              AXIOM COMMAND CENTER
            </h1>
            <p className="text-lg text-gray-400 font-rajdhani">
              Quantum-Enhanced Agent Orchestration System
            </p>
          </div>

          <div className="flex gap-4">
            <Link
              href="/aix-studio"
              className="plasma-button inline-flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Sparkles className="w-5 h-5" />
              Create Agent
            </Link>

            <button
              onClick={() => setIsVoiceFactoryOpen(true)}
              className="plasma-button inline-flex items-center gap-2 border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/10 hover:scale-105 transition-transform"
            >
              <Mic className="w-5 h-5" />
              Voice Factory
            </button>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="bento-grid mb-12">

          {/* Stat 1: Total Agents (Large) */}
          <div className="bento-card col-span-2 p-8 flex flex-col justify-between group">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-cyber-cyan/10 rounded-xl border border-cyber-cyan/30 group-hover:shadow-glow-cyan transition-shadow">
                <Users className="w-8 h-8 text-cyber-cyan" />
              </div>
              <span className="text-xs font-mono text-cyber-cyan bg-cyber-cyan/10 px-2 py-1 rounded">+12% this week</span>
            </div>
            <div>
              <span className="text-sm font-rajdhani text-gray-400 uppercase tracking-wider">Active Agents</span>
              <p className="text-5xl font-orbitron font-bold text-white mt-2 group-hover:text-cyber-cyan transition-colors">12,405</p>
            </div>
          </div>

          {/* Stat 2: Total Value */}
          <div className="bento-card col-span-1 p-6 flex flex-col justify-between group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-neon-purple/10 rounded-lg border border-neon-purple/30">
                <TrendingUp className="w-5 h-5 text-neon-purple" />
              </div>
              <span className="text-sm font-rajdhani text-gray-400">Total Value</span>
            </div>
            <p className="text-3xl font-orbitron font-bold text-white group-hover:text-neon-purple transition-colors">$4.2B</p>
          </div>

          {/* Stat 3: Market Cap */}
          <div className="bento-card col-span-1 p-6 flex flex-col justify-between group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-holo-blue/10 rounded-lg border border-holo-blue/30">
                <Globe className="w-5 h-5 text-holo-blue" />
              </div>
              <span className="text-sm font-rajdhani text-gray-400">Market Cap</span>
            </div>
            <p className="text-3xl font-orbitron font-bold text-white group-hover:text-holo-blue transition-colors">$8.7B</p>
          </div>

          {/* Middle Row: Network Activity Map (Placeholder) */}
          <div className="bento-card col-span-3 row-span-2 p-6 min-h-[300px] relative group">
            <div className="absolute top-6 left-6 z-10">
              <h3 className="text-xl font-orbitron text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-axiom-glow animate-pulse" />
                Network Activity
              </h3>
            </div>
            {/* Abstract Map Visualization */}
            <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity">
              <div className="w-full h-full bg-[url('/images/scanlines.png')] bg-cover opacity-20"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyber-cyan/20 rounded-full blur-[100px] animate-pulse"></div>
            </div>
            <div className="absolute bottom-6 right-6 text-right">
              <p className="text-4xl font-orbitron text-white">2.4M</p>
              <p className="text-sm text-gray-400 font-rajdhani">Transactions / Sec</p>
            </div>
          </div>

          {/* Middle Row: System Status */}
          <div className="bento-card col-span-1 row-span-2 p-6 flex flex-col gap-4">
            <h3 className="text-sm font-orbitron text-gray-400 uppercase tracking-wider mb-2">System Status</h3>

            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:border-cyber-cyan/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-axiom-success shadow-[0_0_10px_#00ff94]"></div>
                <span className="text-sm font-rajdhani text-white">Mainnet</span>
              </div>
              <span className="text-xs font-mono text-axiom-success">99.9%</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:border-neon-purple/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-neon-purple shadow-[0_0_10px_#9d4edd]"></div>
                <span className="text-sm font-rajdhani text-white">Agent Factory</span>
              </div>
              <span className="text-xs font-mono text-neon-purple">Idle</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:border-holo-blue/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-holo-blue shadow-[0_0_10px_#4facfe]"></div>
                <span className="text-sm font-rajdhani text-white">Voice Core</span>
              </div>
              <span className="text-xs font-mono text-holo-blue">Active</span>
            </div>

            <div className="mt-auto pt-4 border-t border-white/10">
              <button className="w-full py-2 text-xs font-orbitron text-cyber-cyan border border-cyber-cyan/30 rounded hover:bg-cyber-cyan/10 transition-colors">
                VIEW SYSTEM LOGS
              </button>
            </div>
          </div>

        </div>

        {/* Featured Agents Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-orbitron font-bold text-white mb-1">
              Featured Agents
            </h2>
            <p className="text-gray-400 font-rajdhani text-sm">
              Top performing autonomous units
            </p>
          </div>
          <Link href="/marketplace" className="text-cyber-cyan text-sm font-orbitron hover:underline">
            View All Marketplace &gt;
          </Link>
        </div>

        {/* Agent Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent, index) => (
            <div key={index} className="flex justify-center relative animate-float-delayed" style={{ animationDelay: `${index * 0.5}s` }}>
              {/* Voice Generated Badge */}
              {(agent as any).isVoiceGenerated && (
                <div className="absolute -top-3 right-4 z-10 px-3 py-1 bg-cyber-cyan text-dark-void font-bold text-xs rounded-full font-orbitron shadow-[0_0_10px_rgba(0,255,255,0.5)] animate-pulse">
                  GENERATED BY VOICE
                </div>
              )}
              <ExampleAgentCard agent={agent} />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="max-w-7xl mx-auto mt-16">
        <div className="glass-panel p-8 rounded-2xl">
          <h3 className="text-2xl font-orbitron font-bold text-white mb-6">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/aix-studio"
              className="p-4 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-lg hover:bg-cyber-cyan/20 transition-all duration-200 group"
            >
              <Sparkles className="w-8 h-8 text-cyber-cyan mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-orbitron font-bold text-white mb-1">Create Agent</h4>
              <p className="text-sm text-gray-400 font-rajdhani">Design a new AI agent</p>
            </Link>

            <Link
              href="/gene-lab"
              className="p-4 bg-neon-purple/10 border border-neon-purple/30 rounded-lg hover:bg-neon-purple/20 transition-all duration-200 group"
            >
              <svg className="w-8 h-8 text-neon-purple mb-2 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <h4 className="font-orbitron font-bold text-white mb-1">Gene Lab</h4>
              <p className="text-sm text-gray-400 font-rajdhani">Mint agent DNA NFTs</p>
            </Link>

            <Link
              href="/gig-economy"
              className="p-4 bg-holo-blue/10 border border-holo-blue/30 rounded-lg hover:bg-holo-blue/20 transition-all duration-200 group"
            >
              <svg className="w-8 h-8 text-holo-blue mb-2 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h4 className="font-orbitron font-bold text-white mb-1">Gig Economy</h4>
              <p className="text-sm text-gray-400 font-rajdhani">Rent AI agents</p>
            </Link>

            <Link
              href="/marketplace"
              className="p-4 bg-axiom-glow/10 border border-axiom-glow/30 rounded-lg hover:bg-axiom-glow/20 transition-all duration-200 group"
            >
              <svg className="w-8 h-8 text-axiom-glow mb-2 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h4 className="font-orbitron font-bold text-white mb-1">Marketplace</h4>
              <p className="text-sm text-gray-400 font-rajdhani">Browse & trade agents</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}