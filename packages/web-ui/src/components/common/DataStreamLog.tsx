'use client';

import React from 'react';

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  level: 'info' | 'success' | 'warning' | 'error';
}

interface DataStreamLogProps {
  entries: LogEntry[];
  maxHeight?: string;
}

/**
 * DataStreamLog - Digital data stream with glitch effect on latest entry
 * Implements the vertical scrolling digital feed aesthetic
 */
export const DataStreamLog: React.FC<DataStreamLogProps> = ({ 
  entries, 
  maxHeight = '300px' 
}) => {
  return (
    <div 
      className="data-stream overflow-y-auto pr-2" 
      style={{ maxHeight }}
    >
      {entries.map((entry, index) => (
        <div
          key={entry.id}
          className={`data-stream-entry ${index === 0 ? 'latest' : ''}`}
        >
          <div className="flex items-start gap-3">
            <span className="text-xs text-gray-500 font-mono min-w-[70px] shrink-0">
              {entry.timestamp}
            </span>
            <span className={`flex-1 ${
              entry.level === 'success' ? 'text-axiom-success' :
              entry.level === 'warning' ? 'text-axiom-warning' :
              entry.level === 'error' ? 'text-axiom-red' :
              'text-white/80'
            }`}>
              {entry.message}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataStreamLog;