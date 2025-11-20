'use client';

import { Home, Users, Settings, BarChart3, Shield } from 'lucide-react';

export function Sidebar() {
  const navItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: Users, label: 'Agents', active: false },
    { icon: BarChart3, label: 'Analytics', active: false },
    { icon: Shield, label: 'Security', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <div className="fixed left-4 top-4 bottom-4 w-20 glass-panel-premium flex flex-col items-center py-8 gap-6 z-50 rounded-2xl">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-axiom-cyan to-axiom-purple flex items-center justify-center shadow-lg shadow-axiom-cyan/20 animate-glow">
        <span className="text-xl font-bold font-display text-white">A</span>
      </div>

      <div className="flex-1 flex flex-col gap-4 mt-8 w-full px-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-300 group relative ${item.active
              ? 'bg-axiom-cyan/10 text-axiom-cyan shadow-[0_0_15px_rgba(0,240,255,0.2)] border-l-2 border-axiom-cyan'
              : 'text-gray-400 hover:text-axiom-cyan hover:bg-white/5 hover:scale-105 hover:shadow-[0_0_15px_rgba(0,240,255,0.5)]'
              }`}
            title={item.label}
          >
            <item.icon className={`w-5 h-5 transition-transform duration-300 ${item.active ? 'scale-110' : 'group-hover:scale-110'}`} />

            {/* Active Indicator */}
            {item.active && (
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-6 bg-axiom-cyan rounded-l-full shadow-[0_0_10px_#00F0FF]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}