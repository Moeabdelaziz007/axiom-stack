// components/StatusIndicator.tsx
import { useState, useEffect } from 'react';

interface StatusIndicatorProps {
  title: string;
  value: number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red';
}

const StatusIndicator = ({ title, value, unit = '', trend, trendValue, color }: StatusIndicatorProps) => {
  const getColorClasses = () => {
    switch (color) {
      case 'blue': return 'text-blue-400';
      case 'green': return 'text-green-400';
      case 'purple': return 'text-purple-400';
      case 'yellow': return 'text-yellow-400';
      case 'red': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    switch (trend) {
      case 'up': return '▲';
      case 'down': return '▼';
      case 'stable': return '●';
      default: return null;
    }
  };

  const getTrendColor = () => {
    if (!trend) return 'text-gray-500';
    switch (trend) {
      case 'up': return 'text-green-500';
      case 'down': return 'text-red-500';
      case 'stable': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="glass rounded-lg p-4">
      <div className="text-sm text-gray-400 mb-2">{title}</div>
      <div className={`text-2xl font-bold ${getColorClasses()}`}>
        {value.toLocaleString()}{unit}
      </div>
      {trend && trendValue !== undefined && (
        <div className={`text-xs ${getTrendColor()} flex items-center`}>
          <span className="mr-1">{getTrendIcon()}</span>
          {trendValue}{unit} {trend === 'up' ? 'increase' : trend === 'down' ? 'decrease' : 'change'} in last hour
        </div>
      )}
    </div>
  );
};

export default StatusIndicator;