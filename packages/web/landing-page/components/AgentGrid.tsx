// components/AgentGrid.tsx
import { useState, useEffect } from 'react';
import AgentCard from './AgentCard';

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

const AgentGrid = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch agents from the API
    const fetchAgents = async () => {
      try {
        setLoading(true);
        // Use the web API service URL for agents data
        const response = await fetch('https://www.axiomid.app/api/agents');
        if (!response.ok) {
          throw new Error(`Failed to fetch agents: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setAgents(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching agents:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch agents');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="glass-strong rounded-2xl p-6 h-64 animate-pulse">
            <div className="bg-gray-700 rounded-full h-6 w-3/4 mb-4"></div>
            <div className="bg-gray-700 rounded h-4 w-full mb-2"></div>
            <div className="bg-gray-700 rounded h-4 w-5/6 mb-4"></div>
            <div className="flex space-x-2">
              <div className="bg-gray-700 rounded-full h-6 w-16"></div>
              <div className="bg-gray-700 rounded-full h-6 w-16"></div>
              <div className="bg-gray-700 rounded-full h-6 w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-strong rounded-2xl p-8 text-center">
        <div className="text-red-400 mb-4">⚠️ Error loading agents</div>
        <div className="text-gray-300 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="glass rounded-full px-4 py-2 text-sm font-medium text-blue-300 border border-blue-500/30 hover:bg-blue-500/10 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
};

export default AgentGrid;