'use client';

import React from 'react';
import { Zap, Recycle, TrendingDown, Info } from 'lucide-react';

interface LandauerMeterProps {
    totalSteps?: number;
    reversibleSteps?: number;
    landauerEfficiency?: number; // 0-100%
    entropyWaste?: number; // 0-100%
    totalEnergyMicrojoules?: number;
    isActive?: boolean;
}

export default function LandauerMeter({
    totalSteps = 0,
    reversibleSteps = 0,
    landauerEfficiency = 0,
    entropyWaste = 0,
    totalEnergyMicrojoules = 0,
    isActive = false
}: LandauerMeterProps) {
    // Get efficiency color
    const getEfficiencyColor = (efficiency: number): string => {
        if (efficiency >= 90) return 'text-axiom-success';
        if (efficiency >= 70) return 'text-cyber-cyan';
        if (efficiency >= 50) return 'text-axiom-warning';
        return 'text-axiom-red';
    };

    const efficiencyColor = getEfficiencyColor(landauerEfficiency);
    const efficiencyGradient = landauerEfficiency >= 90
        ? 'from-axiom-success to-cyber-cyan'
        : landauerEfficiency >= 70
            ? 'from-cyber-cyan to-neon-purple'
            : landauerEfficiency >= 50
                ? 'from-axiom-warning to-axiom-success'
                : 'from-axiom-red to-axiom-warning';

    return (
        <div className="holographic-panel p-6 rounded-2xl relative overflow-hidden border-axiom-success/30">
            {/* Background Pulse (when active) */}
            {isActive && landauerEfficiency >= 90 && (
                <div className="absolute inset-0 bg-gradient-to-br from-axiom-success/5 to-cyber-cyan/5 animate-pulse" />
            )}

            {/* Header */}
            <div className="relative z-10 mb-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Recycle className={`w-5 h-5 ${isActive ? 'text-axiom-success animate-spin-slow' : 'text-gray-500'}`} />
                        <h3 className="font-orbitron text-lg text-white">Zero-Energy Computing</h3>
                    </div>
                    {isActive && landauerEfficiency >= 90 && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-axiom-success/10 border border-axiom-success/30 rounded">
                            <TrendingDown className="w-3 h-3 text-axiom-success" />
                            <span className="text-xs font-mono text-axiom-success">REVERSIBLE</span>
                        </div>
                    )}
                </div>
                <p className="text-xs font-rajdhani text-white/60">Information-Preserving Execution</p>
            </div>

            {/* Landauer Efficiency Gauge */}
            <div className="relative z-10 mb-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-rajdhani text-white/60 uppercase tracking-wider">Landauer Efficiency</span>
                        <div className="group relative">
                            <Info className="w-3 h-3 text-white/40 cursor-help" />
                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-dark-void/95 border border-white/10 rounded text-xs text-white/80">
                                % of operations that preserved information (no bit erasure). 100% = Perfect reversibility, zero heat generation.
                            </div>
                        </div>
                    </div>
                    <span className={`text-sm font-mono font-bold ${efficiencyColor}`}>
                        {landauerEfficiency.toFixed(1)}%
                    </span>
                </div>
                <div className="w-full h-3 bg-dark-void/50 rounded-full overflow-hidden border border-white/10">
                    <div
                        className={`h-full transition-all duration-500 bg-gradient-to-r ${efficiencyGradient}`}
                        style={{
                            width: `${landauerEfficiency}%`,
                            boxShadow: landauerEfficiency >= 90 ? '0 0 10px rgba(34, 197, 94, 0.5)' : 'none'
                        }}
                    />
                </div>
            </div>

            {/* Entropy Waste Meter (Inverse) */}
            <div className="relative z-10 mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-rajdhani text-white/60 uppercase tracking-wider">Entropy Waste</span>
                    <span className={`text-sm font-mono font-bold ${entropyWaste === 0 ? 'text-axiom-success' :
                            entropyWaste < 10 ? 'text-cyber-cyan' :
                                entropyWaste < 30 ? 'text-axiom-warning' :
                                    'text-axiom-red'
                        }`}>
                        {entropyWaste.toFixed(1)}%
                    </span>
                </div>
                <div className="w-full h-2 bg-dark-void/50 rounded-full overflow-hidden border border-white/10">
                    <div
                        className={`h-full transition-all duration-500 ${entropyWaste === 0 ? 'bg-axiom-success' :
                                entropyWaste < 10 ? 'bg-cyber-cyan' :
                                    entropyWaste < 30 ? 'bg-axiom-warning' :
                                        'bg-axiom-red'
                            }`}
                        style={{ width: `${entropyWaste}%` }}
                    />
                </div>
            </div>

            {/* Statistics Grid */}
            <div className="relative z-10 grid grid-cols-2 gap-4 p-4 bg-dark-void/50 rounded-xl border border-white/5">
                {/* Total Steps */}
                <div>
                    <div className="text-xs font-rajdhani text-white/60 mb-1">Total Steps</div>
                    <div className="text-xl font-mono font-bold text-white">
                        {totalSteps.toLocaleString()}
                    </div>
                </div>

                {/* Reversible Steps */}
                <div>
                    <div className="text-xs font-rajdhani text-white/60 mb-1">Reversible</div>
                    <div className="text-xl font-mono font-bold text-axiom-success">
                        {reversibleSteps.toLocaleString()}
                    </div>
                </div>

                {/* Energy Saved */}
                <div className="col-span-2">
                    <div className="text-xs font-rajdhani text-white/60 mb-1">Energy Consumed (Landauer Limit)</div>
                    <div className="text-lg font-mono font-bold text-neon-purple">
                        {totalEnergyMicrojoules < 0.001
                            ? `${(totalEnergyMicrojoules * 1000).toExponential(2)} nJ`
                            : `${totalEnergyMicrojoules.toExponential(2)} μJ`
                        }
                    </div>
                    {landauerEfficiency >= 99 && (
                        <div className="mt-2 text-xs font-rajdhani text-axiom-success">
                            ✓ Information Preserved · Zero Heat Generated
                        </div>
                    )}
                </div>
            </div>

            {/* Inactive State */}
            {!isActive && (
                <div className="absolute inset-0 bg-dark-void/80 flex items-center justify-center z-20 rounded-2xl">
                    <div className="text-center">
                        <Recycle className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                        <p className="text-xs font-rajdhani text-gray-500">Ledger Idle</p>
                    </div>
                </div>
            )}
        </div>
    );
}
