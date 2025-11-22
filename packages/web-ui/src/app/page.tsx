'use client';

import Link from 'next/link';
import { Sparkles, TrendingUp, Users } from 'lucide-react';
import ExampleAgentCard from '@/components/dashboard/ExampleAgentCard';
import HeliosChatPanel from '@/components/dashboard/HeliosChatPanel';

// Agent Data
const EXAMPLE_AGENTS = [
  {
    name: 'Content Creator AI',
    role: 'Social Media & Content Strategist',
    status: 'ONLINE' as const,
    activity: 'Posted 3 updates today',
    tools: ['Twitter', 'DALL-E', 'GPT-4']
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
    tools: ['Booking.com', 'Google Flights', 'Maps']
  }
];

export default function CommandCenterDashboard() {
  return (
    <div className="min-h-screen p-8 relative">
      {/* Helios Talent Agent */}
      <HeliosChatPanel />

      {/* Hero Section */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h1 className="text-6xl md:text-7xl font-orbitron font-bold mb-4 text-gradient-cyber">
            AXIOM COMMAND CENTER
          </h1>
          <p className="text-xl text-gray-400 font-rajdhani max-w-3xl mx-auto">
            Design, Deploy, and Manage AI Agents in the Quantum Command Center
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          <div className="holographic-panel p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-5 h-5 text-cyber-cyan" />
              <span className="text-sm font-rajdhani text-gray-400">Total Agents</span>
            </div>
            <p className="text-3xl font-orbitron font-bold text-white">12,405</p>
          </div>

          <div className="holographic-panel p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-neon-purple" />
              <span className="text-sm font-rajdhani text-gray-400">Total Value</span>
            </div>
            <p className="text-3xl font-orbitron font-bold text-white">$4.2B</p>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-holo-blue" />
              <span className="text-sm font-rajdhani text-gray-400">Market Cap</span>
            </div>
            <p className="text-3xl font-orbitron font-bold text-white">$8.7B</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            href="/aix-studio"
            className="cyber-button inline-flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Create Your Own Agent
          </Link>
        </div>
      </div>

      {/* Example Agents Section */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-orbitron font-bold text-white mb-2">
            Featured Agents
          </h2>
          <p className="text-gray-400 font-rajdhani">
            Explore our pre-configured AI agents ready for deployment
          </p>
        </div>

        {/* Agent Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {EXAMPLE_AGENTS.map((agent, index) => (
            <div
              key={agent.name}
              className="animate-slide-in"
              style={{
                animationDelay: `${index * 150}ms`
              }}
            >
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