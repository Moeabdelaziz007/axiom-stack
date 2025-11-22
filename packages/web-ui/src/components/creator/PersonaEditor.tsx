import React from 'react';

interface PersonaEditorProps {
    data: { systemPrompt: string; tone: string };
    onChange: (data: { systemPrompt: string; tone: string }) => void;
}

export const PersonaEditor: React.FC<PersonaEditorProps> = ({ data, onChange }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-axiom-cyan">2. Persona</h3>
            <div>
                <label className="block text-sm font-mono text-gray-400 mb-1">System Prompt</label>
                <textarea
                    value={data.systemPrompt}
                    onChange={(e) => onChange({ ...data, systemPrompt: e.target.value })}
                    className="w-full bg-axiom-dark border border-gray-700 rounded-lg py-2 px-3 text-white focus:border-axiom-cyan focus:outline-none h-32 font-mono text-sm"
                    placeholder="You are a helpful assistant..."
                />
            </div>
            <div>
                <label className="block text-sm font-mono text-gray-400 mb-1">Tone & Style</label>
                <select
                    value={data.tone}
                    onChange={(e) => onChange({ ...data, tone: e.target.value })}
                    className="w-full bg-axiom-dark border border-gray-700 rounded-lg py-2 px-3 text-white focus:border-axiom-cyan focus:outline-none"
                >
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="sarcastic">Sarcastic</option>
                    <option value="robotic">Robotic</option>
                </select>
            </div>
        </div>
    );
};
