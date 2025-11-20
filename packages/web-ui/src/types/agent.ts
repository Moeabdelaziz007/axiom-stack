export type AgentStatus = 'idle' | 'active' | 'flagged';

export interface Agent {
  id: string;
  status: AgentStatus;
  reputation: number;
  loadFactor: number;
  tasksCompleted: number;
  capabilities: string[];
  lastActive: Date;
  region?: string;
  uptime?: number;
}

export interface NetworkStats {
  totalAgents: number;
  activeAgents: number;
  idleAgents: number;
  flaggedAgents: number;
  averageReputation: number;
  totalTasksCompleted: number;
  networkHealth: number;
}
