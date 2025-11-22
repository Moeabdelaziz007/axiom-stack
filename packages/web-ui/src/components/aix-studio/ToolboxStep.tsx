import React, { useState, useEffect } from 'react';

const availableTools = {
    'Finance & Trading': ['Binance', 'Bybit', 'Phantom', 'Aave', 'Uniswap'],
    'Social Media': ['Twitter/X', 'Instagram', 'LinkedIn', 'TikTok'],
    'Content Generation': ['GPT-4', 'DALL-E', 'Midjourney', 'Video APIs'],
    'Travel & Booking': ['Booking.com', 'Google Flights', 'Maps', 'TripAdvisor'],
    'Communication': ['Email', 'SMS', 'Slack', 'Discord'],
};

interface ToolboxStepProps {
    onNext: () => void;
    onBack: () => void;
    setAgentData: (data: any) => void;
    agentData: any;
}

const ToolboxStep: React.FC<ToolboxStepProps> = ({ onNext, onBack, setAgentData, agentData }) => {
    const [selectedTools, setSelectedTools] = useState<string[]>(agentData.tools || []);

    const toggleTool = (tool: string) => {
        setSelectedTools(prev =>
            prev.includes(tool)
                ? prev.filter(t => t !== tool)
                : [...prev, tool]
        );
    };

    const handleNext = () => {
        setAgentData((prev: any) => ({ ...prev, tools: selectedTools }));
        onNext();
    };

    return (
        <div>
            <h2 className="text-3xl font-orbitron text-white mb-6">3. The Quantum Toolbox</h2>
            <p className="text-white/60 mb-8 font-rajdhani">
                Select the external tools and APIs your agent needs to execute its missions.
            </p>

            {Object.entries(availableTools).map(([category, tools]) => (
                <div key={category} className="mb-8">
                    <h3 className="text-xl font-rajdhani text-neon-purple mb-4 border-b border-neon-purple/30 pb-2">
                        {category}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {tools.map(tool => {
                            const isSelected = selectedTools.includes(tool);
                            return (
                                <button
                                    key={tool}
                                    onClick={() => toggleTool(tool)}
                                    className={`px-6 py-2.5 rounded-lg font-mono text-sm transition-all duration-200 border-2 
                    ${isSelected
                                            ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan shadow-glow-cyan'
                                            : 'bg-dark-void/50 border-white/10 text-white/70 hover:border-white/50'
                                        }`
                                    }
                                >
                                    {tool}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* Selected Tools Summary */}
            {selectedTools.length > 0 && (
                <div className="glass-card p-6 mb-8 border-l-4 border-cyber-cyan">
                    <h3 className="text-sm font-rajdhani text-cyber-cyan mb-3">
                        Selected Tools ({selectedTools.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {selectedTools.map(tool => (
                            <span key={tool} className="px-3 py-1 bg-cyber-cyan/20 text-cyber-cyan rounded text-sm font-mono">
                                {tool}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex justify-between border-t border-white/10 pt-6">
                <button
                    onClick={onBack}
                    className="px-6 py-3 border border-white/30 text-white/70 rounded-lg hover:bg-white/10 transition-all font-rajdhani"
                >
                    &lt; Back: Identity
                </button>
                <button
                    onClick={handleNext}
                    disabled={selectedTools.length === 0}
                    className="px-6 py-3 bg-neon-purple text-white rounded-lg font-bold hover:bg-neon-purple/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-orbitron"
                >
                    Next: Constitution &gt;
                </button>
            </div>
        </div>
    );
};

export default ToolboxStep;
