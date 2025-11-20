import type { Agent, NetworkStats } from '../types/agent';

export const mockAgents: Agent[] = [
  {
    id: 'Agent-7A3F',
    status: 'active',
    reputation: 92,
    loadFactor: 78,
    tasksCompleted: 1247,
    capabilities: ['NLP', 'Vision', 'Code'],
    lastActive: new Date(),
    region: 'US-West',
    uptime: 168
  },
  {
    id: 'Agent-B2E9',
    status: 'idle',
    reputation: 88,
    loadFactor: 23,
    tasksCompleted: 892,
    capabilities: ['Data Analysis', 'ML', 'API'],
    lastActive: new Date(Date.now() - 300000),
    region: 'EU-Central',
    uptime: 142
  },
  {
    id: 'Agent-C5D1',
    status: 'active',
    reputation: 95,
    loadFactor: 91,
    tasksCompleted: 2103,
    capabilities: ['Blockchain', 'Smart Contracts', 'Security'],
    lastActive: new Date(),
    region: 'Asia-Pacific',
    uptime: 201
  },
  {
    id: 'Agent-D8F4',
    status: 'flagged',
    reputation: 45,
    loadFactor: 12,
    tasksCompleted: 234,
    capabilities: ['Web Scraping', 'Data Mining'],
    lastActive: new Date(Date.now() - 3600000),
    region: 'US-East',
    uptime: 48
  },
  {
    id: 'Agent-E1A7',
    status: 'active',
    reputation: 87,
    loadFactor: 65,
    tasksCompleted: 1456,
    capabilities: ['Image Processing', 'OCR', 'Vision'],
    lastActive: new Date(),
    region: 'EU-West',
    uptime: 189
  },
  {
    id: 'Agent-F9C2',
    status: 'idle',
    reputation: 91,
    loadFactor: 15,
    tasksCompleted: 1678,
    capabilities: ['NLP', 'Translation', 'Sentiment'],
    lastActive: new Date(Date.now() - 600000),
    region: 'US-Central',
    uptime: 156
  },
  {
    id: 'Agent-G3B8',
    status: 'active',
    reputation: 89,
    loadFactor: 82,
    tasksCompleted: 1834,
    capabilities: ['Audio Processing', 'Speech', 'TTS'],
    lastActive: new Date(),
    region: 'Asia-East',
    uptime: 178
  },
  {
    id: 'Agent-H6D5',
    status: 'active',
    reputation: 93,
    loadFactor: 88,
    tasksCompleted: 2245,
    capabilities: ['Code Generation', 'Debugging', 'Testing'],
    lastActive: new Date(),
    region: 'EU-North',
    uptime: 215
  },
  {
    id: 'Agent-I2E1',
    status: 'idle',
    reputation: 85,
    loadFactor: 8,
    tasksCompleted: 967,
    capabilities: ['Database', 'SQL', 'NoSQL'],
    lastActive: new Date(Date.now() - 900000),
    region: 'US-South',
    uptime: 134
  },
  {
    id: 'Agent-J7F3',
    status: 'active',
    reputation: 90,
    loadFactor: 73,
    tasksCompleted: 1589,
    capabilities: ['DevOps', 'CI/CD', 'Monitoring'],
    lastActive: new Date(),
    region: 'EU-South',
    uptime: 167
  },
  {
    id: 'Agent-K4A9',
    status: 'active',
    reputation: 94,
    loadFactor: 85,
    tasksCompleted: 2012,
    capabilities: ['Security', 'Penetration Testing', 'Audit'],
    lastActive: new Date(),
    region: 'Asia-South',
    uptime: 198
  },
  {
    id: 'Agent-L8C6',
    status: 'idle',
    reputation: 86,
    loadFactor: 19,
    tasksCompleted: 1123,
    capabilities: ['UI/UX', 'Design', 'Prototyping'],
    lastActive: new Date(Date.now() - 450000),
    region: 'US-West',
    uptime: 145
  }
];

export const networkStats: NetworkStats = {
  totalAgents: mockAgents.length,
  activeAgents: mockAgents.filter(a => a.status === 'active').length,
  idleAgents: mockAgents.filter(a => a.status === 'idle').length,
  flaggedAgents: mockAgents.filter(a => a.status === 'flagged').length,
  averageReputation: Math.round(mockAgents.reduce((sum, a) => sum + a.reputation, 0) / mockAgents.length),
  totalTasksCompleted: mockAgents.reduce((sum, a) => sum + a.tasksCompleted, 0),
  networkHealth: 94
};
