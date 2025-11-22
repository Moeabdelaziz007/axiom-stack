'use client';

import { motion } from 'framer-motion';
import { Bot, Activity, CheckCircle } from 'lucide-react';

interface AgentCardProps {
  id: string;
  status: 'idle' | 'active' | 'flagged';
  reputation: number;
  loadFactor: number;
  tasksCompleted: number;
  capabilities: string[];
}

export default function AgentCard({
  id,
  status,
  reputation,
  loadFactor,
  tasksCompleted,
  capabilities
}: AgentCardProps) {
  // Truncate agent ID to first 8 characters
  const truncatedId = id.length > 8 ? `${id.substring(0, 8)}...` : id;
  
  // Determine status dot class
  const getStatusDotClass = () => {
    switch (status) {
      case 'idle': return 'status-idle';
      case 'active': return 'status-active';
      case 'flagged': return 'status-flagged';
      default: return 'status-idle';
    }
  };
  
  // Determine reputation ring color
  const getReputationRingColor = () => {
    if (reputation > 90) return '#10B981'; // green
    if (reputation > 50) return '#F59E0B'; // yellow
    return '#FF003C'; // red
  };
  
  // Calculate stroke dasharray for circular progress
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (reputation / 100) * circumference;
  
  return (
    <motion.div
      className="holographic-panel p-6 h-full hover:border-primary/50 transition-all duration-300"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center">
            <Bot className="w-5 h-5 text-primary mr-2" />
            <h3 className="font-mono text-lg font-bold">{truncatedId}</h3>
          </div>
          <div className="flex items-center mt-1">
            <span className={`status-dot ${getStatusDotClass()} mr-2`}></span>
            <span className="text-sm capitalize">
              {status === 'idle' ? 'Idle' : status === 'active' ? 'Active' : 'Flagged'}
            </span>
          </div>
        </div>
        
        {/* Reputation Score Ring */}
        <div className="relative w-12 h-12">
          <svg className="w-12 h-12" viewBox="0 0 50 50">
            <circle
              cx="25"
              cy="25"
              r={radius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="4"
            />
            <circle
              cx="25"
              cy="25"
              r={radius}
              fill="none"
              stroke={getReputationRingColor()}
              strokeWidth="4"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 25 25)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-mono font-bold">{reputation}</span>
          </div>
        </div>
      </div>
      
      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="glass-panel p-3">
          <div className="flex items-center text-secondary mb-1">
            <Activity className="w-4 h-4 mr-1" />
            <span className="text-xs">Load</span>
          </div>
          <p className="font-mono text-sm">{loadFactor}%</p>
        </div>
        
        <div className="glass-panel p-3">
          <div className="flex items-center text-primary mb-1">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span className="text-xs">Tasks</span>
          </div>
          <p className="font-mono text-sm">{tasksCompleted}</p>
        </div>
      </div>
      
      {/* Capabilities */}
      <div>
        <h4 className="text-xs text-gray-400 mb-2">Capabilities</h4>
        <div className="flex flex-wrap gap-2">
          {capabilities.map((capability, index) => (
            <span 
              key={index} 
              className="glass-panel px-2 py-1 rounded-full text-xs font-mono"
            >
              {capability}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}