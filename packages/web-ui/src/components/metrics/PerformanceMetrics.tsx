'use client';

import React from 'react';
import { Cpu, Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { useSystemMetrics } from '@/hooks/useSystemMetrics';
import { useAgents } from '@/hooks/useAgents';
import { useTransactions } from '@/hooks/useTransactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  className?: string;
}

function MetricCard({ title, value, icon, trend, subtitle, className }: MetricCardProps) {
  return (
    <Card className={cn('glass-panel border-axiom-cyan/10 bg-black/20 backdrop-blur-xl hover:border-axiom-cyan/30 transition-all duration-300 group', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-bold font-display text-gray-400 uppercase tracking-wider group-hover:text-gray-300 transition-colors">{title}</CardTitle>
        <div className="text-axiom-cyan opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 drop-shadow-[0_0_8px_rgba(0,240,255,0.3)]">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-3">
          <div className="text-3xl font-bold font-mono text-white tracking-tight drop-shadow-lg">{value}</div>
          {trend && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs font-bold px-1.5 py-0.5 rounded',
                trend.isPositive
                  ? 'text-axiom-success bg-axiom-success/10 border border-axiom-success/20'
                  : 'text-axiom-red bg-axiom-red/10 border border-axiom-red/20'
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        {subtitle && <p className="text-[10px] text-gray-500 mt-2 font-mono uppercase tracking-wide">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}

export function PerformanceMetrics() {
  const { cpu, memory, activeAgents, totalTransactions, loading: metricsLoading } = useSystemMetrics();
  const { agents } = useAgents();
  const { transactions } = useTransactions();

  // Calculate trends (mock for now - would come from API)
  const agentTrend = { value: 12, isPositive: true };
  const txnTrend = { value: 8, isPositive: true };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* System Health */}
      <MetricCard
        title="System Health"
        value={metricsLoading ? '...' : `${cpu}%`}
        icon={<Cpu className="w-5 h-5" />}
        subtitle={`Memory: ${memory}%`}
        className="hover:border-axiom-cyan/50 transition-colors"
      />

      {/* Active Agents */}
      <MetricCard
        title="Active Agents"
        value={activeAgents || agents.filter(a => a.status === 'active').length}
        icon={<Users className="w-5 h-5" />}
        trend={agentTrend}
        subtitle="24h change"
        className="hover:border-axiom-purple/50 transition-colors"
      />

      {/* Total Transactions */}
      <MetricCard
        title="Total Transactions"
        value={totalTransactions || transactions.length}
        icon={<DollarSign className="w-5 h-5" />}
        trend={txnTrend}
        subtitle="24h change"
        className="hover:border-axiom-success/50 transition-colors"
      />

      {/* Average ROI */}
      <MetricCard
        title="Average ROI"
        value="+12.4%"
        icon={<TrendingUp className="w-5 h-5" />}
        trend={{ value: 3.2, isPositive: true }}
        subtitle="Last 7 days"
        className="hover:border-axiom-warning/50 transition-colors"
      />
    </div>
  );
}