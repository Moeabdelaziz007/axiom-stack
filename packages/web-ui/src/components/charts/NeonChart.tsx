'use client';

import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

interface NeonChartProps {
  data: ChartDataPoint[];
  type?: 'bar' | 'line';
  dataKey?: string;
  color?: string;
  height?: number;
}

/**
 * NeonChart - Charts with neon color scheme encapsulated in holographic panel
 * Uses cyber-cyan and neon-purple for visual consistency
 */
export const NeonChart: React.FC<NeonChartProps> = ({ 
  data, 
  type = 'bar',
  dataKey = 'value',
  color = '#00F0FF',
  height = 300
}) => {
  const ChartComponent = type === 'bar' ? BarChart : LineChart;
  const DataComponent = type === 'bar' ? Bar : Line;

  return (
    <div className="holographic-panel p-4">
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="name" 
            stroke="rgba(255,255,255,0.5)"
            style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.5)"
            style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }}
          />
          <Tooltip 
            contentStyle={{
              background: 'rgba(18, 25, 30, 0.9)',
              border: '1px solid rgba(0, 255, 255, 0.3)',
              borderRadius: '8px',
              color: '#fff',
              fontFamily: 'JetBrains Mono'
            }}
          />
          <DataComponent 
            dataKey={dataKey} 
            fill={color}
            stroke={color}
            strokeWidth={type === 'line' ? 2 : 0}
          />
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};

export default NeonChart;