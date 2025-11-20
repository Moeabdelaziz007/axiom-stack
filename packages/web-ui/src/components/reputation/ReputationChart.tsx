'use client';

import React from 'react';
import { TrendingUp, Star } from 'lucide-react';

// Mock reputation data
const mockReputationData = [
  { date: '2023-06-01', score: 75 },
  { date: '2023-06-02', score: 78 },
  { date: '2023-06-03', score: 82 },
  { date: '2023-06-04', score: 85 },
  { date: '2023-06-05', score: 87 },
  { date: '2023-06-06', score: 89 },
  { date: '2023-06-07', score: 92 },
];

export function ReputationChart() {
  // Find min and max values for scaling
  const scores = mockReputationData.map(d => d.score);
  const minValue = Math.min(...scores);
  const maxValue = Math.max(...scores);
  
  // Chart dimensions
  const width = 600;
  const height = 300;
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  // Scale functions
  const xScale = (index: number) => 
    margin.left + (index / (mockReputationData.length - 1)) * innerWidth;
    
  const yScale = (value: number) => 
    margin.top + innerHeight - ((value - minValue) / (maxValue - minValue)) * innerHeight;
  
  // Generate path data for reputation line
  const pathData = mockReputationData.map((d, i) => 
    `${i === 0 ? 'M' : 'L'}${xScale(i)},${yScale(d.score)}`
  ).join(' ');

  return (
    <div className="glass-panel p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-white">Reputation Score</h3>
        <div className="flex items-center gap-2 text-axiom-cyan">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">+17.3% improvement</span>
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
              {Math.round(minValue + (maxValue - minValue) * (i / 4))}
            </text>
          ))}
          
          {/* X-axis labels */}
          {mockReputationData.map((d, i) => (
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
          
          {/* Reputation line */}
          <path
            d={pathData}
            fill="none"
            stroke="#00F0FF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {mockReputationData.map((d, i) => (
            <circle
              key={i}
              cx={xScale(i)}
              cy={yScale(d.score)}
              r="5"
              fill="#00F0FF"
              stroke="#0A0A0F"
              strokeWidth="2"
            />
          ))}
          
          {/* Fill area under the curve */}
          <path
            d={`${pathData} L${xScale(mockReputationData.length - 1)},${height - margin.bottom} L${xScale(0)},${height - margin.bottom} Z`}
            fill="url(#reputationGradient)"
            opacity="0.2"
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="reputationGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-axiom-cyan" />
          <span className="text-sm text-gray-400">Current Score</span>
        </div>
        <div className="text-2xl font-bold text-axiom-cyan">
          {mockReputationData[mockReputationData.length - 1].score}
        </div>
      </div>
    </div>
  );
}