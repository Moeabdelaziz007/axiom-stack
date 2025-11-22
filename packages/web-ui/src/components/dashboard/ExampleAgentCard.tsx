'use client';

import React from 'react';

// Define the Agent structure type
interface AgentData {
    name: string;
    role: string;
    status: 'ONLINE' | 'OFFLINE';
    activity: string;
    tools: string[]; // Example: ['Twitter', 'DALL-E', 'GPT-4']
}

const ExampleAgentCard: React.FC<{ agent: AgentData }> = ({ agent }) => {
    const isOnline = agent.status === 'ONLINE';

    return (
        <div className={`glass-card p-6 w-full max-w-sm rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${isOnline ? 'border-cyber-cyan/50 hover:shadow-[0_0_35px_rgba(0,255,255,0.7)]' : ''}`}>

            {/* 3D Holographic Avatar Placeholder */}
            <div className="h-24 bg-holo-blue/20 rounded-lg mb-4 flex items-center justify-center border border-holo-blue/50">
                <span className="text-xl font-orbitron text-holo-blue">3D {agent.name.split(' ')[0]}</span>
            </div>

            <div className="flex justify-between items-start mb-3">
                <h3 className="text-2xl font-orbitron text-white">{agent.name}</h3>

                {/* Status Indicator */}
                <span className={`text-xs font-rajdhani px-3 py-1 rounded-full uppercase ${isOnline ? 'bg-cyber-cyan/20 text-cyber-cyan shadow-glow-cyan' : 'bg-neon-purple/20 text-neon-purple'}`}>
                    {agent.status}
                </span>
            </div>

            <p className="text-sm text-white/70 mb-4">{agent.role}</p>

            {/* Activity Bar */}
            <div className="bg-dark-void/50 p-3 rounded-lg border-l-4 border-neon-purple mb-4">
                <p className="text-xs font-rajdhani text-neon-purple/90">Activity:</p>
                <p className="text-base text-white">{agent.activity}</p>
            </div>

            {/* Tools Section (Simplified) */}
            <div className="flex flex-wrap gap-2 text-xs text-white/80 mb-6">
                <span className="font-bold text-cyber-cyan">Tools:</span>
                {agent.tools.map(tool => (
                    <span key={tool} className="px-2 py-0.5 bg-white/10 rounded-sm">{tool}</span>
                ))}
            </div>

            <button className="w-full py-3 bg-axiom-glow/10 text-axiom-glow font-orbitron border border-axiom-glow/50 rounded-lg hover:bg-axiom-glow/20 transition duration-200">
                View Details &gt;
            </button>

        </div>
    );
};

export default ExampleAgentCard;
