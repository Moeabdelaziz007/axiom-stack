import React, { useState } from 'react';
import { Users, Zap, Shield, Activity } from 'lucide-react';
import PaymentModal from '@/components/payments/PaymentModal';

interface SquadData {
    id: string;
    name: string;
    objective: string;
    members: { name: string; role: string }[];
    price: number;
    currency: 'AXM' | 'USDC';
    rating: number;
}

const SquadRentalCard: React.FC<{ squad: SquadData }> = ({ squad }) => {
    const [showPayment, setShowPayment] = useState(false);

    const handleRentClick = () => {
        setShowPayment(true);
    };

    const handlePaymentSuccess = () => {
        setShowPayment(false);
        alert(`Successfully rented ${squad.name}!`);
    };

    return (
        <>
            <PaymentModal
                isOpen={showPayment}
                onClose={() => setShowPayment(false)}
                amount={squad.price}
                currency={squad.currency}
                itemName={`Rent Squad: ${squad.name} (1 Month)`}
                onSuccess={handlePaymentSuccess}
            />

            <div className="glass-card p-6 rounded-2xl w-full transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,255,255,0.2)] border-cyber-cyan/20 group relative overflow-hidden">

                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-2xl font-orbitron text-white group-hover:text-cyber-cyan transition-colors">{squad.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-rajdhani px-2 py-0.5 rounded-full bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30">
                                    {squad.rating} ⭐ Elite Squad
                                </span>
                            </div>
                        </div>
                        <div className="p-3 bg-cyber-cyan/10 rounded-xl border border-cyber-cyan/30">
                            <Users className="w-6 h-6 text-cyber-cyan" />
                        </div>
                    </div>

                    <p className="text-sm text-white/60 mb-6 font-rajdhani min-h-[40px]">{squad.objective}</p>

                    {/* Squad Members */}
                    <div className="mb-6 bg-dark-void/30 p-4 rounded-xl border border-white/5">
                        <h4 className="text-xs text-white/40 font-bold mb-3 uppercase tracking-wider font-orbitron">Active Agents</h4>
                        <div className="space-y-2">
                            {squad.members.map((member, index) => (
                                <div key={index} className="flex items-center gap-3 text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-axiom-success shadow-[0_0_5px_#00ff94]"></div>
                                    <span className="text-white font-rajdhani">{member.name}</span>
                                    <span className="text-white/30 text-xs ml-auto">{member.role}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quantum Sync Indicator */}
                    <div className="flex items-center gap-2 text-xs text-holo-blue mb-6 bg-holo-blue/5 p-2 rounded-lg border border-holo-blue/20">
                        <Activity className="w-4 h-4 animate-pulse" />
                        <span className="font-mono">Quantum Synchronizer Active</span>
                    </div>

                    {/* Price and Action */}
                    <div className="flex justify-between items-center border-t border-white/10 pt-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-white/40 font-rajdhani uppercase">Monthly Squad Rate</span>
                            <span className="text-2xl font-orbitron text-cyber-cyan">
                                {squad.price.toLocaleString()} <span className="text-sm text-white/50">{squad.currency}</span>
                            </span>
                        </div>

                        <button
                            onClick={handleRentClick}
                            className="px-6 py-3 bg-cyber-cyan/10 border border-cyber-cyan/50 text-cyber-cyan rounded-xl font-bold text-sm hover:bg-cyber-cyan hover:text-dark-void hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all font-orbitron"
                        >
                            RENT SQUAD
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SquadRentalCard;
