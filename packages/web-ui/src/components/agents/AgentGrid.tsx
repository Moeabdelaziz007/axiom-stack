import { MockAgent } from '@/lib/solana';
import { AixAgent } from '@/lib/aixLoader';
import { AgentCard } from './AgentCard';

interface AgentGridProps {
  agents: AixAgent[];
  onAgentClick: (agent: AixAgent) => void;
}

export function AgentGrid({ agents, onAgentClick }: AgentGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {agents.map((agent) => (
        <AgentCard 
          key={agent.id} 
          agent={agent} 
          onClick={() => onAgentClick(agent)} 
        />
      ))}
    </div>
  );
}