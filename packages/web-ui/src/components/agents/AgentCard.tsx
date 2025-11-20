'use client';

import { motion } from 'framer-motion';
import { Activity, Bot } from 'lucide-react';
import { MockAgent } from '@/lib/solana';
import { AixAgent } from '@/lib/aixLoader';
import { StatusDot } from './StatusDot';

interface AgentCardProps {
  agent: AixAgent;
  onClick?: () => void;
}

export function AgentCard({ agent, onClick }: AgentCardProps) {
  // Truncate agent ID to first 8 characters
  const truncatedId = agent.id.length > 8 ? `${agent.id.substring(0, 8)}...` : agent.id;

  // Use the reputation from AIX data instead of calculating it
  const reputation = agent.reputation || 50;

  // Determine reputation ring color
  const getReputationRingColor = () => {
    if (reputation > 90) return '#00FF88'; // axiom-success
    if (reputation > 50) return '#FFB800'; // axiom-warning
    return '#FF4444'; // axiom-error
  };

  // Calculate stroke dasharray for circular progress
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (reputation / 100) * circumference;

  return (
    <motion.div
      className="glass-panel-premium p-6 h-full hover:border-axiom-cyan/30 transition-all duration-300 cursor-pointer group relative overflow-hidden hover:-translate-y-1 hover:shadow-axiom-cyan/20"
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
    >
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-axiom-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Header */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-axiom-cyan/10 text-axiom-cyan group-hover:scale-110 transition-transform duration-300">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white tracking-wide group-hover:text-axiom-cyan transition-colors">
                {agent.name || truncatedId}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <StatusDot status={agent.status} />
                <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">{agent.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reputation Score Ring */}
        <div className="relative w-14 h-14 group-hover:scale-110 transition-transform duration-300">
          <svg className="w-14 h-14 drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]" viewBox="0 0 50 50">
            <circle
              cx="25"
              cy="25"
              r={radius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="3"
            />
            <circle
              cx="25"
              cy="25"
              r={radius}
              fill="none"
              stroke={getReputationRingColor()}
              strokeWidth="3"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 25 25)"
              className="drop-shadow-[0_0_8px_currentColor]"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm font-mono font-bold text-white text-glow">{Math.round(reputation)}</span>
            <span className="text-[8px] text-gray-500 uppercase">REP</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-400 text-sm mb-6 line-clamp-2 font-light relative z-10 group-hover:text-gray-300 transition-colors">
        {agent.description}
      </p>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 mb-6 relative z-10">
        <div className="bg-black/20 rounded-lg p-2 border border-white/5 backdrop-blur-sm">
          <div className="flex items-center text-gray-500 mb-1">
            <Activity className="w-3 h-3 mr-1" />
            <span className="text-[10px] uppercase tracking-wider">Caps</span>
          </div>
          <p className="font-mono text-sm text-white text-glow">{agent.capabilities.length}</p>
        </div>

        <div className="bg-black/20 rounded-lg p-2 border border-white/5 backdrop-blur-sm">
          <div className="flex items-center text-axiom-cyan/80 mb-1">
            <Activity className="w-3 h-3 mr-1" />
            <span className="text-[10px] uppercase tracking-wider">Load</span>
          </div>
          <p className="font-mono text-sm text-axiom-cyan text-glow">{agent.loadFactor || 0}%</p>
        </div>

        <div className="bg-black/20 rounded-lg p-2 border border-white/5 backdrop-blur-sm">
          <div className="flex items-center text-axiom-purple/80 mb-1">
            <Activity className="w-3 h-3 mr-1" />
            <span className="text-[10px] uppercase tracking-wider">Cost</span>
          </div>
          <p className="font-mono text-sm text-axiom-purple text-glow">{agent.costPerAction || 0}</p>
        </div>
      </div>

      {/* Capabilities */}
      <div className="relative z-10">
        <div className="flex flex-wrap gap-1.5">
          {agent.capabilities.slice(0, 3).map((capability, index) => (
            <span
              key={index}
              className="px-2 py-1 rounded text-[10px] font-mono text-axiom-cyan bg-axiom-cyan/5 border border-axiom-cyan/10"
            >
              {capability}
            </span>
          ))}
          {agent.capabilities.length > 3 && (
            <span className="px-2 py-1 rounded text-[10px] font-mono text-gray-500 bg-white/5 border border-white/5">
              +{agent.capabilities.length - 3}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}