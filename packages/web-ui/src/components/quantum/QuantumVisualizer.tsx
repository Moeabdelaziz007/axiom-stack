'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Zap, Radio } from 'lucide-react';

interface QuantumParticle {
    id: number;
    x: number;
    y: number;
    opacity: number;
    lifespan: number;
    vx: number;
    vy: number;
}

interface QuantumVisualizerProps {
    entropyScore?: number;
    seed?: string;
    source?: string;
    isActive?: boolean;
}

export default function QuantumVisualizer({
    entropyScore = 0,
    seed = '',
    source = 'Awaiting Quantum Vacuum',
    isActive = false
}: QuantumVisualizerProps) {
    const [particles, setParticles] = useState<QuantumParticle[]>([]);
    const canvasRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number | undefined>(undefined);

    // Generate quantum fluctuation particles
    useEffect(() => {
        if (!isActive) {
            setParticles([]);
            return;
        }

        let particleId = 0;
        const maxParticles = 50;

        const createParticle = (): QuantumParticle => {
            return {
                id: particleId++,
                x: Math.random() * 100,
                y: Math.random() * 100,
                opacity: Math.random() * 0.8 + 0.2,
                lifespan: Math.random() * 3000 + 1000, // 1-4 seconds
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            };
        };

        const animate = () => {
            setParticles(prev => {
                // Remove dead particles
                const alive = prev.filter(p => p.lifespan > 0);

                // Update existing particles
                const updated = alive.map(p => ({
                    ...p,
                    x: (p.x + p.vx + 100) % 100,
                    y: (p.y + p.vy + 100) % 100,
                    lifespan: p.lifespan - 16, // ~60fps
                    opacity: Math.max(0, p.opacity * (p.lifespan / (p.lifespan + 100)))
                }));

                // Add new particles if below max
                if (updated.length < maxParticles && Math.random() > 0.7) {
                    updated.push(createParticle());
                }

                return updated;
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isActive]);

    // Soul Signature: First 8 chars of seed displayed in glowing text
    const soulSignature = seed ? seed.substring(0, 16).toUpperCase() : '━━━━━━━━━━━━━━━━';

    return (
        <div className="holographic-panel p-6 rounded-2xl relative overflow-hidden border-cyber-cyan/30">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10">
                <div className="grid-background"></div>
            </div>

            {/* Header */}
            <div className="relative z-10 mb-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Radio className={`w-5 h-5 ${isActive ? 'text-cyber-cyan animate-pulse' : 'text-gray-500'}`} />
                        <h3 className="font-orbitron text-lg text-white">Quantum Vacuum Interface</h3>
                    </div>
                    {isActive && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded">
                            <Zap className="w-3 h-3 text-cyber-cyan" />
                            <span className="text-xs font-mono text-cyber-cyan">LIVE</span>
                        </div>
                    )}
                </div>
                <p className="text-xs font-rajdhani text-white/60">{source}</p>
            </div>

            {/* Particle Fluctuation Canvas */}
            <div
                ref={canvasRef}
                className="relative w-full h-48 bg-dark-void/50 rounded-xl border border-white/5 mb-4 overflow-hidden"
            >
                {/* Quantum Particles */}
                {particles.map(particle => (
                    <div
                        key={particle.id}
                        className="absolute w-2 h-2 rounded-full bg-cyber-cyan shadow-[0_0_8px_rgba(0,240,255,0.8)]"
                        style={{
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                            opacity: particle.opacity,
                            transition: 'all 16ms linear'
                        }}
                    />
                ))}

                {/* Center Pulse (when active) */}
                {isActive && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full border-2 border-cyber-cyan/20 animate-ping" />
                        <div className="absolute w-16 h-16 rounded-full border-2 border-neon-purple/30 animate-pulse" />
                        <Sparkles className="absolute w-8 h-8 text-cyber-cyan animate-spin-slow" />
                    </div>
                )}

                {/* Inactive State */}
                {!isActive && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <Radio className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                            <p className="text-xs font-rajdhani text-gray-500">Vacuum Idle</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Entropy Score Meter */}
            <div className="relative z-10 mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-rajdhani text-white/60 uppercase tracking-wider">Entropy Quality</span>
                    <span className={`text-sm font-mono font-bold ${entropyScore >= 95 ? 'text-cyber-cyan' :
                        entropyScore >= 70 ? 'text-axiom-warning' :
                            'text-axiom-red'
                        }`}>
                        {entropyScore}%
                    </span>
                </div>
                <div className="w-full h-2 bg-dark-void/50 rounded-full overflow-hidden border border-white/10">
                    <div
                        className={`h-full transition-all duration-500 ${entropyScore >= 95 ? 'bg-gradient-to-r from-cyber-cyan to-neon-purple' :
                            entropyScore >= 70 ? 'bg-axiom-warning' :
                                'bg-axiom-red'
                            }`}
                        style={{
                            width: `${entropyScore}%`,
                            boxShadow: entropyScore >= 95 ? '0 0 10px rgba(0, 240, 255, 0.5)' : 'none'
                        }}
                    />
                </div>
            </div>

            {/* Soul Signature */}
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-neon-purple" />
                    <span className="text-xs font-rajdhani text-white/60 uppercase tracking-wider">Soul Signature</span>
                </div>
                <div className="font-mono text-sm text-cyber-cyan tracking-widest bg-dark-void/50 p-3 rounded-lg border border-cyber-cyan/20 hover:border-cyber-cyan/50 transition-all">
                    <div className="flex flex-wrap gap-1">
                        {soulSignature.split('').map((char, i) => (
                            <span
                                key={i}
                                className="inline-block animate-pulse"
                                style={{
                                    animationDelay: `${i * 50}ms`,
                                    textShadow: seed ? '0 0 8px rgba(0, 240, 255, 0.8)' : 'none',
                                    opacity: seed ? 1 : 0.3
                                }}
                            >
                                {char}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Holographic Glow Overlay */}
            {isActive && (
                <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/5 to-neon-purple/5 pointer-events-none animate-pulse" />
            )}
        </div>
    );
}
