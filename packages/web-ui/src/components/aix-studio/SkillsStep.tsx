import React, { useState } from 'react';
import { AxiomSkills, getSkillCategories, getSkillsByCategory } from '@/lib/SkillsRegistry';
import { AixSkill } from '@/lib/schema/AixSchema';

interface SkillsStepProps {
    onNext: () => void;
    onBack: () => void;
    setAgentData: (data: any) => void;
    agentData: any;
}

export default function SkillsStep({ onNext, onBack, setAgentData, agentData }: SkillsStepProps) {
    const [selectedSkills, setSelectedSkills] = useState<string[]>(agentData.skills || []);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Trading']));
    const [selectedSkillForDetails, setSelectedSkillForDetails] = useState<AixSkill | null>(null);

    const categories = getSkillCategories();

    const toggleCategory = (category: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(category)) {
            newExpanded.delete(category);
        } else {
            newExpanded.add(category);
        }
        setExpandedCategories(newExpanded);
    };

    const toggleSkill = (skillId: string) => {
        const newSelected = selectedSkills.includes(skillId)
            ? selectedSkills.filter(id => id !== skillId)
            : [...selectedSkills, skillId];

        setSelectedSkills(newSelected);
        setAgentData({ ...agentData, skills: newSelected });
    };

    const handleNext = () => {
        if (selectedSkills.length === 0) {
            alert('Please select at least one skill for your agent');
            return;
        }
        onNext();
    };

    const getCategoryIcon = (category: AixSkill['category']) => {
        const icons: Record<AixSkill['category'], string> = {
            Trading: '📈',
            Content: '✍️',
            Research: '🔍',
            Social: '💬',
            Meta: '🧠',
            Other: '⚡'
        };
        return icons[category] || '⚙️';
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold neon-text-gold">The Quantum Skills Manifest</h2>
                <p className="text-gray-400">
                    Select composite skills that combine multiple tools for complex autonomous workflows
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Skills Selection Panel */}
                <div className="lg:col-span-2 space-y-4">
                    {categories.map(category => {
                        const skills = getSkillsByCategory(category);
                        const isExpanded = expandedCategories.has(category);

                        return (
                            <div key={category} className="glass-panel p-4">
                                <button
                                    onClick={() => toggleCategory(category)}
                                    className="w-full flex items-center justify-between text-left hover:neon-text-cyan transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{getCategoryIcon(category)}</span>
                                        <span className="text-xl font-bold">{category} Skills</span>
                                        <span className="text-sm text-gray-500">({skills.length})</span>
                                    </div>
                                    <span className="text-2xl">{isExpanded ? '▼' : '▶'}</span>
                                </button>

                                {isExpanded && (
                                    <div className="mt-4 space-y-3">
                                        {skills.map(skill => {
                                            const isSelected = selectedSkills.includes(skill.skill_id);

                                            return (
                                                <div
                                                    key={skill.skill_id}
                                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${isSelected
                                                            ? 'border-cyan-500 bg-cyan-950/30 neon-glow-cyan'
                                                            : 'border-gray-700 hover:border-gray-500 bg-gray-900/50'
                                                        }`}
                                                    onClick={() => toggleSkill(skill.skill_id)}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isSelected}
                                                                    onChange={() => toggleSkill(skill.skill_id)}
                                                                    className="w-5 h-5 accent-cyan-500"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                />
                                                                <h3 className="font-bold text-lg">{skill.skill_name}</h3>
                                                            </div>
                                                            <p className="text-sm text-gray-400 mb-2">{skill.description}</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                <span className="text-xs px-2 py-1 rounded bg-blue-950/50 text-blue-300 border border-blue-700">
                                                                    {skill.required_tools.length} tools
                                                                </span>
                                                                {skill.example_usage && (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setSelectedSkillForDetails(skill);
                                                                        }}
                                                                        className="text-xs px-2 py-1 rounded bg-purple-950/50 text-purple-300 border border-purple-700 hover:bg-purple-900/50"
                                                                    >
                                                                        View Details
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Skill Details Panel */}
                <div className="lg:col-span-1">
                    <div className="glass-panel p-4 sticky top-4">
                        <h3 className="text-xl font-bold neon-text-gold mb-4">
                            {selectedSkillForDetails ? 'Skill Details' : 'Selected Skills'}
                        </h3>

                        {selectedSkillForDetails ? (
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-bold text-lg mb-2">{selectedSkillForDetails.skill_name}</h4>
                                    <p className="text-sm text-gray-400 mb-4">{selectedSkillForDetails.description}</p>
                                </div>

                                <div>
                                    <h5 className="font-semibold text-cyan-400 mb-2">Reasoning Protocol:</h5>
                                    <pre className="text-xs bg-black/50 p-3 rounded overflow-x-auto whitespace-pre-wrap">
                                        {selectedSkillForDetails.reasoning_protocol}
                                    </pre>
                                </div>

                                <div>
                                    <h5 className="font-semibold text-cyan-400 mb-2">Required Tools:</h5>
                                    <div className="flex flex-wrap gap-1">
                                        {selectedSkillForDetails.required_tools.map(tool => (
                                            <span key={tool} className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-300">
                                                {tool}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {selectedSkillForDetails.example_usage && (
                                    <div>
                                        <h5 className="font-semibold text-cyan-400 mb-2">Example Usage:</h5>
                                        <p className="text-sm italic text-gray-400">"{selectedSkillForDetails.example_usage}"</p>
                                    </div>
                                )}

                                <button
                                    onClick={() => setSelectedSkillForDetails(null)}
                                    className="w-full btn-secondary text-sm"
                                >
                                    Close Details
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {selectedSkills.length === 0 ? (
                                    <p className="text-sm text-gray-500 italic">No skills selected yet</p>
                                ) : (
                                    selectedSkills.map(skillId => {
                                        const skill = AxiomSkills.find(s => s.skill_id === skillId);
                                        return skill ? (
                                            <div key={skillId} className="text-sm p-2 rounded bg-cyan-950/30 border border-cyan-700">
                                                ✓ {skill.skill_name}
                                            </div>
                                        ) : null;
                                    })
                                )}

                                {selectedSkills.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-700">
                                        <p className="text-xs text-gray-500">
                                            Total: <span className="font-bold text-cyan-400">{selectedSkills.length}</span> skills
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-4">
                <button onClick={onBack} className="btn-secondary flex-1">
                    ← Back to Identity
                </button>
                <button onClick={handleNext} className="btn-primary flex-1">
                    Next: Constitution →
                </button>
            </div>
        </div>
    );
}
