import React from 'react';

interface ToolSelectorProps {
    selectedTools: string[];
    onChange: (tools: string[]) => void;
}

const AVAILABLE_TOOLS = [
    { id: 'web_search', name: 'Web Search', description: 'Access real-time information' },
    { id: 'calculator', name: 'Calculator', description: 'Perform mathematical calculations' },
    { id: 'image_gen', name: 'Image Generation', description: 'Create AI images' },
    { id: 'solana_wallet', name: 'Solana Wallet', description: 'Interact with blockchain' },
    { id: 'twitter_post', name: 'Twitter/X', description: 'Post to social media' },
];

export const ToolSelector: React.FC<ToolSelectorProps> = ({ selectedTools, onChange }) => {
    const toggleTool = (toolId: string) => {
        if (selectedTools.includes(toolId)) {
            onChange(selectedTools.filter(id => id !== toolId));
        } else {
            onChange([...selectedTools, toolId]);
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-axiom-cyan">3. Capabilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {AVAILABLE_TOOLS.map((tool) => (
                    <div
                        key={tool.id}
                        onClick={() => toggleTool(tool.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedTools.includes(tool.id)
                                ? 'bg-axiom-cyan/10 border-axiom-cyan'
                                : 'bg-gray-900 border-gray-800 hover:border-gray-600'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-white">{tool.name}</span>
                            {selectedTools.includes(tool.id) && (
                                <span className="text-axiom-cyan">✓</span>
                            )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{tool.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
