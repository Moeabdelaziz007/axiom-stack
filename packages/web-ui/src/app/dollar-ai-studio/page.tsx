'use client';

import React, { useState } from 'react';
import { DollarSign, Zap, Brain, Sparkles } from 'lucide-react';

// Import step components (we'll create these next)
import StepTemplateSelection from '@/components/dollar-studio/StepTemplateSelection';
import StepKnowledgeUpload from '@/components/dollar-studio/StepKnowledgeUpload';
import StepPreviewDeploy from '@/components/dollar-studio/StepPreviewDeploy';

const steps = ["اختر وكيلك", "درّب وكيلك", "تفعيل"];
const stepsEn = ["Choose Agent", "Train Agent", "Deploy"];

export default function DollarAIStudioPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [agentConfig, setAgentConfig] = useState<any>({});
    const [isArabic, setIsArabic] = useState(true);

    const renderStepComponent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <StepTemplateSelection
                        onNext={() => setCurrentStep(2)}
                        setAgentConfig={setAgentConfig}
                        isArabic={isArabic}
                    />
                );
            case 2:
                return (
                    <StepKnowledgeUpload
                        onNext={() => setCurrentStep(3)}
                        onBack={() => setCurrentStep(1)}
                        agentConfig={agentConfig}
                        setAgentConfig={setAgentConfig}
                        isArabic={isArabic}
                    />
                );
            case 3:
                return (
                    <StepPreviewDeploy
                        onBack={() => setCurrentStep(2)}
                        agentConfig={agentConfig}
                        isArabic={isArabic}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className={`min-h-screen p-8 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
            {/* Hero Header */}
            <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <DollarSign className="w-12 h-12 text-green-400" />
                    <h1 className="text-6xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-yellow-400 to-orange-500">
                        Dollar AI Studio
                    </h1>
                    <Brain className="w-12 h-12 text-cyber-cyan animate-pulse" />
                </div>

                <p className="text-2xl text-white/80 mb-2 font-rajdhani">
                    {isArabic ? 'صمّم وكيل ذكاء اصطناعي احترافي بـ' : 'Build a professional AI agent for'}
                    <span className="text-green-400 font-bold mx-2">$0.99</span>
                </p>

                <p className="text-gray-400 mb-6">
                    {isArabic
                        ? 'بدون برمجة. بدون تعقيد. جاهز للعمل في 5 دقائق.'
                        : 'No coding. No complexity. Ready in 5 minutes.'}
                </p>

                {/* Language Toggle */}
                <button
                    onClick={() => setIsArabic(!isArabic)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-all"
                >
                    {isArabic ? 'English' : 'العربية'}
                </button>

                {/* Quick Stats */}
                <div className="flex justify-center gap-8 mt-8 text-sm">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="text-white/70">{isArabic ? '15 وكيل متخصص' : '15 Specialized Agents'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        <span className="text-white/70">{isArabic ? 'تفعيل فوري' : 'Instant Deployment'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-purple-400" />
                        <span className="text-white/70">{isArabic ? 'مدعوم بـ Gemini Flash' : 'Powered by Gemini Flash'}</span>
                    </div>
                </div>
            </div>

            {/* Progress Stepper */}
            <div className="flex justify-between items-center mb-12 relative max-w-2xl mx-auto">
                {/* Progress Line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/10 -translate-y-1/2 z-0" />
                <div
                    className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-green-400 to-cyan-400 -translate-y-1/2 z-0 transition-all duration-500"
                    style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                />

                {/* Step Circles */}
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className={`flex flex-col items-center z-10 transition-all duration-500 ${currentStep >= index + 1 ? 'text-cyan-400' : 'text-white/50'
                            }`}
                    >
                        <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-2 font-orbitron transition-all ${currentStep > index + 1
                                    ? 'bg-green-400 border-green-400 text-black'
                                    : currentStep === index + 1
                                        ? 'bg-cyan-400/20 border-cyan-400 shadow-lg shadow-cyan-400/50 animate-pulse'
                                        : 'bg-dark-void border-white/30'
                                }`}
                        >
                            {currentStep > index + 1 ? '✓' : index + 1}
                        </div>
                        <span className="mt-3 text-sm font-rajdhani text-center max-w-[100px]">
                            {isArabic ? step : stepsEn[index]}
                        </span>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="glass-card p-8 rounded-2xl min-h-[600px] max-w-6xl mx-auto border border-white/10">
                {renderStepComponent()}
            </div>

            {/* Footer Disclaimer */}
            <div className="text-center mt-8 text-xs text-white/40">
                {isArabic
                    ? '💡 جميع الوكلاء تعمل بتقنية Gemini 1.5 Flash مع دعم كامل للغة العربية'
                    : '💡 All agents powered by Gemini 1.5 Flash with full Arabic support'}
            </div>
        </div>
    );
}
