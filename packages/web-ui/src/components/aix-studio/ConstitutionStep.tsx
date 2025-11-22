import React, { useState } from 'react';
import { Shield, AlertTriangle, Terminal, Brain, Users, Activity, Play } from 'lucide-react';
import ConstitutionCheckModal from '@/components/common/ConstitutionCheckModal';

interface ConstitutionStepProps {
    onNext: () => void;
    onBack: () => void;
    setAgentData: (data: any) => void;
    agentData: any;
}

const ConstitutionStep: React.FC<ConstitutionStepProps> = ({ onNext, onBack, setAgentData, agentData }) => {
    const [showConstitutionCheck, setShowConstitutionCheck] = useState(false);
    const [isConstitutionChecked, setIsConstitutionChecked] = useState(false);
    
    // AIX DNA: Reasoning Protocol (formerly System Prompt)
    const [reasoningProtocol, setReasoningProtocol] = useState(agentData.reasoningProtocol ||
        `// Define your agent's decision-making flow here.
// Example:
// 1. Analyze market structure
// 2. Verify liquidity
// 3. Execute if Risk/Reward > 3.0`);

    // AIX DNA: Traits
    const [riskTolerance, setRiskTolerance] = useState(agentData.traits?.riskTolerance || 0.5);
    const [tone, setTone] = useState(agentData.traits?.tone || 'professional');
    const [postingFrequency, setPostingFrequency] = useState(agentData.traits?.postingFrequency || 'medium');

    // AIX DNA: Collaboration Layer
    const [collaborators, setCollaborators] = useState<string[]>(agentData.collaborationLayer || []);

    const availableCollaborators = [
        { id: 'MarketSentimentAgent', name: 'Market Sentiment AI' },
        { id: 'OnChainAnalyst', name: 'On-Chain Analyst' },
        { id: 'SocialListenerAgent', name: 'Social Listener' },
        { id: 'RiskGuardian', name: 'Risk Guardian' }
    ];

    const toggleCollaborator = (id: string) => {
        setCollaborators(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const handleNext = () => {
        setAgentData((prev: any) => ({
            ...prev,
            reasoningProtocol,
            traits: {
                riskTolerance,
                tone,
                postingFrequency
            },
            collaborationLayer: collaborators,
            // Legacy support for safety parameters if needed by specific tools
            parameters: {
                maxSlippage: riskTolerance * 5, // Derived from risk tolerance
                stopLoss: (1 - riskTolerance) * 10 // Derived from risk tolerance
            }
        }));
        onNext();
    };

    return (
        <div>
            <h2 className="text-3xl font-orbitron text-white mb-6">4. AIX DNA Configuration</h2>
            <p className="text-white/60 mb-8 font-rajdhani">
                Define the genetic code of your agent: its reasoning, personality traits, and collaboration network.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Reasoning Protocol */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Brain className="w-5 h-5 text-cyber-cyan" />
                        <h3 className="text-xl font-orbitron text-white">Reasoning Protocol</h3>
                    </div>

                    <div className="relative">
                        <textarea
                            value={reasoningProtocol}
                            onChange={(e) => setReasoningProtocol(e.target.value)}
                            className="w-full h-96 bg-dark-void/80 border border-cyber-cyan/30 rounded-xl p-6 text-white/90 font-mono text-sm focus:border-cyber-cyan focus:shadow-glow-cyan focus:outline-none transition-all resize-none leading-relaxed"
                            placeholder="// Define the agent's decision-making logic..."
                        />
                        <div className="absolute bottom-4 right-4 text-xs text-white/30 font-mono">
                            {reasoningProtocol.length} chars
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <p className="text-xs text-white/50 font-rajdhani">
                            * This protocol defines how the agent processes information and makes decisions.
                        </p>
                        <button
                            onClick={() => setShowConstitutionCheck(true)}
                            className="plasma-button px-4 py-2 text-xs flex items-center gap-2"
                        >
                            <Play className="w-3 h-3" />
                            Run Constitution Check
                        </button>
                    </div>
                </div>

                {/* Right Column: Traits & Collaboration */}
                <div className="space-y-8">

                    {/* Traits Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Activity className="w-5 h-5 text-neon-purple" />
                            <h3 className="text-xl font-orbitron text-white">Genetic Traits</h3>
                        </div>

                        <div className="glass-card p-6 space-y-6">
                            {/* Risk Tolerance */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-rajdhani text-white/80">Risk Tolerance</label>
                                    <span className="text-sm font-mono text-cyber-cyan">{(riskTolerance * 100).toFixed(0)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={riskTolerance}
                                    onChange={(e) => setRiskTolerance(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider-cyber"
                                />
                                <div className="flex justify-between text-xs text-white/40 mt-1 font-rajdhani">
                                    <span>Conservative</span>
                                    <span>Degen</span>
                                </div>
                            </div>

                            {/* Tone */}
                            <div>
                                <label className="block text-sm font-rajdhani text-white/80 mb-2">Communication Tone</label>
                                <select
                                    value={tone}
                                    onChange={(e) => setTone(e.target.value)}
                                    className="w-full bg-dark-void border border-white/20 rounded-lg p-3 text-white font-rajdhani focus:border-neon-purple focus:outline-none"
                                >
                                    <option value="professional">Professional & Analytical</option>
                                    <option value="friendly">Friendly & Helpful</option>
                                    <option value="witty">Witty & Sarcastic</option>
                                    <option value="degen">Crypto Degen (Slang)</option>
                                </select>
                            </div>

                            {/* Posting Frequency */}
                            <div>
                                <label className="block text-sm font-rajdhani text-white/80 mb-2">Activity Frequency</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['low', 'medium', 'high'].map((freq) => (
                                        <button
                                            key={freq}
                                            onClick={() => setPostingFrequency(freq)}
                                            className={`py-2 rounded-lg text-sm font-rajdhani border transition-all uppercase ${postingFrequency === freq
                                                ? 'bg-white/10 border-white text-white'
                                                : 'bg-transparent border-white/10 text-white/50 hover:border-white/30'
                                                }`}
                                        >
                                            {freq}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Collaboration Layer */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="w-5 h-5 text-holo-blue" />
                            <h3 className="text-xl font-orbitron text-white">Collaboration Layer</h3>
                        </div>

                        <div className="glass-card p-4 space-y-2">
                            <p className="text-xs text-white/50 font-rajdhani mb-2">Select sub-agents for Quantum Synchronization:</p>
                            {availableCollaborators.map(collab => (
                                <button
                                    key={collab.id}
                                    onClick={() => toggleCollaborator(collab.id)}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${collaborators.includes(collab.id)
                                            ? 'bg-holo-blue/20 border-holo-blue text-white'
                                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                                        }`}
                                >
                                    <span className="font-rajdhani">{collab.name}</span>
                                    {collaborators.includes(collab.id) && <div className="w-2 h-2 rounded-full bg-holo-blue shadow-[0_0_10px_#00f0ff]"></div>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Success/Warning Box */}
                    <div className={`${isConstitutionChecked ? 'bg-axiom-success/10 border-axiom-success/30' : 'bg-axiom-red/10 border-axiom-red/30'} border rounded-xl p-4 flex gap-3 items-start`}>
                        {isConstitutionChecked ? (
                            <>
                                <Shield className="w-6 h-6 text-axiom-success shrink-0" />
                                <div>
                                    <h4 className="text-axiom-success font-bold font-orbitron text-sm mb-1">Secured DNA ✓</h4>
                                    <p className="text-xs text-white/70 font-rajdhani">
                                        Your AIX DNA passed Zentix Governance Protocol v1.2 validation.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <AlertTriangle className="w-6 h-6 text-axiom-red shrink-0" />
                                <div>
                                    <h4 className="text-axiom-red font-bold font-orbitron text-sm mb-1">Governance Check</h4>
                                    <p className="text-xs text-white/70 font-rajdhani">
                                        Your AIX DNA configuration will be validated against the Zentix Governance Protocol v1.2 before minting.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Constitution Check Modal */}
            <ConstitutionCheckModal
                isOpen={showConstitutionCheck}
                onClose={() => setShowConstitutionCheck(false)}
                onSuccess={() => setIsConstitutionChecked(true)}
                agentData={{ reasoningProtocol, traits: { riskTolerance, tone, postingFrequency }, collaborationLayer: collaborators }}
            />

            {/* Navigation */}
            <div className="flex justify-between border-t border-white/10 pt-6 mt-8">
                <button
                    onClick={onBack}
                    className="px-6 py-3 border border-white/30 text-white/70 rounded-lg hover:bg-white/10 transition-all font-rajdhani"
                >
                    &lt; Back: Toolbox
                </button>
                <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-holo-blue text-dark-void rounded-lg font-bold hover:bg-holo-blue/90 transition-all font-orbitron"
                >
                    Next: Mint & Deploy &gt;
                </button>
            </div>
        </div>
    );
};

export default ConstitutionStep;
