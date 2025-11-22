import React, { useState } from 'react';
import { Star, Zap, Shield, Clock } from 'lucide-react';
import PaymentModal from '@/components/payments/PaymentModal';

interface RentalAgent {
    id: string;
    name: string;
    role: string;
    price: number;
    currency: 'AXM' | 'USDC';
    tags: string[];
    performanceRating: number;
    totalRentals: number;
    avatarColor: string;
}

const AgentRentalCard: React.FC<{ agent: RentalAgent }> = ({ agent }) => {
    const [showPayment, setShowPayment] = useState(false);

    const handleRentClick = () => {
        setShowPayment(true);
    };

    const handlePaymentSuccess = () => {
        setShowPayment(false);
        // In a real app, this would trigger a rental confirmation toast or redirect
        alert(`Successfully rented ${agent.name}!`);
    };

    return (
        <>
            <PaymentModal
                isOpen={showPayment}
                onClose={() => setShowPayment(false)}
                amount={agent.price}
                currency={agent.currency}
                itemName={`Rent: ${agent.name} (1 Month)`}
                onSuccess={handlePaymentSuccess}
            />

            <div className="glass-card p-5 rounded-2xl w-full transition-all duration-300 hover:shadow-[0_0_40px_rgba(157,78,221,0.3)] border-neon-purple/20 group relative overflow-hidden">

                {/* Hover Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            {/* Avatar Placeholder */}
                            <div className={`w-12 h-12 rounded-xl bg-${agent.avatarColor}/20 border border-${agent.avatarColor}/50 flex items-center justify-center`}>
                                <Zap className={`w-6 h-6 text-${agent.avatarColor}`} />
                            </div>
                            <div>
                                <h3 className="text-lg font-orbitron text-white group-hover:text-neon-purple transition-colors">{agent.name}</h3>
                                <p className="text-xs text-white/50 font-rajdhani">{agent.role}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 bg-dark-void/50 px-2 py-1 rounded-lg border border-white/5">
                            <Star className="w-3 h-3 text-axiom-warning fill-axiom-warning" />
                            <span className="text-xs font-mono text-white">{agent.performanceRating}</span>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-6 h-16 content-start">
                        {agent.tags.map(tag => (
                            <span key={tag} className="text-[10px] px-2 py-1 bg-white/5 text-white/60 rounded border border-white/5 font-rajdhani uppercase tracking-wider">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 gap-2 mb-6">
                        <div className="bg-dark-void/30 p-2 rounded-lg">
                            <div className="flex items-center gap-1 text-white/40 text-[10px] mb-1">
                                <Clock className="w-3 h-3" />
                                <span>UPTIME</span>
                            </div>
                            <span className="text-sm font-mono text-axiom-success">99.9%</span>
                        </div>
                        <div className="bg-dark-void/30 p-2 rounded-lg">
                            <div className="flex items-center gap-1 text-white/40 text-[10px] mb-1">
                                <Shield className="w-3 h-3" />
                                <span>RENTALS</span>
                            </div>
                            <span className="text-sm font-mono text-white">{agent.totalRentals}</span>
                        </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex justify-between items-center border-t border-white/10 pt-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-white/40 font-rajdhani uppercase">Monthly Rate</span>
                            <span className="text-xl font-orbitron text-cyber-cyan">
                                {agent.price} <span className="text-sm text-white/50">{agent.currency}</span>
                            </span>
                        </div>

                        <button
                            onClick={handleRentClick}
                            className="px-5 py-2 bg-neon-purple/10 border border-neon-purple/50 text-neon-purple rounded-lg font-bold text-sm hover:bg-neon-purple hover:text-white hover:shadow-[0_0_20px_rgba(157,78,221,0.4)] transition-all font-orbitron"
                        >
                            RENT
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AgentRentalCard;
