'use client';

import React, { useState } from 'react';
import TemplateSelector from '@/components/aix-studio/TemplateSelector';
import IdentityStep from '@/components/aix-studio/IdentityStep';
import ToolboxStep from '@/components/aix-studio/ToolboxStep';
import ConstitutionStep from '@/components/aix-studio/ConstitutionStep';
import MintStep from '@/components/aix-studio/MintStep';

const steps = [
    "Template", "Identity", "Toolbox", "Constitution", "Mint & Deploy"
];

export default function AIXStudioPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [agentData, setAgentData] = useState<any>({}); // Stores agent configuration

    const renderStepComponent = () => {
        switch (currentStep) {
            case 1:
                return <TemplateSelector onNext={() => setCurrentStep(2)} setAgentData={setAgentData} />;
            case 2:
                return <IdentityStep onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} setAgentData={setAgentData} agentData={agentData} />;
            case 3:
                return <ToolboxStep onNext={() => setCurrentStep(4)} onBack={() => setCurrentStep(2)} setAgentData={setAgentData} agentData={agentData} />;
            case 4:
                return <ConstitutionStep onNext={() => setCurrentStep(5)} onBack={() => setCurrentStep(3)} setAgentData={setAgentData} agentData={agentData} />;
            case 5:
                return <MintStep agentData={agentData} onBack={() => setCurrentStep(4)} />;
            default:
                return <TemplateSelector onNext={() => setCurrentStep(2)} setAgentData={setAgentData} />;
        }
    };

    return (
        <div className="p-8 text-white min-h-screen">
            {/* Hero Section */}
            <h1 className="text-4xl font-orbitron neon-text mb-2">AIX STUDIO</h1>
            <p className="text-white/70 mb-8 font-rajdhani">Design & Deploy New Agents: The Quantum Genesis Protocol</p>

            {/* Step Progress Bar (Cyberpunk Style) */}
            <div className="flex justify-between items-center mb-12 relative max-w-4xl mx-auto">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2"></div>
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className={`flex flex-col items-center z-10 transition-all duration-500 ${currentStep >= index + 1 ? 'text-cyber-cyan' : 'text-white/50'}`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 font-orbitron ${currentStep > index + 1 ? 'bg-cyber-cyan/50 border-cyber-cyan' : currentStep === index + 1 ? 'bg-dark-void border-cyber-cyan shadow-glow-cyan' : 'bg-dark-void border-white/30'}`}>
                            {index + 1}
                        </div>
                        <span className="mt-2 text-xs font-rajdhani text-center max-w-[80px]">{step}</span>
                    </div>
                ))}
            </div>

            {/* Current Step Component */}
            <div className="glass-card p-8 rounded-2xl min-h-[500px] max-w-5xl mx-auto">
                {renderStepComponent()}
            </div>
        </div>
    );
}
