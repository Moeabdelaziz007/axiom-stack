'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/common/Toast';
import { useRouter } from 'next/navigation';

interface WizardState {
    step: number;
    archetype: 'TRADER' | 'ANALYST' | 'TRAVELER';
    identity: {
        name: string;
        ticker: string;
        description: string;
        riskTolerance: number;
    };
    constitution: {
        stopLoss: number;
        maxSlippage: number;
    };
    channels: {
        telegram?: { botToken: string; active: boolean };
        whatsapp?: { phoneId: string; accessToken: string; active: boolean };
    };
    knowledge: string[];
    isSpawning: boolean;
    error: string | null;
}

const INITIAL_STATE: WizardState = {
    step: 1,
    archetype: 'TRADER',
    identity: {
        name: '',
        ticker: '',
        description: '',
        riskTolerance: 50,
    },
    constitution: {
        stopLoss: 10,
        maxSlippage: 1,
    },
    channels: {},
    knowledge: [],
    isSpawning: false,
    error: null,
};

const ARCHETYPES = [
    {
        id: 'TRADER',
        title: 'Quantum Trader',
        icon: '📈',
        description: 'Specialized in DeFi operations, risk management, and portfolio growth.',
        gradient: 'from-green-400 to-emerald-600',
        color: 'text-emerald-400'
    },
    {
        id: 'ANALYST',
        title: 'Nexus Analyst',
        icon: '🔍',
        description: 'Deep research, data analysis, and fact-checking capabilities.',
        gradient: 'from-blue-400 to-indigo-600',
        color: 'text-blue-400'
    },
    {
        id: 'TRAVELER',
        title: 'Nomad Voyager',
        icon: '✈️',
        description: 'Logistics planning, route optimization, and travel coordination.',
        gradient: 'from-orange-400 to-pink-600',
        color: 'text-orange-400'
    }
] as const;

