import React from 'react';
import { Shield, AlertTriangle, Lock, Activity } from 'lucide-react';

interface TDAComplianceBadgeProps {
    status: 'SAFE' | 'WARNING' | 'FROZEN';
    anomalyScore: number;
}

const TDAComplianceBadge: React.FC<TDAComplianceBadgeProps> = ({ status, anomalyScore }) => {
    const getStatusConfig = () => {
        switch (status) {
            case 'SAFE':
                return {
                    color: 'text-axiom-success',
                    bg: 'bg-axiom-success/10',
                    border: 'border-axiom-success/30',
                    icon: Shield,
                    label: 'TDA COMPLIANT',
                    pulse: false
                };
            case 'WARNING':
                return {
                    color: 'text-yellow-400',
                    bg: 'bg-yellow-400/10',
                    border: 'border-yellow-400/30',
                    icon: AlertTriangle,
                    label: 'TOPOLOGY ALERT',
                    pulse: true
                };
            case 'FROZEN':
                return {
                    color: 'text-red-500',
                    bg: 'bg-red-500/10',
                    border: 'border-red-500/30',
                    icon: Lock,
                    label: 'AGENT FROZEN',
                    pulse: true
                };
        }
    };

    const config = getStatusConfig();
    const Icon = config.icon;

    return (
        <div className={`flex items-center gap-3 px-3 py-1.5 rounded-lg border ${config.bg} ${config.border} backdrop-blur-sm transition-all duration-300`}>
            <div className="relative">
                <Icon className={`w-4 h-4 ${config.color} ${config.pulse ? 'animate-pulse' : ''}`} />
                {config.pulse && (
                    <div className={`absolute inset-0 rounded-full ${config.bg} animate-ping opacity-75`}></div>
                )}
            </div>

            <div className="flex flex-col">
                <span className={`text-[10px] font-orbitron font-bold tracking-wider ${config.color}`}>
                    {config.label}
                </span>
                <div className="flex items-center gap-1">
                    <span className="text-[9px] text-white/40 font-mono">ANOMALY SCORE:</span>
                    <span className={`text-[9px] font-mono ${config.color}`}>
                        {anomalyScore.toFixed(2)}
                    </span>
                </div>
            </div>

            {/* Mini Topological Graph Visualization */}
            <div className="ml-2 w-8 h-4 flex items-center justify-center opacity-50">
                <Activity className={`w-full h-full ${config.color}`} />
            </div>
        </div>
    );
};

export default TDAComplianceBadge;
