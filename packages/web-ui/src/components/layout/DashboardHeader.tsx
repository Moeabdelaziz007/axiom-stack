'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function DashboardHeader() {
    return (
        <header className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold font-display uppercase tracking-widest text-white mb-2">
                    Mission Control
                </h1>
                <p className="text-gray-400 font-light">
                    System Status: <span className="text-axiom-cyan font-mono">OPERATIONAL</span>
                </p>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-axiom-cyan/10 border border-axiom-cyan/20">
                    <div className="w-2 h-2 rounded-full bg-axiom-cyan animate-pulse-slow" />
                    <span className="text-xs font-mono text-axiom-cyan">SYSTEM ONLINE</span>
                </div>
            </div>
        </header>
    );
}