export function CreateAgentWizard() {
    const [state, setState] = useState<WizardState>(INITIAL_STATE);
    const { addToast } = useToast();
    const router = useRouter();

    const updateIdentity = (field: keyof WizardState['identity'], value: any) => {
        setState(prev => ({
            ...prev,
            identity: { ...prev.identity, [field]: value }
        }));
    };

    const nextStep = () => setState(prev => ({ ...prev, step: prev.step + 1 }));
    const prevStep = () => setState(prev => ({ ...prev, step: prev.step - 1 }));

    const spawnAgent = async () => {
        setState(prev => ({ ...prev, isSpawning: true, error: null }));

        try {
            const factoryUrl = process.env.NEXT_PUBLIC_AGENT_FACTORY_URL;

            if (!factoryUrl) {
                throw new Error('NEXT_PUBLIC_AGENT_FACTORY_URL is not configured. Please check your .env.local file.');
            }

            // Construct SpawnRequest payload matching Backend Schema
            const spawnRequest = {
                type: 'TradingAgent', // Default type for now
                archetype: state.archetype,
                config: {
                    manifest: {
                        persona: {
                            name: state.identity.name,
                            description: state.identity.description,
                            tone: 'neutral', // Default
                            risk_tolerance: state.identity.riskTolerance > 70 ? 'high' : state.identity.riskTolerance > 30 ? 'medium' : 'low',
                        },
                        genesis_rules: {
                            stop_loss_pct: state.constitution.stopLoss,
                            max_slippage: state.constitution.maxSlippage,
                            allowlist: ['SOL', 'USDC'], // Default allowlist
                        },
                        knowledge_base: {
                            sources: state.knowledge,
                            grounding_required: true,
                        },
                        capabilities: ['trade', 'analyze'], // Default capabilities
                    },
                    channels: {
                        telegram: state.channels.telegram?.active ? { botToken: state.channels.telegram.botToken, active: true } : undefined,
                        whatsapp: state.channels.whatsapp?.active ? { phoneId: state.channels.whatsapp.phoneId, accessToken: state.channels.whatsapp.accessToken, active: true } : undefined,
                    }
                }
            };

            console.log('🚀 Spawning Agent with Request:', spawnRequest);

            const response = await fetch(`${factoryUrl}/spawn`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(spawnRequest),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: response.statusText }));
                throw new Error(errorData.error || `Spawn failed: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('✅ Agent spawned successfully:', result);

            // Show success toast
            addToast(`Agent "${state.identity.name}" deployed on Solana Devnet!`, 'success');

            // Redirect to agent's Mission Control
            const agentId = result.agentId || result.agent_id || 'unknown';
            router.push(`/agents/${agentId}`);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            console.error('❌ Spawn failed:', error);

            setState(prev => ({
                ...prev,
                isSpawning: false,
                error: errorMessage
            }));

            addToast(`Spawn failed: ${errorMessage}`, 'error');
        }
    };

    if (state.isSpawning) {
        return (
            <div className="w-full max-w-4xl mx-auto p-6 text-center">
                <div className="bg-black border border-axiom-green/50 p-12 rounded-xl font-mono text-axiom-green shadow-[0_0_50px_rgba(0,255,0,0.2)]">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                        className="text-4xl mb-8"
                    >
                        INITIALIZING NEURAL LINK...
                    </motion.div>
                    <div className="space-y-2 text-left max-w-md mx-auto opacity-80">
                        <p>{'>'} Uploading consciousness...</p>
                        <p>{'>'} Verifying blockchain signatures...</p>
                        <p>{'>'} Establishing connection to Solana Devnet...</p>
                        <p>{'>'} Minting Agent Identity Token...</p>
                    </div>

                    {state.error && (
                        <div className="mt-8 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
                            <p className="font-bold mb-2">ERROR: NEURAL LINK FAILED</p>
                            <p className="text-sm">{state.error}</p>
                            <button
                                onClick={() => setState(prev => ({ ...prev, isSpawning: false, error: null }))}
                                className="mt-4 px-4 py-2 bg-red-500/30 hover:bg-red-500/50 rounded transition-colors"
                            >
                                Return to Configuration
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <div className="bg-axiom-dark/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                {/* Progress Bar */}
                <div className="h-1 bg-white/5 w-full">
                    <motion.div
                        className="h-full bg-gradient-to-r from-axiom-blue to-axiom-purple"
                        initial={{ width: '0%' }}
                        animate={{ width: `${(state.step / 5) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                <div className="p-8">
                    <AnimatePresence mode="wait">
                        {/* STEP 1: ARCHETYPE SELECTION */}
                        {state.step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-bold text-white mb-2">Select Agent Archetype</h2>
                                <p className="text-gray-400 mb-6">Choose the specialized core for your agent.</p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {ARCHETYPES.map((arch) => (
                                        <div
                                            key={arch.id}
                                            onClick={() => setState(prev => ({ ...prev, archetype: arch.id as any }))}
                                            className={`cursor-pointer relative p-6 rounded-xl border transition-all duration-300 ${state.archetype === arch.id
                                                ? 'bg-white/10 border-axiom-blue shadow-[0_0_20px_rgba(56,189,248,0.2)]'
                                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                                }`}
                                        >
                                            <div className="text-4xl mb-4">{arch.icon}</div>
                                            <h3 className={`text-lg font-bold mb-2 ${arch.color}`}>{arch.title}</h3>
                                            <p className="text-sm text-gray-400">{arch.description}</p>

                                            {state.archetype === arch.id && (
                                                <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-axiom-blue shadow-[0_0_10px_#38bdf8]" />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end pt-6">
                                    <button
                                        onClick={nextStep}
                                        className="bg-axiom-blue hover:bg-axiom-blue/80 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        Configure Identity &rarr;
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2: IDENTITY */}
                        {state.step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-bold text-white mb-6">Identity Protocol</h2>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="agentName" className="block text-sm font-medium text-gray-400 mb-1">Agent Name</label>
                                            <input
                                                id="agentName"
                                                type="text"
                                                value={state.identity.name}
                                                onChange={(e) => updateIdentity('name', e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-axiom-blue transition-colors"
                                                placeholder="e.g. Nexus-7"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="agentTicker" className="block text-sm font-medium text-gray-400 mb-1">Ticker</label>
                                            <input
                                                id="agentTicker"
                                                type="text"
                                                value={state.identity.ticker}
                                                onChange={(e) => updateIdentity('ticker', e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-axiom-blue transition-colors"
                                                placeholder="e.g. NX7"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="agentDesc" className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                        <textarea
                                            id="agentDesc"
                                            value={state.identity.description}
                                            onChange={(e) => updateIdentity('description', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-axiom-blue transition-colors h-32 resize-none"
                                            placeholder="Define the agent's primary directive..."
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="riskTolerance" className="block text-sm font-medium text-gray-400 mb-1">
                                            Risk Tolerance: {state.identity.riskTolerance}%
                                        </label>
                                        <input
                                            id="riskTolerance"
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={state.identity.riskTolerance}
                                            onChange={(e) => updateIdentity('riskTolerance', parseInt(e.target.value))}
                                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-axiom-blue"
                                        />
                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                            <span>Conservative</span>
                                            <span>Aggressive</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between pt-6">
                                    <button
                                        onClick={prevStep}
                                        className="text-gray-400 hover:text-white px-6 py-2 font-medium transition-colors"
                                    >
                                        &larr; Back
                                    </button>
                                    <button
                                        onClick={nextStep}
                                        className="bg-axiom-blue hover:bg-axiom-blue/80 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        Configure Constitution &rarr;
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: CONSTITUTION */}
                        {state.step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-bold text-white mb-6">Constitution Parameters</h2>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="stopLoss" className="block text-sm font-medium text-gray-400 mb-1">Stop Loss (%)</label>
                                        <input
                                            id="stopLoss"
                                            type="number"
                                            min="0.1"
                                            step="0.1"
                                            value={state.constitution.stopLoss}
                                            onChange={(e) => setState(prev => ({
                                                ...prev,
                                                constitution: { ...prev.constitution, stopLoss: parseFloat(e.target.value) }
                                            }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-axiom-blue transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="maxSlippage" className="block text-sm font-medium text-gray-400 mb-1">Max Slippage (%)</label>
                                        <input
                                            id="maxSlippage"
                                            type="number"
                                            min="0.1"
                                            step="0.1"
                                            value={state.constitution.maxSlippage}
                                            onChange={(e) => setState(prev => ({
                                                ...prev,
                                                constitution: { ...prev.constitution, maxSlippage: parseFloat(e.target.value) }
                                            }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-axiom-blue transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between pt-6">
                                    <button
                                        onClick={prevStep}
                                        className="text-gray-400 hover:text-white px-6 py-2 font-medium transition-colors"
                                    >
                                        &larr; Back
                                    </button>
                                    <button
                                        onClick={nextStep}
                                        className="bg-axiom-blue hover:bg-axiom-blue/80 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        Configure Channels &rarr;
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 4: CHANNELS */}
                        {state.step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-bold text-white mb-6">Communication Channels</h2>
                                {/* Telegram */}
                                <div className="flex items-center space-x-2">
                                    <label className="text-gray-400">Telegram Bot Token</label>
                                    <input
                                        type="text"
                                        value={state.channels.telegram?.botToken || ''}
                                        onChange={e => setState(prev => ({
                                            ...prev,
                                            channels: { ...prev.channels, telegram: { botToken: e.target.value, active: !!e.target.value } }
                                        }))}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-axiom-blue"
                                        placeholder="e.g. 123456:ABCdef..."
                                    />
                                </div>
                                {/* WhatsApp */}
                                <div className="flex flex-col space-y-2 mt-4">
                                    <label className="text-gray-400">WhatsApp Phone ID</label>
                                    <input
                                        type="text"
                                        value={state.channels.whatsapp?.phoneId || ''}
                                        onChange={e => setState(prev => ({
                                            ...prev,
                                            channels: { ...prev.channels, whatsapp: { phoneId: e.target.value, accessToken: prev.channels.whatsapp?.accessToken || '', active: !!e.target.value } }
                                        }))}
                                        className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-axiom-blue"
                                        placeholder="Phone ID"
                                    />
                                    <label className="text-gray-400">WhatsApp Access Token</label>
                                    <input
                                        type="text"
                                        value={state.channels.whatsapp?.accessToken || ''}
                                        onChange={e => setState(prev => ({
                                            ...prev,
                                            channels: { ...prev.channels, whatsapp: { phoneId: prev.channels.whatsapp?.phoneId || '', accessToken: e.target.value, active: !!e.target.value } }
                                        }))}
                                        className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-axiom-blue"
                                        placeholder="Access Token"
                                    />
                                </div>
                                <div className="flex justify-between pt-6">
                                    <button
                                        onClick={prevStep}
                                        className="text-gray-400 hover:text-white px-6 py-2 font-medium transition-colors"
                                    >
                                        ← Back
                                    </button>
                                    <button
                                        onClick={nextStep}
                                        className="bg-axiom-blue hover:bg-axiom-blue/80 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        Review Protocol →
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 5: REVIEW */}
                        {state.step === 5 && (
                            <motion.div
                                key="step5"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-bold text-white mb-6">Review Protocol Manifest</h2>

                                <div className="bg-black/50 rounded-lg p-6 font-mono text-sm border border-white/10 overflow-auto max-h-96">
                                    <pre className="text-axiom-blue">
                                        {JSON.stringify({
                                            archetype: state.archetype,
                                            identity: state.identity,
                                            constitution: state.constitution,
                                            knowledge: state.knowledge
                                        }, null, 2)}
                                    </pre>
                                </div>

                                <div className="flex justify-between pt-6">
                                    <button
                                        onClick={prevStep}
                                        className="text-gray-400 hover:text-white px-6 py-2 font-medium transition-colors"
                                    >
                                        &larr; Back
                                    </button>
                                    <button
                                        onClick={spawnAgent}
                                        className="bg-gradient-to-r from-axiom-blue to-axiom-purple hover:opacity-90 text-white px-8 py-2 rounded-lg font-bold transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                                    >
                                        INITIALIZE AGENT
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
