'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, ArrowRight } from 'lucide-react';
import HolographicAvatar from '@/components/3d/HolographicAvatar';
import Link from 'next/link';

// Placeholder recommendation logic
const getRecommendation = (intent: string) => {
    const lowerIntent = intent.toLowerCase();
    if (lowerIntent.includes('contract') || lowerIntent.includes('audit') || lowerIntent.includes('bug') || lowerIntent.includes('security')) {
        return { name: 'Dev-Zero', type: 'Agent', role: 'Smart Contract Auditor', link: '/gig-economy?agent=dev-zero' };
    }
    if (lowerIntent.includes('crypto') || lowerIntent.includes('trade') || lowerIntent.includes('arbitrage') || lowerIntent.includes('profit')) {
        return { name: 'Crypto Alpha Squad', type: 'Squad', role: 'Arbitrage & Trading', link: '/gig-economy?squad=alpha' };
    }
    if (lowerIntent.includes('social') || lowerIntent.includes('twitter') || lowerIntent.includes('growth') || lowerIntent.includes('marketing')) {
        return { name: 'Viral Growth Team', type: 'Squad', role: 'Social Media Growth', link: '/gig-economy?squad=viral' };
    }
    if (lowerIntent.includes('legal') || lowerIntent.includes('nda') || lowerIntent.includes('law')) {
        return { name: 'Lex-Machina', type: 'Agent', role: 'Legal Mentor', link: '/gig-economy?agent=lex' };
    }
    return null;
};

export default function HeliosChatPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { sender: 'Helios', message: 'Welcome, Quantum User. How can I synchronize your intent with the Axiom ecosystem today?' }
    ]);
    const [recommendation, setRecommendation] = useState<ReturnType<typeof getRecommendation>>(null);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory, isTyping]);

    const handleSend = () => {
        if (input.trim() === '') return;

        const userMessage = input;
        setChatHistory(prev => [...prev, { sender: 'User', message: userMessage }]);
        setInput('');
        setIsTyping(true);
        setRecommendation(null);

        // Simulate AI processing delay
        setTimeout(() => {
            const rec = getRecommendation(userMessage);
            setRecommendation(rec);
            setIsTyping(false);

            if (rec) {
                setChatHistory(prev => [...prev, { sender: 'Helios', message: `I have analyzed your request. Based on your parameters, I recommend deploying the ${rec.name} unit.` }]);
            } else {
                setChatHistory(prev => [...prev, { sender: 'Helios', message: 'My analysis is inconclusive. Could you specify your objective with more technical parameters?' }]);
            }
        }, 1500);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">

            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 md:w-96 holographic-panel border border-neon-purple/50 overflow-hidden shadow-[0_0_50px_rgba(189,0,255,0.2)] animate-fade-in-up flex flex-col">

                    {/* Header */}
                    <div className="bg-neon-purple/10 p-4 border-b border-neon-purple/20 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8">
                                <HolographicAvatar className="w-full h-full" />
                            </div>
                            <div>
                                <h3 className="text-sm font-orbitron text-white font-bold">HELIOS</h3>
                                <p className="text-[10px] text-neon-purple font-mono">TALENT AGENT v1.0</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Display */}
                    <div className="h-64 overflow-y-auto p-4 space-y-4 bg-dark-void/80">
                        {chatHistory.map((chat, index) => (
                            <div key={index} className={`flex ${chat.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-xl text-sm font-rajdhani ${chat.sender === 'User'
                                        ? 'bg-cyber-cyan/10 text-white border border-cyber-cyan/20 rounded-tr-none'
                                        : 'bg-neon-purple/10 text-white border border-neon-purple/20 rounded-tl-none'
                                    }`}>
                                    {chat.message}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-neon-purple/10 text-neon-purple border border-neon-purple/20 p-3 rounded-xl rounded-tl-none flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-bounce delay-75"></span>
                                    <span className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-bounce delay-150"></span>
                                </div>
                            </div>
                        )}

                        {recommendation && !isTyping && (
                            <div className="mt-2 animate-fade-in">
                                <div className="bg-holo-blue/10 border border-holo-blue/30 rounded-xl p-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs text-holo-blue font-bold uppercase tracking-wider">Recommendation</span>
                                        <Sparkles className="w-3 h-3 text-holo-blue" />
                                    </div>
                                    <p className="text-white font-bold font-orbitron text-sm mb-1">{recommendation.name}</p>
                                    <p className="text-white/60 text-xs mb-3">{recommendation.role} ({recommendation.type})</p>
                                    <Link href={recommendation.link} className="block w-full py-2 bg-holo-blue/20 hover:bg-holo-blue/30 border border-holo-blue/50 rounded-lg text-center text-xs text-holo-blue font-bold transition flex items-center justify-center gap-1">
                                        View Blueprint <ArrowRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-dark-void border-t border-white/10 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="State your objective..."
                            className="hud-input flex-grow text-white text-sm font-rajdhani placeholder:text-white/20"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="p-2 bg-neon-purple text-white rounded-lg hover:bg-neon-purple/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Helios Floating Button (Start of the interaction) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(189,0,255,0.4)] transition-all duration-300 hover:scale-105 border-2 ${isOpen ? 'bg-dark-void border-neon-purple' : 'bg-dark-void/80 border-neon-purple/50 hover:border-neon-purple'}`}
            >
                <div className="w-12 h-12 relative">
                    <HolographicAvatar />
                    {!isOpen && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-axiom-red rounded-full border-2 border-dark-void animate-pulse"></span>
                    )}
                </div>
            </button>
        </div>
    );
}
