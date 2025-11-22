import React from 'react';

interface TemplateBuilderProps {
    data: { name: string; description: string };
    onChange: (data: { name: string; description: string }) => void;
}

export const TemplateBuilder: React.FC<TemplateBuilderProps> = ({ data, onChange }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-axiom-cyan">1. Identity</h3>
            <div>
                <label className="block text-sm font-mono text-gray-400 mb-1">Agent Name</label>
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => onChange({ ...data, name: e.target.value })}
                    className="w-full bg-axiom-dark border border-gray-700 rounded-lg py-2 px-3 text-white focus:border-axiom-cyan focus:outline-none"
                    placeholder="e.g. Quantum Trader X"
                />
            </div>
            <div>
                <label className="block text-sm font-mono text-gray-400 mb-1">Description</label>
                <textarea
                    value={data.description}
                    onChange={(e) => onChange({ ...data, description: e.target.value })}
                    className="w-full bg-axiom-dark border border-gray-700 rounded-lg py-2 px-3 text-white focus:border-axiom-cyan focus:outline-none h-24"
                    placeholder="Describe what this agent does..."
                />
            </div>
        </div>
    );
};
