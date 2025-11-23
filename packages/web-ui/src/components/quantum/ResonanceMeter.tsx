'use client';

import React, { useState, useEffect } from 'react';
import { Zap, Cpu, Gauge, TrendingUp } from 'lucide-react';

interface ResonanceMeterProps {
    photonicLatency?: number; // nanoseconds
    electronicLatency?: number; // nanoseconds
    speedupFactor?: number; // photonic advantage multiplier
    energySavings?: number; // percentage
    resonanceQuality?: number; // 0-100 score
    isActive?: boolean;
}

export default function ResonanceMeter({
    photonicLatency = 0,
    electronicLatency = 0,
    speedupFactor = 1,
    energySavings = 0,
    resonanceQuality = 0,
    isActive = false
}: ResonanceMeterProps) {
    const [animatedSpeedup, setAnimatedSpeedup] = useState(1);
    const [animatedQuality, setAnimatedQuality] = useState(0);

    // Animate values on change
    useEffect(() => {
        if (isActive) {
            const speedupInterval = setInterval(() => {
                setAnimatedSpeedup(prev => {
                    const diff = speedupFactor - prev;
                    return Math.abs(diff) < 0.1 ? speedupFactor : prev + diff * 0.1;
                });
            }, 50);

            const qualityInterval = setInterval(() => {
                setAnimatedQuality(prev => {
                    const diff = resonanceQuality - prev;
                    return Math.abs(diff) < 1 ? resonanceQuality : prev + diff * 0.1;
                });
            }, 50);

            return () => {
                clearInterval(speedupInterval);
                clearInterval(qualityInterval);
            };
        }
    }, [speedupFactor, resonanceQuality, isActive]);

    // Format latency for display
    const formatLatency = (ns: number): string => {
        if (ns < 1) return `${(ns * 1000).toFixed(2)} ps`; // picoseconds
        if (ns < 1000) return `${ns.toFixed(2)} ns`;
        if (ns < 1000000) return `${(ns / 1000).toFixed(2)} μs`;
        return `${(ns / 1000000).toFixed(2)} ms`;
    };

    // Get quality color
    const getQualityColor = (quality: number): string => {
        if (quality >= 80) return 'text-cyber-cyan';
        if (quality >= 60) return 'text-axiom-success';
        if (quality >= 40) return 'text-axiom-warning';
        return 'text-axiom-red';
    };

    const qualityColor = getQualityColor(animatedQuality);
    const qualityGradient = animatedQuality >= 80
        ? 'from-cyber-cyan to-neon-purple'
        : animatedQuality >= 60
            ? 'from-axiom-success to-cyber-cyan'
            : animatedQuality >= 40
                ? 'from-axiom-warning to-axiom-success'
                : 'from-axiom-red to-axiom-warning';

    return (
        <div className="holographic-panel p-6 rounded-2xl relative overflow-hidden border-cyber-cyan/30">
            {/* Background Pulse */}
            {isActive && (
                <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/5 to-neon-purple/5 animate-pulse" />
            )}

            {/* Header */}
            <div className="relative z-10 mb-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Gauge className={`w-5 h-5 ${isActive ? 'text-cyber-cyan animate-spin-slow' : 'text-gray-500'}`} />
                        <h3 className="font-orbitron text-lg text-white">Resonance Computing</h3>
                    </div>
                    {isActive && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-neon-purple/10 border border-neon-purple/30 rounded">
                            <Zap className="w-3 h-3 text-neon-purple" />
                            <span className="text-xs font-mono text-neon-purple">PHOTONIC</span>
                        </div>
                    )}
                </div>
                <p className="text-xs font-rajdhani text-white/60">Light-Speed Matrix Processing</p>
            </div>

            {/* Comparison Bars */}
            <div className="relative z-10 mb-6 space-y-3">
                {/* Photonic */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-cyber-cyan">
                            <Zap className="w-3 h-3" />
                            Photonic (Light)
                        </span>
                        <span className="font-mono text-cyber-cyan">{formatLatency(photonicLatency)}</span>
                    </div>
                    <div className="w-full h-3 bg-dark-void/50 rounded-full overflow-hidden border border-white/10">
                        <div
                            className="h-full bg-gradient-to-r from-cyber-cyan to-neon-purple transition-all duration-500"
                            style={{
                                width: electronicLatency > 0 ? `${(photonicLatency / electronicLatency) * 100}%` : '0%',
                                boxShadow: '0 0 10px rgba(0, 240, 255, 0.5)'
                            }}
                        />
                    </div>
                </div>

                {/* Electronic */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-gray-400">
                            <Cpu className="w-3 h-3" />
                            Electronic (Silicon)
                        </span>
                        <span className="font-mono text-gray-400">{formatLatency(electronicLatency)}</span>
                    </div>
                    <div className="w-full h-3 bg-dark-void/50 rounded-full overflow-hidden border border-white/10">
                        <div
                            className="h-full bg-gradient-to-r from-gray-600 to-gray-500 transition-all duration-500"
                            style={{ width: '100%' }}
                        />
                    </div>
                </div>
            </div>

            {/* Speedup Indicator */}
            <div className="relative z-10 mb-4 p-4 bg-dark-void/50 rounded-xl border border-cyber-cyan/20">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-4 h-4 text-neon-purple" />
                            <span className="text-sm font-rajdhani text-white/80">Speedup Factor</span>
                        </div>
                        <div className="text-3xl font-orbitron font-bold text-neon-purple">
                            {animatedSpeedup.toFixed(1)}x
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs font-rajdhani text-white/60 mb-1">Energy Savings</div>
                        <div className="text-xl font-mono font-bold text-axiom-success">
                            {energySavings.toFixed(1)}%
                        </div>
                    </div>
                </div>
            </div>

            {/* Resonance Quality Score */}
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-rajdhani text-white/60 uppercase tracking-wider">Resonance Quality</span>
                    <span className={`text-sm font-mono font-bold ${qualityColor}`}>
                        {Math.round(animatedQuality)}/100
                    </span>
                </div>
                <div className="w-full h-2 bg-dark-void/50 rounded-full overflow-hidden border border-white/10">
                    <div
                        className={`h-full transition-all duration-500 bg-gradient-to-r ${qualityGradient}`}
                        style={{
                            width: `${animatedQuality}%`,
                            boxShadow: animatedQuality >= 80 ? '0 0 10px rgba(0, 240, 255, 0.5)' : 'none'
                        }}
                    />
                </div>
            </div>

            {/* Inactive State */}
            {!isActive && (
                <div className="absolute inset-0 bg-dark-void/80 flex items-center justify-center z-20 rounded-2xl">
                    <div className="text-center">
                        <Gauge className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                        <p className="text-xs font-rajdhani text-gray-500">Resonance Idle</p>
                    </div>
                </div>
            )}
        </div>
    );
}
