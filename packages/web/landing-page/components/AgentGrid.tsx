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
      <div className="command-deck bg-axiom-dark p-6 rounded-2xl border border-axiom-primary/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-axiom-primary">Quantum Command Deck</h2>
          <div className="text-axiom-secondary">Initializing Agents...</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="glass-card rounded-xl p-5 h-64 animate-pulse border border-axiom-primary/20 bg-axiom-panel/30">
              <div className="bg-axiom-panel rounded-full h-6 w-3/4 mb-4"></div>
              <div className="bg-axiom-panel rounded h-4 w-full mb-2"></div>
              <div className="bg-axiom-panel rounded h-4 w-5/6 mb-4"></div>
              <div className="flex space-x-2">
                <div className="bg-axiom-panel rounded-full h-6 w-16"></div>
                <div className="bg-axiom-panel rounded-full h-6 w-16"></div>
                <div className="bg-axiom-panel rounded-full h-6 w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="command-deck glass-card rounded-2xl p-8 text-center border border-axiom-accent/30 bg-axiom-panel/30">
        <div className="text-axiom-accent mb-4 text-2xl">⚠️ SYSTEM ALERT</div>
        <div className="text-red-400 mb-4">Error loading agents</div>
        <div className="text-gray-300 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="cyber-button rounded-full px-6 py-3 text-sm font-medium text-axiom-primary border border-axiom-primary/50 hover:bg-axiom-primary/10 transition-colors duration-300"
        >
          RETRY CONNECTION
        </button>
      </div>
    );
  }

  return (
    <div className="command-deck bg-axiom-dark p-6 rounded-2xl border border-axiom-primary/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-axiom-primary animate-slide-in-left">Quantum Command Deck</h2>
        <div className="text-axiom-secondary animate-slide-in-right">
          <span className="text-axiom-success">●</span> {agents.length} Agents Active
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {agents.map((agent, index) => (
          <div 
            key={agent.id} 
            className="animate-slide-in-top"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <AgentCard agent={agent} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentGrid;