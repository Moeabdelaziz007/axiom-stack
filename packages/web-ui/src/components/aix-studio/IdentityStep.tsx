import React, { useState, useEffect } from 'react';

interface IdentityStepProps {
    onNext: () => void;
    onBack: () => void;
    setAgentData: (data: any) => void;
    agentData: any;
}

const archetypes = [
    'Content Creator',
    'DeFi Trader',
    'Travel Assistant',
    'Customer Support',
    'Data Analyst',
    'Custom'
];

const IdentityStep: React.FC<IdentityStepProps> = ({ onNext, onBack, setAgentData, agentData }) => {
    const [name, setName] = useState(agentData.name || '');
    const [archetype, setArchetype] = useState(agentData.role || archetypes[0]);
    const [riskLevel, setRiskLevel] = useState(agentData.riskLevel || 50);

    const handleNext = () => {
        setAgentData((prev: any) => ({
            ...prev,
            name,
            role: archetype,
            riskLevel
        }));
        onNext();
    };

    return (
        <div>
            <h2 className="text-3xl font-orbitron text-white mb-6">2. Identity & Persona</h2>
            <p className="text-white/60 mb-8 font-rajdhani">
                Define who your agent is and how it should behave
            </p>

            {/* Agent Name */}
            <div className="mb-6">
                <label className="block text-sm font-rajdhani text-white/80 mb-2">
                    Agent Name
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Alpha Trader X"
                    className="w-full px-4 py-3 bg-dark-void/50 border border-cyber-cyan/30 rounded-lg text-white placeholder-white/30 focus:border-cyber-cyan focus:outline-none focus:shadow-glow-cyan transition-all font-rajdhani"
                />
            </div>

            {/* Role/Archetype */}
            <div className="mb-6">
                <label className="block text-sm font-rajdhani text-white/80 mb-2">
                    Role / Archetype
                </label>
                <select
                    value={archetype}
                    onChange={(e) => setArchetype(e.target.value)}
                    className="w-full px-4 py-3 bg-dark-void/50 border border-cyber-cyan/30 rounded-lg text-white focus:border-cyber-cyan focus:outline-none focus:shadow-glow-cyan transition-all font-rajdhani"
                >
                    {archetypes.map(arch => (
                        <option key={arch} value={arch} className="bg-dark-void">
                            {arch}
                        </option>
                    ))}
                </select>
            </div>

            {/* Risk Level Slider */}
            <div className="mb-8">
                <label className="block text-sm font-rajdhani text-white/80 mb-2">
                    Risk Tolerance: <span className="text-cyber-cyan font-bold">{riskLevel}%</span>
                </label>
                <div className="relative">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={riskLevel}
                        onChange={(e) => setRiskLevel(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider-cyber"
                        style={{
                            background: `linear-gradient(to right, #00FFFF ${riskLevel}%, rgba(255,255,255,0.1) ${riskLevel}%)`
                        }}
                    />
                    <div className="flex justify-between text-xs text-white/50 mt-2 font-rajdhani">
                        <span>Low Risk</span>
                        <span>Medium</span>
                        <span>High Risk</span>
                    </div>
                </div>
            </div>

            {/* Preview Card */}
            <div className="glass-card p-6 mb-8 border-l-4 border-neon-purple">
                <h3 className="text-sm font-rajdhani text-neon-purple mb-3">Preview</h3>
                <div className="space-y-2 text-white/80 font-rajdhani">
                    <p><span className="text-white/50">Name:</span> {name || 'Not set'}</p>
                    <p><span className="text-white/50">Role:</span> {archetype}</p>
                    <p><span className="text-white/50">Risk Level:</span> {riskLevel}%</p>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between border-t border-white/10 pt-6">
                <button
                    onClick={onBack}
                    className="px-6 py-3 border border-white/30 text-white/70 rounded-lg hover:bg-white/10 transition-all font-rajdhani"
                >
                    &lt; Back: Template
                </button>
                <button
                    onClick={handleNext}
                    disabled={!name}
                    className="px-6 py-3 bg-cyber-cyan text-dark-void rounded-lg font-bold hover:bg-cyber-cyan/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-orbitron"
                >
                    Next: Toolbox &gt;
                </button>
            </div>
        </div>
    );
};

export default IdentityStep;
