'use client';

import React from 'react';
import { Activity } from 'lucide-react';

interface ActivityEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface ActivityFeedProps {
  activities: ActivityEntry[];
  maxHeight?: string;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  activities, 
  maxHeight = '400px' 
}) => {
  return (
    <div className="holographic-panel p-4">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
        <Activity className="w-5 h-5 text-axiom-cyan" />
        <h3 className="font-orbitron font-bold text-white">ACTIVITY STREAM</h3>
        <div className="live-data-dot ml-auto"></div>
      </div>

      <div 
        className="data-stream overflow-y-auto pr-2" 
        style={{ maxHeight }}
      >
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={`data-stream-entry ${index === 0 ? 'latest' : ''}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xs text-gray-500 font-mono min-w-[60px]">
                {activity.timestamp}
              </span>
              <span className={`flex-1 ${
                activity.type === 'success' ? 'text-axiom-success' :
                activity.type === 'warning' ? 'text-axiom-warning' :
                activity.type === 'error' ? 'text-axiom-red' :
                'text-white/80'
              }`}>
                {activity.message}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;