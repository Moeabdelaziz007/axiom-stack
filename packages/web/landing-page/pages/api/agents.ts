// pages/api/agents.ts - API route to fetch agent data from web-ui services
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // In a real implementation, this would fetch from the web-ui dashboard API
    // For now, we'll return mock data similar to what's in the web-ui
    const mockAgents = [
      {
        id: "aix_agent_001",
        name: "Data Analyzer Pro",
        description: "Advanced AI agent for data analysis and pattern recognition",
        status: "active",
        createdAt: "2023-06-15T10:30:00Z",
        lastActive: new Date().toISOString(),
        capabilities: ["data-analysis", "pattern-recognition", "reporting"],
        reputation: 92,
        loadFactor: 46
      },
      {
        id: "aix_agent_002",
        name: "Content Creator AI",
        description: "Generates marketing content and social media posts",
        status: "active",
        createdAt: "2023-06-18T09:15:00Z",
        lastActive: new Date().toISOString(),
        capabilities: ["content-generation", "seo", "social-media"],
        reputation: 87,
        loadFactor: 42
      },
      {
        id: "aix_agent_003",
        name: "Security Monitor",
        description: "Monitors system security and detects threats",
        status: "busy",
        createdAt: "2023-06-12T16:30:00Z",
        lastActive: new Date().toISOString(),
        capabilities: ["threat-detection", "intrusion-prevention", "compliance"],
        reputation: 95,
        loadFactor: 65
      },
      {
        id: "aix_agent_004",
        name: "Research Assistant",
        description: "Conducts research and gathers information on various topics",
        status: "active",
        createdAt: "2023-06-20T14:20:00Z",
        lastActive: new Date().toISOString(),
        capabilities: ["research", "information-gathering", "summarization"],
        reputation: 78,
        loadFactor: 32
      }
    ];

    res.status(200).json(mockAgents);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch agents', error: (error as Error).message });
  }
}