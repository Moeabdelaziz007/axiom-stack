import React from 'react';
import { motion } from 'framer-motion';
import { AixAgent } from '@/lib/aixLoader';
import { Activity, Cpu, Hash, Shield, Zap } from 'lucide-react';

interface AgentCardProps {
    agent: AixAgent;
    onClick: () => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onClick }) => {
    const { id, name, description, status, reputation, loadFactor, capabilities } = agent;

    // Truncate agent ID to first 8 characters
    const truncatedId = id.length > 8 ? `${id.substring(0, 8)}...` : id;

    // Determine status dot class
    const getStatusDotClass = () => {
        switch (status) {
            case 'active': return 'bg-axiom-cyan';
            case 'paused': return 'bg-axiom-warning';
            case 'inactive': return 'bg-gray-400';
            default: return 'bg-gray-400';
        }
    };

    // Determine reputation ring color
    const getReputationRingColor = () => {
        if (reputation >= 90) return 'text-axiom-cyan';
        if (reputation >= 70) return 'text-axiom-success';
        return 'text-axiom-warning';
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="holographic-panel p-5 cursor-pointer group"
        >
            {/* Background glow effect */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-axiom-cyan/5 rounded-full blur-3xl group-hover:bg-axiom-cyan/10 transition-all duration-500" />

            {/* Header */}
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className={`w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center border border-gray-700`}>
                            <Cpu className="w-5 h-5 text-gray-300" />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-axiom-dark ${getStatusDotClass()}`} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white leading-tight">{name}</h3>
                        <div className="flex items-center gap-1 text-xs text-gray-500 font-mono mt-0.5">
                            <Hash className="w-3 h-3" />
                            <span>{truncatedId}</span>
                        </div>
                    </div>
                </div>

                {/* Reputation Ring */}
                <div className="flex flex-col items-center">
                    <div className={`text-lg font-bold font-mono ${getReputationRingColor()}`}>
                        {reputation}
                    </div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">REP</span>
                </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-400 mb-4 line-clamp-2 h-10 relative z-10">
                {description}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4 relative z-10">
                <div className="bg-gray-900/50 rounded-lg p-2 border border-gray-800">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                        <Activity className="w-3 h-3" />
                        <span>Load</span>
                    </div>
                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-axiom-cyan"
                            style={{ width: `${loadFactor}%` }}
                        />
                    </div>
                </div>

                <div className="bg-gray-900/50 rounded-lg p-2 border border-gray-800">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                        <Shield className="w-3 h-3" />
                        <span>Tasks</span>
                    </div>
                    <p className="font-mono text-sm text-white">0</p>
                </div>
            </div>

            {/* Capabilities */}
            <div className="relative z-10">
                <h4 className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Capabilities</h4>
                <div className="flex flex-wrap gap-1.5">
                    {capabilities.slice(0, 3).map((capability, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-gray-800/80 border border-gray-700 rounded text-[10px] text-gray-300 font-mono"
                        >
                            {capability}
                        </span>
                    ))}
                    {capabilities.length > 3 && (
                        <span className="px-2 py-1 bg-gray-800/50 border border-gray-700 rounded text-[10px] text-gray-500 font-mono">
                            +{capabilities.length - 3}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
