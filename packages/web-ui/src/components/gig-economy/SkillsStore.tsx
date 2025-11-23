import React, { useState } from 'react';
import { Search, Filter, ShoppingCart, Star, Download, Zap, Code, TrendingUp } from 'lucide-react';
import { AxiomSkills } from '@/lib/SkillsRegistry';
import PaymentModal from '@/components/payments/PaymentModal';

// Mock data for marketplace-specific fields (price, rating, etc.)
// In a real app, this would come from the D1 database
const MARKETPLACE_DATA: Record<string, { price: number; rating: number; reviews: number; creator: string }> = {
    'flash_arbitrage': { price: 500, rating: 4.9, reviews: 128, creator: '0xDeFi...Alpha' },
    'market_sentiment_trader': { price: 350, rating: 4.7, reviews: 85, creator: '0xTrade...Bot' },
    'seo_content_optimizer': { price: 200, rating: 4.8, reviews: 210, creator: '0xContent...King' },
    'social_media_campaign': { price: 150, rating: 4.6, reviews: 156, creator: '0xSocial...Guru' },
    'multi_source_research': { price: 100, rating: 4.9, reviews: 342, creator: '0xResearch...Lab' },
    'competitive_analysis': { price: 120, rating: 4.5, reviews: 98, creator: '0xBiz...Intel' },
    'skill_composer': { price: 1000, rating: 5.0, reviews: 42, creator: '0xAxiom...Core' },
};

export default function SkillsStore() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedSkillForPurchase, setSelectedSkillForPurchase] = useState<any>(null);

    const categories = ['All', 'Trading', 'Content', 'Research', 'Meta'];

    const filteredSkills = AxiomSkills.filter(skill => {
        const matchesSearch = skill.skill_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            skill.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handlePurchaseClick = (skill: any) => {
        const marketData = MARKETPLACE_DATA[skill.skill_id] || { price: 0 };
        setSelectedSkillForPurchase({
            ...skill,
            price: marketData.price
        });
        setIsPaymentModalOpen(true);
    };

    const handlePaymentSuccess = () => {
        setIsPaymentModalOpen(false);
        // In a real app, this would trigger a backend call to add the skill to the user's library
        alert(`Successfully purchased blueprint: ${selectedSkillForPurchase?.skill_name}`);
        setSelectedSkillForPurchase(null);
    };

    return (
        <div className="space-y-8">
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-cyan w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search for skills..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-dark-void border border-white/20 rounded-xl py-3 pl-10 pr-4 text-white focus:border-cyber-cyan focus:outline-none focus:shadow-glow-cyan transition-all"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-lg font-rajdhani whitespace-nowrap transition-all ${selectedCategory === category
                                ? 'bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan shadow-glow-cyan'
                                : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSkills.map(skill => {
                    const marketData = MARKETPLACE_DATA[skill.skill_id] || {
                        price: 99,
                        rating: 4.5,
                        reviews: 10,
                        creator: '0xAnon...User'
                    };

                    return (
                        <div key={skill.skill_id} className="glass-card p-6 relative group hover:border-cyber-cyan/50 transition-all duration-300">
                            {/* Holographic Effect Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/5 to-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />

                            <div className="relative z-10">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 rounded-lg bg-dark-void border border-white/10">
                                        {skill.category === 'Trading' && <TrendingUp className="w-6 h-6 text-axiom-success" />}
                                        {skill.category === 'Content' && <Code className="w-6 h-6 text-neon-purple" />}
                                        {skill.category === 'Research' && <Search className="w-6 h-6 text-holo-blue" />}
                                        {skill.category === 'Meta' && <Zap className="w-6 h-6 text-axiom-gold" />}
                                    </div>
                                    <div className="flex items-center gap-1 bg-axiom-gold/10 px-2 py-1 rounded text-axiom-gold text-xs font-bold border border-axiom-gold/20">
                                        <Star className="w-3 h-3 fill-axiom-gold" />
                                        {marketData.rating} ({marketData.reviews})
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-orbitron text-white mb-2 group-hover:text-cyber-cyan transition-colors">
                                    {skill.skill_name}
                                </h3>
                                <p className="text-white/60 text-sm font-rajdhani mb-4 line-clamp-2 h-10">
                                    {skill.description}
                                </p>

                                {/* Metadata */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {skill.required_tools.slice(0, 3).map(tool => (
                                        <span key={tool} className="text-xs px-2 py-1 rounded bg-white/5 text-white/40 border border-white/10">
                                            {tool}
                                        </span>
                                    ))}
                                    {skill.required_tools.length > 3 && (
                                        <span className="text-xs px-2 py-1 rounded bg-white/5 text-white/40 border border-white/10">
                                            +{skill.required_tools.length - 3} more
                                        </span>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-white/40 font-rajdhani">Price</span>
                                        <span className="text-lg font-bold text-cyber-cyan font-orbitron">
                                            {marketData.price} USDC
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handlePurchaseClick(skill)}
                                        className="px-4 py-2 bg-white/5 hover:bg-cyber-cyan hover:text-black border border-white/20 hover:border-cyber-cyan rounded-lg transition-all flex items-center gap-2 text-sm font-bold"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        Buy Blueprint
                                    </button>
                                </div>

                                <div className="mt-2 text-xs text-white/30 font-mono truncate">
                                    Creator: {marketData.creator}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Payment Modal */}
            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                amount={selectedSkillForPurchase?.price || 0}
                currency="USDC"
                itemName={selectedSkillForPurchase?.skill_name || 'Skill Blueprint'}
                onSuccess={handlePaymentSuccess}
            />
        </div>
    );
}
