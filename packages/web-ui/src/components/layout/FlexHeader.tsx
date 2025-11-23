'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, Wallet, Bell } from 'lucide-react';
import { WalletButton } from '@/components/wallet/WalletButton';
import Link from 'next/link';

export default function FlexHeader() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-dark-void/80 backdrop-blur-md border-b border-white/10 py-3' : 'bg-transparent py-5'
                    } md:hidden`}
            >
                <div className="container mx-auto px-4 flex items-center justify-between">

                    {/* Logo & Menu Toggle */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-white/80 hover:text-cyan-400 transition-colors"
                        >
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                        <Link href="/dashboard" className="font-orbitron font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                            AXIOM
                        </Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <button className="p-2 text-white/60 hover:text-white relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        </button>
                        <div className="scale-90 origin-right">
                            <WalletButton />
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-40 bg-dark-void/95 backdrop-blur-xl md:hidden pt-24 px-6 animate-fade-in">
                    <nav className="flex flex-col gap-6">
                        <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-2xl font-orbitron text-white hover:text-cyan-400">Dashboard</Link>
                        <Link href="/dollar-ai-studio" onClick={() => setIsMenuOpen(false)} className="text-2xl font-orbitron text-white hover:text-cyan-400">AI Studio</Link>
                        <Link href="/staking" onClick={() => setIsMenuOpen(false)} className="text-2xl font-orbitron text-white hover:text-cyan-400">Staking</Link>
                        <Link href="/settings" onClick={() => setIsMenuOpen(false)} className="text-2xl font-orbitron text-white hover:text-cyan-400">Settings</Link>
                    </nav>
                </div>
            )}
        </>
    );
}
