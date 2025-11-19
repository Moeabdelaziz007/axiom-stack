// components/AgentCard.tsx
import { useState, useEffect } from 'react';

interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'busy';
  createdAt: string;
  lastActive: string;
  capabilities: string[];
  reputation: number;
  loadFactor: number;
}

interface AgentCardProps {
  agent: Agent;
}

const AgentCard = ({ agent }: AgentCardProps) => {
  // Truncate agent ID to first 8 characters
  const truncatedId = agent.id.length > 8 ? `${agent.id.substring(0, 8)}...` : agent.id;
  
  // Determine reputation color based on new color palette
  const getReputationColor = () => {
    if (agent.reputation > 90) return 'text-axiom-success'; // Matrix Green
    if (agent.reputation > 50) return 'text-axiom-warning'; // Cyber Yellow
    return 'text-axiom-accent'; // Error Red
  };
  
  // Determine status color
  const getStatusColor = () => {
    if (agent.status === 'active') return 'bg-axiom-success';
    if (agent.status === 'busy') return 'bg-axiom-warning';
    return 'bg-gray-500';
  };
  
  // Determine pulse animation based on status
  const getPulseClass = () => {
    if (agent.status === 'active') return 'animate-pulse-slow';
    if (agent.status === 'busy') return 'animate-pulse-fast';
    return '';
  };
  
  return (
    <div className="glass-card rounded-xl p-5 h-full border border-axiom-primary/20 hover:border-axiom-primary/50 transition-all duration-300 bg-axiom-panel/30 backdrop-blur-xl shadow-lg hover:shadow-axiom-primary/20 hover:shadow-xl relative overflow-hidden">
      {/* Holographic Border Effect */}
      <div className="absolute inset-0 rounded-xl pointer-events-none border border-axiom-primary/10"></div>
      <div className="absolute inset-0 rounded-xl pointer-events-none border border-axiom-secondary/5"></div>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center">
            <div className={`w-6 h-6 rounded-lg ${getStatusColor()} ${getPulseClass()} mr-2 flex items-center justify-center`}>
              <span className="text-xs">🤖</span>
            </div>
            <h3 className="font-bold text-lg text-white truncate max-w-[120px]">{agent.name || truncatedId}</h3>
          </div>
          <div className="flex items-center mt-1">
            <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor()} ${getPulseClass()}`}></div>
            <span className="text-xs text-gray-400 capitalize">{agent.status}</span>
          </div>
        </div>
        
        {/* Hexagonal Reputation Display */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="hexagon bg-axiom-dark border-2 border-axiom-primary/30 w-10 h-10 flex items-center justify-center">
              <span className={`text-xs font-bold ${getReputationColor()}`}>
                {Math.round(agent.reputation)}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{agent.description}</p>
      
      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="glass-metric rounded-lg p-3 bg-axiom-panel/50 border border-axiom-primary/10">
          <div className="flex items-center text-gray-400 mb-1">
            <span className="text-xs">Capabilities</span>
          </div>
          <p className="font-mono text-sm text-axiom-primary">{agent.capabilities.length}</p>
        </div>
        
        <div className="glass-metric rounded-lg p-3 bg-axiom-panel/50 border border-axiom-primary/10">
          <div className="flex items-center text-axiom-secondary mb-1">
            <span className="text-xs">Load Factor</span>
          </div>
          <p className="font-mono text-sm text-axiom-warning">
            {agent.loadFactor || 0}%
          </p>
        </div>
      </div>
      
      {/* Capabilities */}
      <div>
        <h4 className="text-xs text-gray-400 mb-2">Capabilities</h4>
        <div className="flex flex-wrap gap-2">
          {agent.capabilities.slice(0, 3).map((capability, index) => (
            <span 
              key={index} 
              className="glass-capability rounded-full px-2 py-1 text-xs text-axiom-primary border border-axiom-primary/20 bg-axiom-panel/50 hover:bg-axiom-primary/10 transition-colors duration-200"
            >
              {capability}
            </span>
          ))}
          {agent.capabilities.length > 3 && (
            <span className="glass-capability rounded-full px-2 py-1 text-xs text-gray-400 border border-gray-500/20 bg-axiom-panel/50">
              +{agent.capabilities.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentCard;