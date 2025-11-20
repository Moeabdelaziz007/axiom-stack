'use client';

import DashboardLayout from '@/components/DashboardLayout';
import AgentCard from '@/components/AgentCard';

export default function AgentsPage() {
  // Extended sample agent data
  const agents: {
    id: string;
    status: 'active' | 'idle' | 'flagged';
    reputation: number;
    loadFactor: number;
    tasksCompleted: number;
    capabilities: string[];
  }[] = [
      {
        id: 'agent-7b3f9a',
        status: 'active',
        reputation: 96,
        loadFactor: 72,
        tasksCompleted: 1248,
        capabilities: ['web_scraping', 'data_analysis', 'nlp_processing']
      },
      {
        id: 'agent-d4c8e2',
        status: 'idle',
        reputation: 87,
        loadFactor: 0,
        tasksCompleted: 932,
        capabilities: ['image_recognition', 'pattern_matching']
      },
      {
        id: 'agent-a1f5b3',
        status: 'flagged',
        reputation: 42,
        loadFactor: 95,
        tasksCompleted: 567,
        capabilities: ['api_integration', 'database_queries', 'security_audit']
      },
      {
        id: 'agent-9e6c27',
        status: 'active',
        reputation: 93,
        loadFactor: 68,
        tasksCompleted: 2105,
        capabilities: ['natural_language', 'sentiment_analysis', 'translation']
      },
      {
        id: 'agent-3d8a4f',
        status: 'idle',
        reputation: 91,
        loadFactor: 0,
        tasksCompleted: 789,
        capabilities: ['audio_processing', 'speech_recognition']
      },
      {
        id: 'agent-c5b2e1',
        status: 'active',
        reputation: 88,
        loadFactor: 45,
        tasksCompleted: 1654,
        capabilities: ['video_analysis', 'object_detection']
      },
      {
        id: 'agent-f8d3a7',
        status: 'idle',
        reputation: 94,
        loadFactor: 0,
        tasksCompleted: 876,
        capabilities: ['financial_analysis', 'risk_assessment']
      },
      {
        id: 'agent-6e9b24',
        status: 'active',
        reputation: 89,
        loadFactor: 63,
        tasksCompleted: 1432,
        capabilities: ['content_generation', 'copywriting', 'seo_optimization']
      },
      {
        id: 'agent-1c7a5f',
        status: 'flagged',
        reputation: 38,
        loadFactor: 98,
        tasksCompleted: 321,
        capabilities: ['network_monitoring', 'intrusion_detection']
      }
    ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Agent Fleet</h1>
            <p className="text-gray-400">Manage and monitor your AI agents</p>
          </div>
          <div className="flex space-x-4">
            <div className="glass-panel px-4 py-2">
              <div className="text-xs text-gray-400">Total Agents</div>
              <div className="text-xl font-mono font-bold">24</div>
            </div>
            <div className="glass-panel px-4 py-2">
              <div className="text-xs text-gray-400">Active</div>
              <div className="text-xl font-mono font-bold text-axiom-cyan">12</div>
            </div>
            <div className="glass-panel px-4 py-2">
              <div className="text-xs text-gray-400">Flagged</div>
              <div className="text-xl font-mono font-bold text-axiom-red">3</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent, index) => (
          <AgentCard
            key={index}
            id={agent.id}
            status={agent.status}
            reputation={agent.reputation}
            loadFactor={agent.loadFactor}
            tasksCompleted={agent.tasksCompleted}
            capabilities={agent.capabilities}
          />
        ))}
      </div>
    </DashboardLayout>
  );
}