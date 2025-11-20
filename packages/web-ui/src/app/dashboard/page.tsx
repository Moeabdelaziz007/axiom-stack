'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AgentGrid } from '@/components/agents/AgentGrid';
import { AgentSearch } from '@/components/agents/AgentSearch';
import { AgentFilters } from '@/components/agents/AgentFilters';
import { CreateAgentDialog } from '@/components/agents/CreateAgentDialog';
import { AgentDetailsPanel } from '@/components/agents/AgentDetailsPanel';
import { StakingDashboard } from '@/components/staking/StakingDashboard';
import { StakingChart } from '@/components/staking/StakingChart';
import { RewardsPanel } from '@/components/staking/RewardsPanel';
import { ReputationChart } from '@/components/reputation/ReputationChart';
import { AttestationsList } from '@/components/reputation/AttestationsList';
import { PaymentDialog } from '@/components/payments/PaymentDialog';
import { TransactionHistory } from '@/components/payments/TransactionHistory';
import { WalletButton } from '@/components/wallet/WalletButton';
import { NetworkSelector } from '@/components/wallet/NetworkSelector';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { PerformanceMetrics } from '@/components/metrics/PerformanceMetrics';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { LiveTerminal } from '@/components/terminal/LiveTerminal';
import { useAgents } from '@/hooks/useAgents';
import { useStaking } from '@/hooks/useStaking';
import { useTransactions } from '@/hooks/useTransactions';
import { useWallet } from '@/contexts/WalletContext';
import { AixAgent } from '@/lib/aixLoader';

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'agents' | 'staking' | 'payments' | 'analytics'>('agents');
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AixAgent | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{ status?: string; capabilities?: string[] }>({});

  const { agents, loading: agentsLoading, error: agentsError, createAgent } = useAgents();
  const { stakingInfo, loading: stakingLoading, error: stakingError, stakeTokens, unstakeTokens, claimRewards } = useStaking();
  const { transactions, loading: transactionsLoading, error: transactionsError, sendPayment } = useTransactions();
  const { status: walletStatus } = useWallet();

  // Filter agents based on search and filters
  const filteredAgents = agents.filter(agent => {
    // Search filter
    if (searchQuery && 
        !agent.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !agent.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Status filter
    if (filters.status && agent.status !== filters.status) {
      return false;
    }
    
    // Capabilities filter
    if (filters.capabilities && filters.capabilities.length > 0) {
      const hasCapability = filters.capabilities.some(cap => agent.capabilities.includes(cap));
      if (!hasCapability) return false;
    }
    
    return true;
  });

  const handleAgentClick = (agent: AixAgent) => {
    setSelectedAgent(agent);
  };

  const handleCreateAgent = async (agentData: Omit<AixAgent, 'id' | 'createdAt' | 'lastActive'>) => {
    await createAgent(agentData);
  };

  const handleStake = async (amount: number) => {
    await stakeTokens(amount);
  };

  const handleUnstake = async (amount: number) => {
    await unstakeTokens(amount);
  };

  const handleClaimRewards = async () => {
    await claimRewards();
  };

  const handleSendPayment = async (to: string, amount: number) => {
    await sendPayment(to, amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Axiom Command Center</h1>
            <p className="text-gray-400">Manage your AI agents and staking portfolio</p>
          </div>
          <div className="flex items-center gap-4">
            <NetworkSelector />
            <WalletButton />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-800">
          {(['agents', 'staking', 'payments', 'analytics'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                activeTab === tab
                  ? 'bg-axiom-dark-lighter text-axiom-cyan border-b-2 border-axiom-cyan'
                  : 'text-gray-400 hover:text-white hover:bg-axiom-dark-lighter'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Performance Metrics */}
        <PerformanceMetrics />

        {/* Quick Actions */}
        <QuickActions />

        {/* Agents Tab */}
        {activeTab === 'agents' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <AgentSearch onSearch={setSearchQuery} />
              <AgentFilters onFilterChange={setFilters} />
              <button
                onClick={() => setShowCreateAgent(true)}
                className="px-4 py-2 bg-axiom-cyan text-axiom-dark rounded-lg hover:bg-cyan-300 font-medium"
              >
                Create Agent
              </button>
            </div>

            {agentsLoading ? (
              <LoadingSkeleton type="list" count={6} />
            ) : agentsError ? (
              <EmptyState
                title="Error Loading Agents"
                description="There was an error loading your agents. Please try again later."
                icon="alert"
              />
            ) : filteredAgents.length === 0 ? (
              <EmptyState
                title="No Agents Found"
                description="You don't have any agents yet. Create your first agent to get started."
                icon="users"
                action={{
                  label: "Create Agent",
                  onClick: () => setShowCreateAgent(true)
                }}
              />
            ) : (
              <>
                <AgentGrid agents={filteredAgents} onAgentClick={handleAgentClick} />
                
                {/* Live Terminal */}
                <LiveTerminal height={400} />
              </>
            )}
          </div>
        )}

        {/* Staking Tab */}
        {activeTab === 'staking' && (
          <div className="space-y-6">
            <StakingDashboard
              stakingInfo={stakingInfo}
              loading={stakingLoading}
              onStake={handleStake}
              onUnstake={handleUnstake}
              onClaimRewards={handleClaimRewards}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StakingChart />
              <RewardsPanel />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ReputationChart />
              <AttestationsList />
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => setShowPaymentDialog(true)}
                className="px-4 py-2 bg-axiom-cyan text-axiom-dark rounded-lg hover:bg-cyan-300 font-medium flex items-center gap-2"
              >
                Send Payment
              </button>
            </div>
            
            <TransactionHistory transactions={transactions} loading={transactionsLoading} />
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StakingChart />
              <ReputationChart />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RewardsPanel />
              <AttestationsList />
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateAgentDialog
        isOpen={showCreateAgent}
        onClose={() => setShowCreateAgent(false)}
        onCreate={handleCreateAgent}
      />
      
      <PaymentDialog
        isOpen={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        onSendPayment={handleSendPayment}
      />
      
      {selectedAgent && (
        <AgentDetailsPanel
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </DashboardLayout>
  );
}