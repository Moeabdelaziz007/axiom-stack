'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FixedSizeList } from 'react-window';
import { format } from 'date-fns';
import { Terminal, Download, Filter, X } from 'lucide-react';
import { useDecisionLogs, type DecisionLog } from '@/hooks/useDecisionLogs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LiveTerminalProps {
  className?: string;
  height?: number;
}

export function LiveTerminal({ className, height = 400 }: LiveTerminalProps) {
  const { logs, loading, error } = useDecisionLogs(200);
  const [autoScroll, setAutoScroll] = useState(true);
  const [filterLevel, setFilterLevel] = useState<DecisionLog['level'] | 'ALL'>('ALL');
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

  const getLevelColor = (level: DecisionLog['level']) => {
    switch (level) {
      case 'ERROR':
        return 'text-axiom-red';
      case 'WARN':
        return 'text-axiom-warning';
      case 'INFO':
        return 'text-axiom-cyan';
      case 'DEBUG':
        return 'text-gray-500';
      default:
        return 'text-gray-400';
    }
  };

  const getLevelBg = (level: DecisionLog['level']) => {
    switch (level) {
      case 'ERROR':
        return 'bg-axiom-red/10';
      case 'WARN':
        return 'bg-axiom-warning/10';
      case 'INFO':
        return 'bg-axiom-cyan/10';
      case 'DEBUG':
        return 'bg-gray-500/10';
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

  const LogRow = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const log = filteredLogs[index];
    if (!log) return null;

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
          <span className={cn('text-xs font-bold w-12', getLevelColor(log.level))}>
            {log.level}
          </span>
          <span className="text-gray-300 flex-1">{log.message}</span>
          {log.agentId && (
            <span className="text-axiom-purple text-xs">
              {log.agentId.substring(0, 8)}...
            </span>
          )}
        </div>
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
            {(['ALL', 'ERROR', 'WARN', 'INFO', 'DEBUG'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setFilterLevel(level)}
                className={cn(
                  'px-2 py-1 text-xs font-mono rounded transition-colors',
                  filterLevel === level
                    ? 'bg-axiom-cyan text-black'
                    : 'text-gray-400 hover:text-white'
                )}
              >
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