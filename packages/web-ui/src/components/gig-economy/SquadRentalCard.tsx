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

            <div className="holographic-panel p-6 rounded-2xl w-full transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,255,255,0.2)] border-cyber-cyan/20 group relative overflow-hidden">

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

                    {/* HCAN Orbit Visualization */}
                    <div className="mb-6 bg-dark-void/30 h-64 rounded-xl border border-white/5 relative overflow-hidden flex items-center justify-center group/orbit">
                        <div className="absolute inset-0 grid-background opacity-10"></div>

                        {/* Security Badge */}
                        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2 py-1 rounded bg-axiom-success/10 border border-axiom-success/30 backdrop-blur-sm">
                            <Shield className="w-3 h-3 text-axiom-success" />
                            <span className="text-[10px] font-orbitron text-axiom-success tracking-wider">TOPOLOGICALLY SECURED</span>
                        </div>

                        {/* Orbital Rings */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-48 h-48 rounded-full border border-white/5 animate-[spin_10s_linear_infinite]"></div>
                            <div className="w-32 h-32 rounded-full border border-cyber-cyan/10 animate-[spin_15s_linear_infinite_reverse]"></div>
                        </div>

                        {/* Layer 1: Coordinator (Center) */}
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-neon-purple/20 border-2 border-neon-purple shadow-[0_0_20px_rgba(188,19,254,0.4)] flex items-center justify-center mb-2 relative">
                                <div className="absolute inset-0 rounded-full bg-neon-purple/10 animate-pulse"></div>
                                <Users className="w-8 h-8 text-neon-purple" />
                                {/* Coordinator Badge */}
                                <div className="absolute -bottom-2 px-2 py-0.5 bg-neon-purple text-black text-[9px] font-bold rounded-full font-orbitron">
                                    NEXUS
                                </div>
                            </div>
                            <span className="text-xs font-rajdhani text-white font-bold">
                                {squad.members.find(m => m.role.includes('Lead') || m.role.includes('Manager'))?.name || 'Coordinator'}
                            </span>
                            <span className="text-[9px] text-neon-purple/80 font-mono">Layer 1</span>
                        </div>

                        {/* Layer 0: Workers (Orbiting) */}
                        {squad.members.filter(m => !m.role.includes('Lead') && !m.role.includes('Manager')).map((member, idx, arr) => {
                            const angle = (idx / arr.length) * 2 * Math.PI;
                            const radius = 80; // Distance from center
                            const x = Math.cos(angle) * radius;
                            const y = Math.sin(angle) * radius;

                            return (
                                <div
                                    key={idx}
                                    className="absolute w-10 h-10 flex items-center justify-center transition-all duration-500 hover:scale-110 z-10"
                                    style={{
                                        transform: `translate(${x}px, ${y}px)`,
                                    }}
                                >
                                    <div className="relative group/worker">
                                        <div className="w-8 h-8 rounded-full bg-axiom-success/20 border border-axiom-success shadow-[0_0_10px_rgba(0,255,148,0.3)] flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-axiom-success"></div>
                                        </div>
                                        {/* Tooltip */}
                                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 border border-white/10 px-2 py-1 rounded text-[9px] text-white opacity-0 group-hover/worker:opacity-100 transition-opacity pointer-events-none">
                                            {member.name}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
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
