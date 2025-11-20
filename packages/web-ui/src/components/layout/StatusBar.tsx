'use client';

import { Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import type { NetworkStats } from '@/types/agent';

interface StatusBarProps {
  stats: NetworkStats;
}

export function StatusBar({ stats }: StatusBarProps) {
  return (
    <div className="glass-panel px-6 py-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-axiom-cyan" />
            <span className="text-sm font-medium">Network Health</span>
            <span className="text-lg font-bold font-mono text-axiom-cyan">{stats.networkHealth}%</span>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-400">{stats.activeAgents} Active</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-gray-400">{stats.idleAgents} Idle</span>
          </div>

          {stats.flaggedAgents > 0 && (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-axiom-red" />
              <span className="text-sm text-gray-400">{stats.flaggedAgents} Flagged</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs text-gray-400">Total Agents</div>
            <div className="text-lg font-bold font-mono">{stats.totalAgents}</div>
          </div>

          <div className="text-right">
            <div className="text-xs text-gray-400">Avg Reputation</div>
            <div className="text-lg font-bold font-mono text-axiom-purple">{stats.averageReputation}%</div>
          </div>

          <div className="text-right">
            <div className="text-xs text-gray-400">Tasks Completed</div>
            <div className="text-lg font-bold font-mono">{stats.totalTasksCompleted.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}