'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Newspaper,
  Zap,
  DollarSign,
  BarChart3,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  shortcut: string;
  color: string;
  action: () => void;
}

export function QuickActions() {
  const actions: QuickAction[] = [
    {
      id: 'analyze',
      label: 'Analyze Market',
      icon: <TrendingUp className="w-6 h-6" />,
      shortcut: 'Ctrl+1',
      color: 'axiom-cyan',
      action: () => console.log('Analyzing market...'),
    },
    {
      id: 'scan',
      label: 'Scan News',
      icon: <Newspaper className="w-6 h-6" />,
      shortcut: 'Ctrl+2',
      color: 'axiom-purple',
      action: () => console.log('Scanning news...'),
    },
    {
      id: 'execute',
      label: 'Execute Trade',
      icon: <Zap className="w-6 h-6" />,
      shortcut: 'Ctrl+3',
      color: 'axiom-warning',
      action: () => console.log('Executing trade...'),
    },
    {
      id: 'trade',
      label: 'View Trades',
      icon: <DollarSign className="w-6 h-6" />,
      shortcut: 'Ctrl+4',
      color: 'axiom-success',
      action: () => console.log('Viewing trades...'),
    },
    {
      id: 'report',
      label: 'View Reports',
      icon: <BarChart3 className="w-6 h-6" />,
      shortcut: 'Ctrl+5',
      color: 'axiom-red',
      action: () => console.log('Viewing reports...'),
    },
    {
      id: 'config',
      label: 'Settings',
      icon: <Settings className="w-6 h-6" />,
      shortcut: 'Ctrl+6',
      color: 'gray-400',
      action: () => console.log('Opening settings...'),
    },
  ];

  // Register keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= 6) {
          e.preventDefault();
          actions[num - 1]?.action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="glass-panel rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
        <span className="text-xs text-gray-500">Use Ctrl+1-6 for shortcuts</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            onClick={action.action}
            className={cn(
              'group relative flex flex-col items-center gap-2 p-4 rounded-xl',
              'bg-gray-900/50 border border-gray-800/50',
              'hover:border-axiom-cyan/50 hover:bg-gray-800/50',
              'transition-all duration-300',
              'focus:outline-none focus:ring-2 focus:ring-axiom-cyan/50'
            )}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-axiom-cyan/0 to-axiom-purple/0 group-hover:from-axiom-cyan/10 group-hover:to-axiom-purple/10 transition-all duration-300" />

            {/* Icon */}
            <div className={cn('text-' + action.color, 'relative z-10')}>
              {action.icon}
            </div>

            {/* Label */}
            <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors relative z-10 text-center">
              {action.label}
            </span>

            {/* Shortcut */}
            <kbd className="absolute top-2 right-2 px-1.5 py-0.5 text-[10px] font-mono bg-gray-800/80 rounded text-gray-500 group-hover:text-gray-400 transition-colors">
              {action.shortcut.replace('Ctrl+', '⌃')}
            </kbd>
          </motion.button>
        ))}
      </div>
    </div>
  );
}