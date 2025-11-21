'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FixedSizeList } from 'react-window';
import { format } from 'date-fns';
import { Terminal, Download, Filter, X, Brain, ChevronDown, ChevronRight } from 'lucide-react';
import { useDecisionLogs, type DecisionLog } from '@/hooks/useDecisionLogs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LiveTerminalProps {
  className?: string;
  height?: number;
}

// Extended DecisionLog type to include THOUGHT level
type ExtendedDecisionLog = DecisionLog & {
  level: DecisionLog['level'] | 'THOUGHT';
  reasoning?: string; // For THOUGHT logs
};

export function LiveTerminal({ className, height = 400 }: LiveTerminalProps) {
  const { logs, loading, error } = useDecisionLogs(200);
  const [autoScroll, setAutoScroll] = useState(true);
  const [filterLevel, setFilterLevel] = useState<ExtendedDecisionLog['level'] | 'ALL'>('ALL');
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const listRef = useRef<FixedSizeList>(null);

  // Auto-scroll to top when new logs arrive
  useEffect(() => {
    if (autoScroll && listRef.current) {
      listRef.current.scrollToItem(0);
    }
  }, [logs, autoScroll]);

  const filteredLogs = filterLevel === 'ALL'
    ? logs
    : logs.filter(log => log.level === filterLevel);

  const getLevelColor = (level: ExtendedDecisionLog['level']) => {
    switch (level) {
      case 'ERROR':
        return 'text-axiom-red';
      case 'WARN':
        return 'text-axiom-warning';
      case 'INFO':
        return 'text-axiom-cyan';
      case 'DEBUG':
        return 'text-gray-500';
      case 'THOUGHT':
        return 'text-purple-500'; // Neon Purple for reasoning
      default:
        return 'text-gray-400';
    }
  };

  const getLevelBg = (level: ExtendedDecisionLog['level']) => {
    switch (level) {
      case 'ERROR':
        return 'bg-axiom-red/10';
      case 'WARN':
        return 'bg-axiom-warning/10';
      case 'INFO':
        return 'bg-axiom-cyan/10';
      case 'DEBUG':
        return 'bg-gray-500/10';
      case 'THOUGHT':
        return 'bg-purple-500/10'; // Purple glow for reasoning
      default:
        return 'bg-gray-400/10';
    }
  };

  const exportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `axiom-logs-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleExpandLog = (logId: string) => {
    setExpandedLogs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(logId)) {
        newSet.delete(logId);
      } else {
        newSet.add(logId);
      }
      return newSet;
    });
  };

  const LogRow = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const log = filteredLogs[index] as ExtendedDecisionLog;
    if (!log) return null;

    const isThought = log.level === 'THOUGHT';
    const isExpanded = expandedLogs.has(log.id);
    const hasReasoning = isThought && log.reasoning;

    return (
      <div
        style={style}
        className={cn(
          'px-4 py-2 font-mono text-sm border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors',
          getLevelBg(log.level)
        )}
      >
        <div className="flex items-start gap-3">
          <span className="text-gray-500 text-xs whitespace-nowrap">
            {format(new Date(log.timestamp), 'HH:mm:ss')}
          </span>

          {/* Level badge with special icon for THOUGHT */}
          <span className={cn('text-xs font-bold w-12 flex items-center gap-1', getLevelColor(log.level))}>
            {isThought && <Brain className="w-3 h-3" />}
            {log.level}
          </span>

          <span className="text-gray-300 flex-1">{log.message}</span>

          {log.agentId && (
            <span className="text-axiom-purple text-xs">
              {log.agentId.substring(0, 8)}...
            </span>
          )}

          {/* Expand/Collapse button for THOUGHT logs */}
          {hasReasoning && (
            <button
              onClick={() => toggleExpandLog(log.id)}
              className="text-purple-500 hover:text-purple-400 transition-colors"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Collapsible reasoning section */}
        {hasReasoning && isExpanded && (
          <div className="mt-2 ml-20 p-3 bg-purple-950/30 border border-purple-500/30 rounded-lg">
            <div className="text-xs text-purple-300 whitespace-pre-wrap">
              {log.reasoning}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn('glass-panel rounded-xl overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-axiom-cyan" />
          <h3 className="font-semibold text-white">Live Terminal</h3>
          <div className={cn(
            'w-2 h-2 rounded-full',
            loading ? 'bg-axiom-warning animate-pulse' : 'bg-axiom-success'
          )} />
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Buttons */}
          <div className="flex items-center gap-1 bg-gray-800/50 rounded-lg p-1">
            {(['ALL', 'ERROR', 'WARN', 'INFO', 'DEBUG', 'THOUGHT'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setFilterLevel(level)}
                className={cn(
                  'px-2 py-1 text-xs font-mono rounded transition-colors flex items-center gap-1',
                  filterLevel === level
                    ? level === 'THOUGHT' ? 'bg-purple-500 text-white' : 'bg-axiom-cyan text-black'
                    : 'text-gray-400 hover:text-white'
                )}
              >
                {level === 'THOUGHT' && <Brain className="w-3 h-3" />}
                {level}
              </button>
            ))}
          </div>

          {/* Auto-scroll Toggle */}
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={cn(
              'px-3 py-1 text-xs font-mono rounded transition-colors',
              autoScroll
                ? 'bg-axiom-success/20 text-axiom-success'
                : 'bg-gray-800/50 text-gray-400'
            )}
          >
            Auto-scroll {autoScroll ? '●' : '○'}
          </button>

          {/* Export Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={exportLogs}
            className="text-gray-400 hover:text-white"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="bg-black/50">
        {error ? (
          <div className="p-8 text-center">
            <p className="text-axiom-red">Failed to load logs: {error.message}</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No logs to display</p>
          </div>
        ) : (
          <FixedSizeList
            ref={listRef}
            height={height}
            itemCount={filteredLogs.length}
            itemSize={60}
            width="100%"
          >
            {LogRow}
          </FixedSizeList>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-800/50 bg-gray-900/50">
        <span className="text-xs text-gray-500 font-mono">
          {filteredLogs.length} log{filteredLogs.length !== 1 ? 's' : ''}
        </span>
        <span className="text-xs text-gray-500">
          Filter: {filterLevel}
        </span>
      </div>
    </div>
  );
}