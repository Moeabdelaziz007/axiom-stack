'use client';

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
    User
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
            { name: 'Marketplace', href: '/marketplace', icon: Store },
        ],
    },
    {
        title: 'DEV TOOLS',
        items: [
            { name: 'System Prompts', href: '/prompts', icon: Terminal },
        ],
    },
    {
        title: 'ECONOMY',
        items: [
            { name: 'Agent Arena', href: '/arena', icon: Swords },
            { name: 'Gig Economy', href: '/gig-economy', icon: Briefcase, badge: 'NEW' },
            { name: 'ILO Launchpad', href: '/ilo', icon: Rocket },
        ],
    },
    {
        title: 'CREATION',
        items: [
            { name: 'Gene Lab', href: '/gene-lab', icon: Dna },
            { name: 'Agent University', href: '/university', icon: GraduationCap },
        ],
    },
];

export default function CommandSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-dark-void border-r border-cyber-cyan/20 flex flex-col">
            {/* Logo Section */}
            <div className="p-6 border-b border-cyber-cyan/20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyber-cyan to-holo-blue flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-dark-void" />
                    </div>
                    <div>
                        <h1 className="text-xl font-orbitron font-bold text-gradient-cyber">
                            AXIOM
                        </h1>
                        <p className="text-xs text-gray-400 font-rajdhani">DIGITAL CIVILIZATION</p>
                    </div>
                </div>
            </div>

            {/* Navigation Sections */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                {navigation.map((section) => (
                    <div key={section.title}>
                        <h2 className="text-xs font-orbitron text-gray-500 mb-3 tracking-wider">
                            {section.title}
                        </h2>
                        <ul className="space-y-1">
                            {section.items.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;

                                return (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className={`
                        group flex items-center gap-3 px-3 py-2.5 rounded-lg
                        font-rajdhani text-sm transition-all duration-200
                        ${isActive
                                                    ? 'bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 shadow-glow-cyan'
                                                    : 'text-gray-400 hover:text-cyber-cyan hover:bg-cyber-cyan/5'
                                                }
                      `}
                                        >
                                            <Icon className={`w-5 h-5 ${isActive ? 'text-cyber-cyan' : 'text-gray-500 group-hover:text-cyber-cyan'}`} />
                                            <span className="flex-1">{item.name}</span>
                                            {item.badge && (
                                                <span className="px-2 py-0.5 text-xs font-bold bg-neon-purple/20 text-neon-purple rounded border border-neon-purple/30">
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
            <div className="p-4 border-t border-cyber-cyan/20">
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple to-holo-blue flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-rajdhani font-bold text-white">Quantum User</p>
                            <p className="text-xs text-gray-400">Connected: Phantom</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 font-rajdhani">Balance</span>
                        <span className="text-lg font-orbitron font-bold text-gradient-cyber">
                            $45,230.00
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
