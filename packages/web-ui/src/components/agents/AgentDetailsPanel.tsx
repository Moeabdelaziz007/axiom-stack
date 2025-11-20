'use client';

import React from 'react';
import { X, Calendar, Activity, Hash } from 'lucide-react';
import { MockAgent } from '@/lib/solana';

interface AgentDetailsPanelProps {
  agent: MockAgent;
  onClose: () => void;
}

export function AgentDetailsPanel({ agent, onClose }: AgentDetailsPanelProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-axiom-success';
      case 'paused': return 'bg-axiom-warning';
      case 'inactive': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-axiom-dark-lighter rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">{agent.name}</h2>
              <div className="flex items-center mt-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)} mr-2`}></div>
                <span className="text-gray-300 capitalize">{agent.status}</span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Description</h3>
              <p className="text-gray-300">{agent.description}</p>
            </div>

            {/* Capabilities */}
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Capabilities</h3>
              <div className="flex flex-wrap gap-2">
                {agent.capabilities.map((capability) => (
                  <span 
                    key={capability} 
                    className="px-3 py-1 bg-axiom-purple/20 text-axiom-purple rounded-full text-sm"
                  >
                    {capability}
                  </span>
                ))}
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-panel p-4 rounded-lg">
                <div className="flex items-center text-gray-400 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">Created</span>
                </div>
                <p className="text-white">{formatDate(agent.createdAt)}</p>
              </div>

              <div className="glass-panel p-4 rounded-lg">
                <div className="flex items-center text-gray-400 mb-2">
                  <Activity className="w-4 h-4 mr-2" />
                  <span className="text-sm">Last Active</span>
                </div>
                <p className="text-white">{formatDate(agent.lastActive)}</p>
              </div>

              <div className="glass-panel p-4 rounded-lg">
                <div className="flex items-center text-gray-400 mb-2">
                  <Hash className="w-4 h-4 mr-2" />
                  <span className="text-sm">Agent ID</span>
                </div>
                <p className="text-white font-mono text-sm">{agent.id}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}