'use client';

import { HoloGrid } from '@/components/hologram/HoloGrid';
import { AvatarStage } from '@/components/hologram/AvatarStage';
import { useHologramStore } from '@/stores/hologramStore';
import { Mic, Send } from 'lucide-react';
import { useState } from 'react';

export default function HologramPage() {
    const { setAvatarState } = useHologramStore();
    const [input, setInput] = useState('');

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        setAvatarState('THINKING');

        // Simulate processing
        setTimeout(() => {
            setAvatarState('TALKING');
            setTimeout(() => setAvatarState('IDLE'), 3000);
        }, 1500);

        setInput('');
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white overflow-hidden relative selection:bg-axiom-cyan/30">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#050505] to-[#050505] pointer-events-none" />
            <div className="fixed inset-0 bg-[url('/grid.png')] opacity-5 pointer-events-none" />

            <div className="relative z-10 h-screen flex flex-col lg:flex-row">

                {/* LEFT: The Grid (Workspace) */}
                <div className="flex-1 h-full p-6 overflow-hidden flex flex-col">
                    <header className="mb-6 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                                AXIOM <span className="text-axiom-cyan">HOLO</span>
                            </h1>
                            <p className="text-xs font-mono text-gray-500">v3.5.2 // CONNECTED</p>
                        </div>
                        <div className="flex gap-2">
                            {/* Status Indicators */}
                            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-axiom-cyan flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-axiom-cyan animate-pulse" />
                                ONLINE
                            </div>
                        </div>
                    </header>

                    <div className="flex-1 relative">
                        <HoloGrid />
                    </div>

                    {/* Command Input */}
                    <div className="mt-4 relative">
                        <form onSubmit={handleCommand} className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Command the system..."
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-lg font-mono text-axiom-cyan placeholder-gray-700 focus:outline-none focus:border-axiom-cyan/50 focus:ring-1 focus:ring-axiom-cyan/50 backdrop-blur-xl"
                            />
                            <Mic className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white cursor-pointer transition-colors" />
                            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-axiom-cyan hover:text-white transition-colors">
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* RIGHT: The Avatar (Assistant) */}
                <div className="w-full lg:w-[400px] h-[400px] lg:h-full bg-gradient-to-b from-transparent via-black/20 to-black border-l border-white/5 relative">
                    <div className="absolute top-4 right-4 z-20">
                        <div className="text-right">
                            <h3 className="font-bold text-white">GEMINI</h3>
                            <p className="text-xs text-axiom-cyan font-mono">QUANTUM CORE</p>
                        </div>
                    </div>

                    <AvatarStage />

                    {/* Dialogue Overlay */}
                    <div className="absolute bottom-8 left-8 right-8 p-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl border-l-4 border-l-axiom-cyan">
                        <p className="text-sm text-gray-300 font-mono leading-relaxed">
                            "I am ready, Operator. The grid is active and all systems are nominal. Awaiting your command."
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
