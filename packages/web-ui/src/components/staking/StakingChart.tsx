'use client';

import React from 'react';
import { TrendingUp, Calendar } from 'lucide-react';

// Mock data for the chart
const mockChartData = [
  { date: '2023-06-01', staked: 1000, rewards: 50 },
  { date: '2023-06-02', staked: 1200, rewards: 60 },
  { date: '2023-06-03', staked: 1400, rewards: 70 },
  { date: '2023-06-04', staked: 1600, rewards: 80 },
  { date: '2023-06-05', staked: 1800, rewards: 90 },
  { date: '2023-06-06', staked: 2000, rewards: 100 },
  { date: '2023-06-07', staked: 2200, rewards: 110 },
];

export function StakingChart() {
  // Find min and max values for scaling
  const stakedValues = mockChartData.map(d => d.staked);
  const rewardValues = mockChartData.map(d => d.rewards);
  const minValue = Math.min(...stakedValues, ...rewardValues);
  const maxValue = Math.max(...stakedValues, ...rewardValues);
  
  // Chart dimensions
  const width = 600;
  const height = 300;
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  // Scale functions
  const xScale = (index: number) => 
    margin.left + (index / (mockChartData.length - 1)) * innerWidth;
    
  const yScale = (value: number) => 
    margin.top + innerHeight - ((value - minValue) / (maxValue - minValue)) * innerHeight;
  
  // Generate path data for staked line
  const stakedPathData = mockChartData.map((d, i) => 
    `${i === 0 ? 'M' : 'L'}${xScale(i)},${yScale(d.staked)}`
  ).join(' ');
  
  // Generate path data for rewards line
  const rewardsPathData = mockChartData.map((d, i) => 
    `${i === 0 ? 'M' : 'L'}${xScale(i)},${yScale(d.rewards)}`
  ).join(' ');

  return (
    <div className="glass-panel p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-white">Staking Performance</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-axiom-cyan"></div>
            <span className="text-sm text-gray-300">Staked Tokens</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-axiom-purple"></div>
            <span className="text-sm text-gray-300">Rewards</span>
          </div>
        </div>
      </div>
      
      <div className="relative">
        <svg width={width} height={height} className="w-full">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1={margin.left}
              y1={margin.top + (i / 4) * innerHeight}
              x2={width - margin.right}
              y2={margin.top + (i / 4) * innerHeight}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
            />
          ))}
          
          {/* Y-axis labels */}
          {[0, 1, 2, 3, 4].map((i) => (
            <text
              key={i}
              x={margin.left - 10}
              y={margin.top + (i / 4) * innerHeight + 4}
              textAnchor="end"
              className="text-xs fill-gray-400"
            >
              {Math.round(minValue + (maxValue - minValue) * (1 - i / 4))}
            </text>
          ))}
          
          {/* X-axis labels */}
          {mockChartData.map((d, i) => (
            <text
              key={i}
              x={xScale(i)}
              y={height - margin.bottom + 15}
              textAnchor="middle"
              className="text-xs fill-gray-400"
            >
              {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </text>
          ))}
          
          {/* Staked line */}
          <path
            d={stakedPathData}
            fill="none"
            stroke="#00F0FF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Rewards line */}
          <path
            d={rewardsPathData}
            fill="none"
            stroke="#9945FF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points for staked */}
          {mockChartData.map((d, i) => (
            <circle
              key={`staked-${i}`}
              cx={xScale(i)}
              cy={yScale(d.staked)}
              r="4"
              fill="#00F0FF"
              stroke="#0A0A0F"
              strokeWidth="2"
            />
          ))}
          
          {/* Data points for rewards */}
          {mockChartData.map((d, i) => (
            <circle
              key={`rewards-${i}`}
              cx={xScale(i)}
              cy={yScale(d.rewards)}
              r="4"
              fill="#9945FF"
              stroke="#0A0A0F"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>
      
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-800">
        <div className="flex items-center gap-2 text-gray-400">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">Last 7 days</span>
        </div>
        <div className="flex items-center gap-2 text-axiom-cyan">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">+12.5% growth</span>
        </div>
      </div>
    </div>
  );
}