'use client';

import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';

interface AgentFilterProps {
  onFilterChange: (filters: {
    status?: string;
    capabilities?: string[];
  }) => void;
}

export function AgentFilters({ onFilterChange }: AgentFilterProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [capabilityFilters, setCapabilityFilters] = useState<string[]>([]);

  const statuses = ['active', 'inactive', 'paused'];
  const capabilities = ['data-analysis', 'pattern-recognition', 'reporting', 'content-generation', 'seo', 'social-media', 'natural-language', 'ticket-management', 'knowledge-base', 'financial-analysis', 'risk-assessment', 'portfolio-management', 'threat-detection', 'intrusion-prevention', 'compliance'];

  const applyFilters = () => {
    onFilterChange({
      status: statusFilter || undefined,
      capabilities: capabilityFilters.length > 0 ? capabilityFilters : undefined,
    });
  };

  const clearFilters = () => {
    setStatusFilter('');
    setCapabilityFilters([]);
    onFilterChange({});
  };

  const toggleCapability = (capability: string) => {
    setCapabilityFilters(prev => 
      prev.includes(capability)
        ? prev.filter(c => c !== capability)
        : [...prev, capability]
    );
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 px-4 py-2 bg-axiom-dark-lighter text-white rounded-lg hover:bg-axiom-purple/20 transition-colors"
      >
        <Filter className="w-4 h-4" />
        Filters
      </button>

      {showFilters && (
        <div className="mt-4 p-4 glass-panel rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-white">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-axiom-cyan hover:text-axiom-cyan/80"
            >
              Clear all
            </button>
          </div>

          <div className="space-y-6">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                {statuses.map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(statusFilter === status ? '' : status)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      statusFilter === status
                        ? 'bg-axiom-cyan text-axiom-dark'
                        : 'bg-axiom-dark-lighter text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Capabilities Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Capabilities
              </label>
              <div className="flex flex-wrap gap-2">
                {capabilities.map(capability => (
                  <button
                    key={capability}
                    onClick={() => toggleCapability(capability)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      capabilityFilters.includes(capability)
                        ? 'bg-axiom-purple text-white'
                        : 'bg-axiom-dark-lighter text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {capability}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  applyFilters();
                  setShowFilters(false);
                }}
                className="px-4 py-2 bg-axiom-cyan text-axiom-dark rounded-lg hover:bg-cyan-300"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}