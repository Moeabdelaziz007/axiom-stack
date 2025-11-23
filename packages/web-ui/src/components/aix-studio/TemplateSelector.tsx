import React from 'react';
import { Sparkles, Zap, Globe } from 'lucide-react';

interface TemplateSelectorProps {
    onNext: () => void;
    setAgentData: (data: any) => void;
}

const templates = [
    {
        id: 'content-creator',
        name: 'Content Creator AI',
        role: 'Content Strategy & Social Media',
        description: 'Generates engaging content for social media, blogs, and video scripts',
        icon: Sparkles,
        color: 'cyber-cyan',
        tools: ['YouTube API', 'NotebookLLM', 'Imagen 3', 'Gemini 1.5 Pro'],
        riskLevel: 30
    },
    {
        id: 'defi-trader',
        name: 'DeFi Trader AI',
        role: 'Crypto Trading & Flash Loans',
        description: 'Executes crypto trades and flash loan arbitrage strategies',
        icon: Zap,
        color: 'neon-purple',
        tools: ['Binance', 'Phantom', 'Aave'],
        riskLevel: 80
    },
    {
        id: 'travel-assistant',
        name: 'Travel Assistant AI',
        role: 'Trip Planning & Booking',
        description: 'Plans itineraries, books flights, and manages travel logistics',
        icon: Globe,
        color: 'holo-blue',
        tools: ['Open-Meteo', 'ExchangeRate-API', 'Google Flights', 'Maps'],
        riskLevel: 20
    }
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onNext, setAgentData }) => {
    const handleSelectTemplate = (template: typeof templates[0]) => {
        setAgentData({
            template: template.id,
            name: template.name,
            role: template.role,
            tools: template.tools,
            riskLevel: template.riskLevel
        });
        onNext();
    };

    const handleStartFromScratch = () => {
        setAgentData({ template: 'custom' });
        onNext();
    };

    return (
        <div>
            <h2 className="text-3xl font-orbitron text-white mb-6">1. Choose Your Starting Point</h2>
            <p className="text-white/60 mb-8 font-rajdhani">
                Start with a pre-configured template or build from scratch
            </p>

            {/* Template Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {templates.map((template) => {
                    const Icon = template.icon;
                    return (
                        <button
                            key={template.id}
                            onClick={() => handleSelectTemplate(template)}
                            className="glass-card p-6 text-left hover:scale-105 transition-all duration-300 group border-2 border-transparent hover:border-cyber-cyan/50"
                        >
                            <div className={`w-12 h-12 rounded-lg bg-${template.color}/20 border border-${template.color}/50 flex items-center justify-center mb-4 group-hover:shadow-glow-cyan transition-shadow`}>
                                <Icon className={`w-6 h-6 text-${template.color}`} />
                            </div>

                            <h3 className="text-xl font-orbitron text-white mb-2">{template.name}</h3>
                            <p className="text-sm text-white/70 mb-4 font-rajdhani">{template.description}</p>

                            <div className="flex flex-wrap gap-2 text-xs mb-3">
                                {template.tools.slice(0, 3).map(tool => (
                                    <span key={tool} className="px-2 py-1 bg-white/10 rounded text-white/80">
                                        {tool}
                                    </span>
                                ))}
                                {template.tools.length > 3 && (
                                    <span className="px-2 py-1 bg-white/10 rounded text-white/80">
                                        +{template.tools.length - 3}
                                    </span>
                                )}
                            </div>

                            <div className="text-xs text-white/50 font-rajdhani">
                                Risk Level: {template.riskLevel}%
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Custom Option */}
            <div className="border-t border-white/10 pt-6">
                <button
                    onClick={handleStartFromScratch}
                    className="w-full glass-card p-6 text-center hover:bg-white/5 transition-all duration-300 border-2 border-dashed border-white/20 hover:border-cyber-cyan/50"
                >
                    <Sparkles className="w-8 h-8 text-cyber-cyan mx-auto mb-3" />
                    <h3 className="text-xl font-orbitron text-white mb-2">Start from Scratch</h3>
                    <p className="text-sm text-white/60 font-rajdhani">
                        Build a completely custom agent with your own configuration
                    </p>
                </button>
            </div>
        </div>
    );
};

export default TemplateSelector;
