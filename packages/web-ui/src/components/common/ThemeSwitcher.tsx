'use client';

import React, { useState } from 'react';
import { useTheme, Theme } from '@/contexts/ThemeContext';
import { Palette, Zap, Cpu, Activity, Layers } from 'lucide-react';

export default function ThemeSwitcher() {
    const { currentTheme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const themes: { id: Theme; name: string; icon: React.ReactNode; color: string }[] = [
        { id: 'void', name: 'Void', icon: <Zap className="w-4 h-4" />, color: 'bg-cyan-500' },
        { id: 'solar', name: 'Solar', icon: <Activity className="w-4 h-4" />, color: 'bg-yellow-500' },
        { id: 'matrix', name: 'Matrix', icon: <Cpu className="w-4 h-4" />, color: 'bg-green-500' },
        { id: 'nebula', name: 'Nebula', icon: <Layers className="w-4 h-4" />, color: 'bg-purple-500' },
    ];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                title="Change Theme"
            >
                <Palette className="w-5 h-5 text-gray-400" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 py-2 bg-dark-void border border-white/10 rounded-xl shadow-xl backdrop-blur-xl z-50 animate-fade-in-up">
                    <div className="px-4 py-2 text-xs font-rajdhani text-gray-500 uppercase tracking-wider">Select Theme</div>
                    {themes.map((theme) => (
                        <button
                            key={theme.id}
                            onClick={() => {
                                setTheme(theme.id);
                                setIsOpen(false);
                            }}
                            className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-white/5 transition-colors ${currentTheme === theme.id ? 'text-white' : 'text-gray-400'
                                }`}
                        >
                            <div className={`w-2 h-2 rounded-full ${theme.color} shadow-[0_0_8px_currentColor]`} />
                            <span className="font-rajdhani font-medium">{theme.name}</span>
                            {currentTheme === theme.id && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
