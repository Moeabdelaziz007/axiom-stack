'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DataTickerProps {
  fromCurrency: string;
  toCurrency: string;
  baseAmount?: number;
  className?: string;
}

/**
 * DataTicker - Holographic live exchange rate display
 * Shows dynamic counting animation for conversion rates
 */
export const DataTicker: React.FC<DataTickerProps> = ({
  fromCurrency,
  toCurrency,
  baseAmount = 1,
  className = ''
}) => {
  const [rate, setRate] = useState(20.5);
  const [displayRate, setDisplayRate] = useState(20.5);
  const [trend, setTrend] = useState<'up' | 'down'>('up');

  // Simulate live rate fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      const newRate = 20.5 + (Math.random() - 0.5) * 0.5;
      setTrend(newRate > rate ? 'up' : 'down');
      setRate(newRate);
    }, 3000);

    return () => clearInterval(interval);
  }, [rate]);

  // Animate the display rate
  useEffect(() => {
    const duration = 500;
    const steps = 20;
    const stepValue = (rate - displayRate) / steps;
    let currentStep = 0;

    const animation = setInterval(() => {
      currentStep++;
      setDisplayRate(prev => prev + stepValue);
      
      if (currentStep >= steps) {
        clearInterval(animation);
        setDisplayRate(rate);
      }
    }, duration / steps);

    return () => clearInterval(animation);
  }, [rate, displayRate]);

  return (
    <div className={`holographic-panel p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="live-data-dot"></div>
          <span className="text-xs text-white/50 font-rajdhani uppercase tracking-wider">
            Live Exchange Rate
          </span>
        </div>
        {trend === 'up' ? (
          <TrendingUp className="w-4 h-4 text-axiom-success" />
        ) : (
          <TrendingDown className="w-4 h-4 text-axiom-red" />
        )}
      </div>

      <div className="mt-3 font-mono">
        <div className="flex items-baseline gap-2">
          <span className="text-lg text-white/70">
            ${baseAmount.toFixed(2)} {fromCurrency}
          </span>
          <span className="text-white/40">=</span>
          <span className="text-2xl font-bold text-cyber-cyan neon-text">
            {displayRate.toFixed(2)}
          </span>
          <span className="text-lg text-white/70">{toCurrency}</span>
        </div>
      </div>

      <div className="mt-2 text-xs text-white/40 font-rajdhani">
        Updated every 3 seconds
      </div>
    </div>
  );
};

export default DataTicker;