'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';
import {
  Search,
  Bot,
  Zap,
  TrendingUp,
  Newspaper,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { useAgents } from '@/hooks/useAgents';
import { cn } from '@/lib/utils';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CommandAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
  category: 'agents' | 'actions' | 'navigation';
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const { agents } = useAgents();
  const [search, setSearch] = useState('');
  const [recentActions, setRecentActions] = useState<string[]>([]);

  // Quick actions
  const quickActions: CommandAction[] = [
    {
      id: 'analyze-market',
      label: 'Analyze Market Trends',
      icon: <TrendingUp className="w-4 h-4" />,
      shortcut: 'Ctrl+1',
      action: () => {
        console.log('Analyzing market...');
        addToRecent('analyze-market');
        onOpenChange(false);
      },
      category: 'actions',
    },
    {
      id: 'scan-news',
      label: 'Scan News Feed',
      icon: <Newspaper className="w-4 h-4" />,
      shortcut: 'Ctrl+2',
      action: () => {
        console.log('Scanning news...');
        addToRecent('scan-news');
        onOpenChange(false);
      },
      category: 'actions',
    },
    {
      id: 'settings',
      label: 'Open Settings',
      icon: <Settings className="w-4 h-4" />,
      shortcut: 'Ctrl+5',
      action: () => {
        router.push('/settings');
        addToRecent('settings');
        onOpenChange(false);
      },
      category: 'navigation',
    },
    {
      id: 'help',
      label: 'Help & Documentation',
      icon: <HelpCircle className="w-4 h-4" />,
      shortcut: 'Ctrl+6',
      action: () => {
        window.open('https://docs.axiomid.app', '_blank');
        addToRecent('help');
        onOpenChange(false);
      },
      category: 'navigation',
    },
  ];

  // Agent actions
  const agentActions: CommandAction[] = agents.map((agent) => ({
    id: `agent-${agent.id}`,
    label: agent.name || agent.id.substring(0, 8),
    icon: <Bot className="w-4 h-4" />,
    action: () => {
      router.push(`/dashboard?agent=${agent.id}`);
      addToRecent(`agent-${agent.id}`);
      onOpenChange(false);
    },
    category: 'agents' as const,
  }));

  const allActions = [...quickActions, ...agentActions];

  // Fuzzy search setup
  const fuse = new Fuse(allActions, {
    keys: ['label', 'category'],
    threshold: 0.3,
  });

  const filteredActions = search
    ? fuse.search(search).map((result) => result.item)
    : allActions;

  const addToRecent = useCallback((actionId: string) => {
    setRecentActions((prev) => {
      const updated = [actionId, ...prev.filter((id) => id !== actionId)].slice(0, 5);
      localStorage.setItem('axiom-recent-actions', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Load recent actions from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('axiom-recent-actions');
    if (stored) {
      setRecentActions(JSON.parse(stored));
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const recentActionItems = recentActions
    .map((id) => allActions.find((action) => action.id === id))
    .filter(Boolean) as CommandAction[];

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Command Palette"
      className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 animate-slide-in"
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xl -z-10" aria-hidden="true" />
      <div className="glass-panel-premium rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-axiom-cyan/50 bg-black/60 backdrop-blur-2xl">
        {/* Holographic Top Line */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-axiom-cyan to-transparent opacity-50" />

        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5 bg-white/5">
          <Search className="w-5 h-5 text-axiom-cyan animate-pulse" />
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="Search agents, actions, logs..."
            className="flex-1 bg-transparent text-white placeholder:text-gray-500 outline-none font-mono text-sm caret-axiom-cyan"
          />
          <kbd className="px-2 py-1 text-[10px] font-mono bg-white/10 rounded text-gray-400 border border-white/5">
            ⌘K
          </kbd>
        </div>

        {/* Results */}
        <Command.List className="max-h-96 overflow-y-auto p-2 custom-scrollbar">
          <Command.Empty className="py-12 text-center text-gray-500 flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-2">
              <Search className="w-6 h-6 text-gray-600" />
            </div>
            <span className="font-mono text-sm">No results found</span>
          </Command.Empty>

          {/* Recent Actions */}
          {!search && recentActionItems.length > 0 && (
            <Command.Group heading="Recent" className="mb-2">
              <div className="px-2 py-1.5 text-[10px] font-bold font-display text-gray-500 uppercase tracking-wider">
                Recent
              </div>
              {recentActionItems.map((action: CommandAction) => (
                <Command.Item
                  key={action.id}
                  value={action.label}
                  onSelect={action.action}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group',
                    'hover:bg-axiom-cyan/5 data-[selected=true]:bg-axiom-cyan/5 data-[selected=true]:border-l-2 data-[selected=true]:border-axiom-cyan'
                  )}
                >
                  <div className="text-axiom-cyan group-hover:scale-110 transition-transform">{action.icon}</div>
                  <span className="flex-1 text-sm text-gray-300 group-hover:text-white font-medium">{action.label}</span>
                  {action.shortcut && (
                    <kbd className="px-2 py-1 text-[10px] font-mono bg-white/5 rounded text-gray-500 group-hover:text-gray-300">
                      {action.shortcut}
                    </kbd>
                  )}
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {/* Quick Actions */}
          <Command.Group heading="Quick Actions">
            <div className="px-2 py-1.5 text-[10px] font-bold font-display text-gray-500 uppercase tracking-wider">
              Quick Actions
            </div>
            {filteredActions
              .filter((action: CommandAction) => action.category === 'actions')
              .map((action: CommandAction) => (
                <Command.Item
                  key={action.id}
                  value={action.label}
                  onSelect={action.action}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group',
                    'hover:bg-axiom-cyan/5 data-[selected=true]:bg-axiom-cyan/5 data-[selected=true]:border-l-2 data-[selected=true]:border-axiom-cyan'
                  )}
                >
                  <div className="text-axiom-cyan group-hover:scale-110 transition-transform">{action.icon}</div>
                  <span className="flex-1 text-sm text-gray-300 group-hover:text-white font-medium">{action.label}</span>
                  {action.shortcut && (
                    <kbd className="px-2 py-1 text-[10px] font-mono bg-white/5 rounded text-gray-500 group-hover:text-gray-300">
                      {action.shortcut}
                    </kbd>
                  )}
                </Command.Item>
              ))}
          </Command.Group>

          {/* Agents */}
          {filteredActions.some((a: CommandAction) => a.category === 'agents') && (
            <Command.Group heading="Agents" className="mt-2">
              <div className="px-2 py-1.5 text-[10px] font-bold font-display text-gray-500 uppercase tracking-wider">
                Agents
              </div>
              {filteredActions
                .filter((action: CommandAction) => action.category === 'agents')
                .slice(0, 5)
                .map((action: CommandAction) => (
                  <Command.Item
                    key={action.id}
                    value={action.label}
                    onSelect={action.action}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group',
                      'hover:bg-axiom-purple/5 data-[selected=true]:bg-axiom-purple/5 data-[selected=true]:border-l-2 data-[selected=true]:border-axiom-purple'
                    )}
                  >
                    <div className="text-axiom-purple group-hover:scale-110 transition-transform">{action.icon}</div>
                    <span className="flex-1 text-sm text-gray-300 group-hover:text-white font-medium">{action.label}</span>
                  </Command.Item>
                ))}
            </Command.Group>
          )}
        </Command.List>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-white/5 bg-black/40">
          <div className="flex items-center gap-4 text-[10px] text-gray-500 font-mono">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-white/5 rounded border border-white/5">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-white/5 rounded border border-white/5">↵</kbd>
              Select
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-white/5 rounded border border-white/5">Esc</kbd>
              Close
            </span>
          </div>
          <div className="text-[10px] text-axiom-cyan/50 font-mono">
            AXIOM_OS v2.0
          </div>
        </div>
      </div>
    </Command.Dialog>
  );
}