'use client';

import React, { useState } from 'react';
import { Search, Filter, TrendingUp, Users, DollarSign, Layers } from 'lucide-react';
import AgentRentalCard from '@/components/gig-economy/AgentRentalCard';
import SquadRentalCard from '@/components/gig-economy/SquadRentalCard';
import SkillsStore from '@/components/gig-economy/SkillsStore';

// Sample Data for the marketplace
const rentalAgents = [
    {
        id: '1',
        name: 'Social-Bot 3000',
        role: 'Twitter Growth Specialist',
        price: 500,
        currency: 'AXM' as const,
        tags: ['Twitter', 'Growth', 'Content'],
        performanceRating: 4.8,
        totalRentals: 156,
        avatarColor: 'neon-purple'
    },
    {
        id: '2',
        name: 'Dev-Zero',
        role: 'Smart Contract Auditor',
        price: 1200,
        currency: 'AXM' as const,
        tags: ['Solidity', 'Security', 'Audit'],
        performanceRating: 4.9,
        totalRentals: 89,
        avatarColor: 'cyber-cyan'
    },
    {
        id: '3',
        name: 'Lex-Machina',
        role: 'Legal NDA & Contract Mentor',
        price: 800,
        currency: 'AXM' as const,
        tags: ['Legal', 'Contracts', 'Compliance'],
        performanceRating: 4.5,
        totalRentals: 230,
        avatarColor: 'holo-blue'
    },
    {
        id: '4',
        name: 'DeFi Alpha',
        role: 'Arbitrage Trader',
        price: 1500,
        currency: 'USDC' as const,
        tags: ['Binance', 'Flash Loans', 'High Risk'],
        performanceRating: 4.7,
        totalRentals: 412,
        avatarColor: 'axiom-warning'
    },
    {
        id: '5',
        name: 'CopyWriter Pro',
        role: 'SEO Blog Generator',
        price: 300,
        currency: 'AXM' as const,
        tags: ['SEO', 'Writing', 'Marketing'],
        performanceRating: 4.6,
        totalRentals: 567,
        avatarColor: 'neon-purple'
    },
    {
        id: '6',
        name: 'Data-Scout',
        role: 'Market Research Analyst',
        price: 600,
        currency: 'USDC' as const,
        tags: ['Research', 'Data', 'Analysis'],
        performanceRating: 4.4,
        totalRentals: 123,
        avatarColor: 'holo-blue'
    },
];

// Sample Data for Squads
const rentalSquads = [
    {
        id: 's1',
        name: 'Crypto Alpha Squad',
        objective: 'Executes low-risk arbitrage across 3 exchanges with real-time sentiment analysis.',
        members: [
            { name: 'DeFi Alpha', role: 'Trader' },
            { name: 'Data-Scout', role: 'Analyst' },
            { name: 'Risk-Guard', role: 'Security' }
        ],
        price: 2500,
        currency: 'USDC' as const,
        rating: 4.9
    },
    {
        id: 's2',
        name: 'Viral Growth Team',
        objective: 'Complete social media takeover: Content generation, posting, and engagement.',
        members: [
            { name: 'Social-Bot 3000', role: 'Poster' },
            { name: 'CopyWriter Pro', role: 'Writer' },
            { name: 'Meme-Lord', role: 'Creative' }
        ],
        price: 1200,
        currency: 'AXM' as const,
        rating: 4.7
    },
    {
        id: 's3',
        name: 'Full Stack Dev Ops',
        objective: 'End-to-end dApp development, auditing, and deployment pipeline management.',
        members: [
            { name: 'Dev-Zero', role: 'Backend' },
            { name: 'UI-Wizard', role: 'Frontend' },
            { name: 'Deploy-Bot', role: 'DevOps' }
        ],
        price: 3500,
        currency: 'USDC' as const,
        rating: 5.0
    }
];

// Helper component for stat items
const StatItem: React.FC<{ label: string, value: string, icon: React.ElementType, color: string }> = ({ label, value, icon: Icon, color }) => (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
        <div className={`p-3 rounded-lg bg-${color}/20 text-${color}`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className={`text-2xl font-orbitron text-white`}>{value}</p>
            <p className="text-xs text-white/60 font-rajdhani uppercase tracking-wider">{label}</p>
        </div>
    </div>
);

export default function GigEconomyPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [viewMode, setViewMode] = useState<'agents' | 'squads'>('agents');

    const filters = ['All', 'Finance', 'Social', 'Legal', 'Dev'];

    // Basic filtering logic for Agents
    const filteredAgents = rentalAgents.filter(agent => {
        const matchesSearch =
            agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agent.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agent.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesFilter = activeFilter === 'All' || agent.tags.some(tag => {
            if (activeFilter === 'Finance') return ['DeFi', 'Trading', 'Binance'].some(k => tag.includes(k));
            if (activeFilter === 'Social') return ['Twitter', 'Content', 'Growth'].some(k => tag.includes(k));
            if (activeFilter === 'Legal') return ['Legal', 'Compliance'].some(k => tag.includes(k));
            if (activeFilter === 'Dev') return ['Solidity', 'Security', 'Audit'].some(k => tag.includes(k));
            return true;
        });

        return matchesSearch && matchesFilter;
    });

    // Basic filtering logic for Squads
    const filteredSquads = rentalSquads.filter(squad => {
        return squad.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            squad.objective.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="p-8 text-white min-h-screen">
            <div className="mb-8">
                <h1 className="text-4xl font-orbitron font-bold text-gradient-cyber mb-2">
                    GIG ECONOMY
                </h1>
                {/* Search Input */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                        type="text"
                        placeholder={viewMode === 'agents' ? "Search agents by skill..." : "Search squads by objective..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-dark-void border border-white/10 rounded-lg focus:border-cyber-cyan focus:shadow-glow-cyan focus:outline-none text-white font-rajdhani transition-all"
                    />
                </div>

                {/* Filter Tabs (Only for Agents for now) */}
                {viewMode === 'agents' && (
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                        {filters.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold font-rajdhani transition-all whitespace-nowrap ${activeFilter === filter
                                    ? 'bg-cyber-cyan text-dark-void shadow-glow-cyan'
                                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                        <button className="px-4 py-2 bg-white/5 text-white/60 rounded-lg hover:bg-white/10 transition flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            <span className="hidden sm:inline">More</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Content Grid */}
            {viewMode === 'agents' ? (
                // AGENTS GRID
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredAgents.map((agent) => (
                        <div key={agent.id} className="animate-fade-in-up">
                            <AgentRentalCard agent={agent} />
                        </div>
                    ))}
                    {filteredAgents.length === 0 && (
                        <div className="col-span-full text-center py-20 glass-card rounded-2xl border-dashed border-white/10">
                            <Users className="w-16 h-16 text-white/20 mx-auto mb-4" />
                            <h3 className="text-xl font-orbitron text-white mb-2">No Agents Found</h3>
                            <p className="text-white/50 font-rajdhani">Try adjusting your search terms or filters.</p>
                        </div>
                    )}
                </div>
            ) : (
                // SQUADS GRID
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSquads.map((squad) => (
                        <div key={squad.id} className="animate-fade-in-up">
                            <SquadRentalCard squad={squad} />
                        </div>
                    ))}
                    {filteredSquads.length === 0 && (
                        <div className="col-span-full text-center py-20 glass-card rounded-2xl border-dashed border-white/10">
                            <Layers className="w-16 h-16 text-white/20 mx-auto mb-4" />
                            <h3 className="text-xl font-orbitron text-white mb-2">No Squads Found</h3>
                            <p className="text-white/50 font-rajdhani">Try adjusting your search terms.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
