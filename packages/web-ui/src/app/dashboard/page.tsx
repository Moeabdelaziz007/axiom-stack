'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import QuantumVisualizer from '@/components/quantum/QuantumVisualizer';
import ResonanceMeter from '@/components/quantum/ResonanceMeter';
import LandauerMeter from '@/components/quantum/LandauerMeter';
import { useAgents } from '@/hooks/useAgents';
import { useStaking } from '@/hooks/useStaking';
import { useTransactions } from '@/hooks/useTransactions';
import { useWallet } from '@/contexts/WalletContext';
import { AixAgent } from '@/lib/aixLoader';
import ThemeSwitcher from '@/components/common/ThemeSwitcher';
import { LayoutDashboard, Users, Wallet, BarChart3, Globe, Zap, Cpu } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'agents' | 'staking' | 'payments' | 'analytics'>('agents');
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AixAgent | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{ status?: string; capabilities?: string[] }>({});

  // Quantum Ether Demo State
  const [quantumActive, setQuantumActive] = useState(false);
  const [resonanceActive, setResonanceActive] = useState(false);
  const [landauerActive, setLandauerActive] = useState(false);
  const [quantumSeed, setQuantumSeed] = useState('');
  const [resonanceData, setResonanceData] = useState({
    photonicLatency: 0.4,
    electronicLatency: 1250,
    speedupFactor: 125,
    energySavings: 92,
    resonanceQuality: 95
  });
  const [landauerData, setLandauerData] = useState({
    totalSteps: 2847,
    reversibleSteps: 2823,
    landauerEfficiency: 99.2,
    entropyWaste: 0.8,
    totalEnergyMicrojoules: 0.000032
  });

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

  import FlexHeader from '@/components/layout/FlexHeader';

  return (
    <div className="min-h-screen animate-fade-in-up">
      <FlexHeader />

      <div className="p-6 pt-24 md:pt-6 space-y-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyber-cyan to-white animate-text-shimmer">
                Command Center
              </h1>
              <p className="text-gray-400 font-rajdhani mt-1">
                Quantum-Enhanced Agent Orchestration
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <ThemeSwitcher />
              <NetworkSelector />
              <WalletButton />
            </div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            {/* Navigation Sidebar (Bento Item 1) */}
            <div className="col-span-1 md:row-span-2 bento-card p-4 flex flex-col gap-2">
              <div className="text-xs font-rajdhani text-gray-500 uppercase tracking-wider mb-2 px-2">Navigation</div>
              {(['agents', 'staking', 'payments', 'analytics'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === tab
                    ? 'bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 shadow-[0_0_15px_rgba(0,255,255,0.1)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {tab === 'agents' && <Users className="w-5 h-5" />}
                  {tab === 'staking' && <Wallet className="w-5 h-5" />}
                  {tab === 'payments' && <Globe className="w-5 h-5" />}
                  {tab === 'analytics' && <BarChart3 className="w-5 h-5" />}
                  <span className="font-orbitron tracking-wide">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                </button>
              ))}

              <div className="mt-auto p-4 rounded-xl bg-black/20 border border-white/5">
                <div className="text-xs text-gray-500 mb-2">System Status</div>
                <div className="flex items-center gap-2 text-green-400 text-sm font-mono">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  ONLINE
                </div>
              </div>
            </div>

            {/* Quick Actions (Bento Item 2) */}
            <div className="col-span-1 md:col-span-3 bento-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-orbitron text-lg text-white">Quick Actions</h3>
                <div className="text-xs font-mono text-cyber-cyan">READY</div>
              </div>
              <QuickActions />
            </div>

            {/* Quantum Ether Interface (Bento Item 3 - Large) */}
            <div className="col-span-1 md:col-span-3 bento-card p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setQuantumActive(!quantumActive);
                    setResonanceActive(!resonanceActive);
                    setLandauerActive(!landauerActive);
                    if (!quantumActive) setQuantumSeed('A3F7B9C2E1D4F8A6C5B4D3E2F1A0B9C8');
                  }}
                  className="p-2 rounded-full bg-white/5 hover:bg-cyber-cyan/20 transition-colors"
                  title="Toggle Quantum Core"
                >
                  <Zap className={`w-5 h-5 ${quantumActive ? 'text-cyber-cyan' : 'text-gray-500'}`} />
                </button>
              </div>

              <h2 className="text-xl font-orbitron font-bold text-white mb-6 flex items-center gap-2">
                <Cpu className="w-6 h-6 text-cyber-cyan" />
                Quantum Ether Interface
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <QuantumVisualizer
                  entropyScore={98}
                  seed={quantumSeed}
                  source="ANU Quantum Vacuum"
                  isActive={quantumActive}
                />
                <ResonanceMeter
                  photonicLatency={resonanceData.photonicLatency}
                  electronicLatency={resonanceData.electronicLatency}
                  speedupFactor={resonanceData.speedupFactor}
                  energySavings={resonanceData.energySavings}
                  resonanceQuality={resonanceData.resonanceQuality}
                  isActive={resonanceActive}
                />
                <LandauerMeter
                  totalSteps={landauerData.totalSteps}
                  reversibleSteps={landauerData.reversibleSteps}
                  landauerEfficiency={landauerData.landauerEfficiency}
                  entropyWaste={landauerData.entropyWaste}
                  totalEnergyMicrojoules={landauerData.totalEnergyMicrojoules}
                  isActive={landauerActive}
                />
              </div>
            </div>
          </div>

          {/* Main Content Area (Dynamic based on Tab) */}
          <div className="mt-6">

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
      </div>
      );
}