// Agents hook for the Axiom Command Center

import { useState, useEffect, useCallback } from 'react';
import { MockAgent } from '@/lib/solana';
import { getMockAgents, createMockAgent, updateMockAgent, deleteMockAgent } from '@/lib/api/mockServices';
import { useToast } from '@/components/common/Toast';
import { AixAgent } from '@/lib/aixLoader';

export const useAgents = () => {
  const [agents, setAgents] = useState<AixAgent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const fetchAgents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMockAgents();
      setAgents(data as AixAgent[]);
      setError(null);
    } catch (err) {
      setError('Failed to fetch agents');
      addToast('Failed to fetch agents', 'error');
      console.error('Error fetching agents:', err);
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const createAgent = async (agentData: Omit<AixAgent, 'id' | 'createdAt' | 'lastActive'>) => {
    try {
      // Convert AixAgent data to MockAgent data for the mock service
      const mockAgentData: Omit<MockAgent, 'id' | 'createdAt' | 'lastActive'> = {
        name: agentData.name,
        description: agentData.description,
        status: agentData.status,
        capabilities: agentData.capabilities,
      };
      
      const newAgent = await createMockAgent(mockAgentData);
      setAgents(prev => [...prev, newAgent as AixAgent]);
      addToast('Agent created successfully', 'success');
      return newAgent;
    } catch (err) {
      addToast('Failed to create agent', 'error');
      console.error('Error creating agent:', err);
      throw err;
    }
  };

  const updateAgent = async (id: string, updates: Partial<AixAgent>) => {
    try {
      // Convert AixAgent updates to MockAgent updates for the mock service
      const mockUpdates: Partial<MockAgent> = {
        name: updates.name,
        description: updates.description,
        status: updates.status,
        capabilities: updates.capabilities,
      };
      
      const updatedAgent = await updateMockAgent(id, mockUpdates);
      if (updatedAgent) {
        setAgents(prev => prev.map(agent => agent.id === id ? updatedAgent as AixAgent : agent));
        addToast('Agent updated successfully', 'success');
        return updatedAgent;
      } else {
        throw new Error('Agent not found');
      }
    } catch (err) {
      addToast('Failed to update agent', 'error');
      console.error('Error updating agent:', err);
      throw err;
    }
  };

  const deleteAgent = async (id: string) => {
    try {
      const success = await deleteMockAgent(id);
      if (success) {
        setAgents(prev => prev.filter(agent => agent.id !== id));
        addToast('Agent deleted successfully', 'success');
      } else {
        throw new Error('Agent not found');
      }
    } catch (err) {
      addToast('Failed to delete agent', 'error');
      console.error('Error deleting agent:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  return {
    agents,
    loading,
    error,
    fetchAgents,
    createAgent,
    updateAgent,
    deleteAgent,
  };
};