'use client';

import React from 'react';
import { Dna, Brain, Users, Wrench, Shield } from 'lucide-react';

interface DNATreePreviewProps {
  agentData: any;
  className?: string;
}

/**
 * DNATreePreview - Holographic hierarchical DNA structure visualization
 * Displays agent configuration as a glowing tree structure
 */
export const DNATreePreview: React.FC<DNATreePreviewProps> = ({ agentData, className = '' }) => {
  const traits = agentData.traits || {};
  const collaborators = agentData.collaborationLayer || [];
  const tools = agentData.tools || [];

  return (
    <div className={`holographic-panel p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <Dna className="w-6 h-6 text-cyber-cyan animate-pulse" />
        <h3 className="text-xl font-orbitron text-white">DNA Structure Preview</h3>
      </div>

      {/* Tree Structure */}
      <div className="space-y-4 font-mono text-sm">
        
        {/* Root Node */}
        <div className="flex items-start gap-3">
          <div className="w-3 h-3 rounded-full bg-cyber-cyan shadow-[0_0_10px_#00f0ff] mt-1"></div>
          <div>
            <span className="text-cyber-cyan font-bold">{agentData.name || 'Agent'}</span>
            <span className="text-white/50 ml-2">({agentData.role || 'Role'})</span>
          </div>
        </div>

        {/* Traits Branch */}
        <div className="ml-6 border-l-2 border-holo-blue/30 pl-6 space-y-3">
          <div className="flex items-start gap-3">
            <Brain className="w-4 h-4 text-holo-blue mt-0.5" />
            <div className="flex-1">
              <div className="text-holo-blue font-bold mb-2">Traits</div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/60">Risk Tolerance:</span>
                  <span className="text-white">{((traits.riskTolerance || 0.5) * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Tone:</span>
                  <span className="text-white capitalize">{traits.tone || 'professional'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Frequency:</span>
                  <span className="text-white capitalize">{traits.postingFrequency || 'medium'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reasoning Protocol Branch */}
        <div className="ml-6 border-l-2 border-neon-purple/30 pl-6">
          <div className="flex items-start gap-3">
            <Shield className="w-4 h-4 text-neon-purple mt-0.5" />
            <div className="flex-1">
              <div className="text-neon-purple font-bold mb-2">Reasoning Protocol</div>
              <div className="text-xs text-white/60 bg-dark-void/50 p-2 rounded border border-neon-purple/20 max-h-20 overflow-hidden">
                {agentData.reasoningProtocol?.substring(0, 100) || 'Not configured'}...
              </div>
            </div>
          </div>
        </div>

        {/* Collaboration Branch */}
        {collaborators.length > 0 && (
          <div className="ml-6 border-l-2 border-axiom-success/30 pl-6">
            <div className="flex items-start gap-3">
              <Users className="w-4 h-4 text-axiom-success mt-0.5" />
              <div className="flex-1">
                <div className="text-axiom-success font-bold mb-2">Collaboration ({collaborators.length})</div>
                <div className="space-y-1 text-xs">
                  {collaborators.slice(0, 3).map((collab: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-axiom-success"></div>
                      <span className="text-white/70">{collab}</span>
                    </div>
                  ))}
                  {collaborators.length > 3 && (
                    <div className="text-white/40">+{collaborators.length - 3} more</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tools Branch */}
        {tools.length > 0 && (
          <div className="ml-6 border-l-2 border-axiom-warning/30 pl-6">
            <div className="flex items-start gap-3">
              <Wrench className="w-4 h-4 text-axiom-warning mt-0.5" />
              <div className="flex-1">
                <div className="text-axiom-warning font-bold mb-2">Toolbox ({tools.length})</div>
                <div className="flex flex-wrap gap-1">
                  {tools.slice(0, 5).map((tool: string, idx: number) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 bg-axiom-warning/10 text-axiom-warning rounded border border-axiom-warning/20">
                      {tool}
                    </span>
                  ))}
                  {tools.length > 5 && (
                    <span className="text-[10px] px-2 py-0.5 text-white/40">+{tools.length - 5}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Holographic Glow Effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-gradient-to-t from-cyber-cyan/10 to-transparent blur-xl pointer-events-none"></div>
    </div>
  );
};

export default DNATreePreview;