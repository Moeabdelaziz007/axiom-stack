'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Sparkles,
    Store,
    Terminal,
    Swords,
    Briefcase,
    Rocket,
    Dna,
    GraduationCap,
    User,
    Menu,
    X
} from 'lucide-react';

interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
}

interface NavSection {
    title: string;
    items: NavItem[];
}

const navigation: NavSection[] = [
    {
        title: 'MENU',
        items: [
            { name: 'Dashboard', href: '/', icon: LayoutDashboard },
            { name: 'AIX Studio', href: '/aix-studio', icon: Sparkles, badge: 'NEW' },
            { name: 'Marketplace', href: '/gig-economy', icon: Store },
        ],
    },
];

export default function CommandSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside
            className={`
                h-full bg-dark-void/90 backdrop-blur-xl border-r border-white/10 flex flex-col z-50 transition-all duration-300
                ${isCollapsed ? 'w-20' : 'w-64'}
            `}
        >
            {/* Logo Section */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                {!isCollapsed && (
                    <div className="flex items-center gap-3 animate-fade-in">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                                AXIOM
                            </h1>
                        </div>
                    </div>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors"
                >
                    {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6">
                {navigation.map((section) => (
                    <div key={section.title}>
                        {!isCollapsed && (
                            <h2 className="px-3 text-xs font-orbitron text-white/40 mb-2 tracking-widest animate-fade-in">
                                {section.title}
                            </h2>
                        )}
                        <ul className="space-y-1">
                            {section.items.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;

                                return (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className={`
                                                group flex items-center gap-3 px-3 py-3 rounded-xl
                                                font-rajdhani text-sm transition-all duration-300 relative overflow-hidden
                                                ${isActive
                                                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-white/10 shadow-lg shadow-cyan-500/10'
                                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                                                }
                                            `}
                                            title={isCollapsed ? item.name : ''}
                                        >
                                            {isActive && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-transparent opacity-50" />
                                            )}
                                            <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-cyan-400' : 'text-white/50 group-hover:text-white'}`} />

                                            {!isCollapsed && (
                                                <span className="flex-1 relative z-10 animate-fade-in">{item.name}</span>
                                            )}

                                            {!isCollapsed && item.badge && (
                                                <span className="px-2 py-0.5 text-[10px] font-bold bg-cyan-500/20 text-cyan-400 rounded border border-cyan-500/30 animate-fade-in">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* User Profile Section */}
            <div className="p-4 border-t border-white/10">
                <div className={`
                    bg-white/5 rounded-xl p-3 border border-white/5 hover:border-white/10 transition-all cursor-pointer group
                    ${isCollapsed ? 'flex justify-center' : ''}
                `}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0 animate-fade-in">
                                <p className="text-sm font-bold text-white truncate">Quantum User</p>
                                <p className="text-xs text-cyan-400 truncate">Connected</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
}
