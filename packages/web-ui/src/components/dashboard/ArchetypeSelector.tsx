import React from 'react';
import { AGENT_TEMPLATES, AgentArchetype } from '@/lib/templates';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, Search, Globe, Check } from 'lucide-react';

interface ArchetypeSelectorProps {
    selected: AgentArchetype;
    onSelect: (archetype: AgentArchetype) => void;
}

export function ArchetypeSelector({ selected, onSelect }: ArchetypeSelectorProps) {
    const archetypes = Object.entries(AGENT_TEMPLATES).map(([key, template]) => ({
        key: key as AgentArchetype,
        ...template
    }));

    const getIcon = (role: string) => {
        if (role.includes('Trader')) return <TrendingUp className="w-6 h-6 text-axiom-cyan" />;
        if (role.includes('Analyst')) return <Search className="w-6 h-6 text-axiom-purple" />;
        if (role.includes('Voyager')) return <Globe className="w-6 h-6 text-axiom-green" />;
        return <Brain className="w-6 h-6 text-gray-400" />;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {archetypes.map((archetype) => (
                <Card
                    key={archetype.key}
                    className={`
            relative p-6 cursor-pointer transition-all duration-300 border-2
            hover:shadow-lg hover:scale-[1.02]
            ${selected === archetype.key
                            ? 'border-axiom-cyan bg-axiom-cyan/5 shadow-axiom-cyan/20'
                            : 'border-white/5 bg-white/5 hover:border-white/20'}
          `}
                    onClick={() => onSelect(archetype.key)}
                >
                    {selected === archetype.key && (
                        <div className="absolute top-3 right-3">
                            <Badge className="bg-axiom-cyan text-black hover:bg-axiom-cyan">
                                <Check className="w-3 h-3 mr-1" /> Selected
                            </Badge>
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        <div className="p-3 rounded-xl bg-black/40 w-fit border border-white/10">
                            {getIcon(archetype.role)}
                        </div>

                        <div>
                            <h3 className="text-xl font-display font-bold text-white mb-1">
                                {archetype.role}
                            </h3>
                            <p className="text-xs font-mono text-axiom-cyan/80 mb-3">
                                {/* @ts-ignore - description exists in updated templates */}
                                {archetype.description}
                            </p>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                {archetype.systemPrompt.split('.')[0]}.
                            </p>
                        </div>

                        <div className="mt-auto pt-4 border-t border-white/5">
                            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                                Superpowers
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {archetype.allowedTools.slice(0, 3).map((tool) => (
                                    <Badge
                                        key={tool}
                                        variant="outline"
                                        className="text-[10px] border-white/10 bg-black/20 text-gray-300"
                                    >
                                        {tool.replace(/_/g, ' ')}
                                    </Badge>
                                ))}
                                {archetype.allowedTools.length > 3 && (
                                    <Badge variant="outline" className="text-[10px] border-white/10 bg-black/20 text-gray-500">
                                        +{archetype.allowedTools.length - 3} more
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
