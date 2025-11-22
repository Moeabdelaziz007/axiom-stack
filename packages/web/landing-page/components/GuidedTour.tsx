// components/GuidedTour.tsx
import { useState, useEffect } from 'react';

interface TourStep {
  id: string;
  title: string;
  content: string;
  targetSelector?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const GuidedTour = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTourActive, setIsTourActive] = useState(false);

  const tourSteps: TourStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Axiom ID',
      content: 'Take a quick tour to discover the key features of our platform.'
    },
    {
      id: 'holo-core',
      title: 'Holo-Core Widget',
      content: 'This is your personal AI assistant. Activate it by saying "Hey Axiom" or clicking the Start Listening button.',
      targetSelector: '.fixed.bottom-4.right-4',
      position: 'left'
    },
    {
      id: 'voice-commands',
      title: 'Voice Commands',
      content: 'Control everything with your voice. Try saying commands like "Create an agent" or "Generate an SDK".'
    },
    {
      id: 'agent-dashboard',
      title: 'Agent Dashboard',
      content: 'View and manage all your AI agents in one place. Each agent has unique capabilities and metrics.',
      targetSelector: '[href="/dashboard"]',
      position: 'bottom'
    },
    {
      id: 'sdk-factory',
      title: 'SDK Factory',
      content: 'Generate custom agent SDKs with a single voice command. Build, deploy, and manage autonomous agents.',
      targetSelector: '.orb-glow-building',
      position: 'top'
    },
    {
      id: 'real-time-monitoring',
      title: 'Real-time Monitoring',
      content: 'Monitor your agents\' performance and activity with real-time metrics and status indicators.'
    },
    {
      id: 'complete',
      title: 'Tour Complete',
      content: 'You\'re ready to explore Axiom ID! Click the Holo-Core widget to get started.'
    }
  ];

  const startTour = () => {
    setIsOpen(true);
    setIsTourActive(true);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      endTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const endTour = () => {
    setIsOpen(false);
    setIsTourActive(false);
    setCurrentStep(0);
  };

  // Scroll to target element when step changes
  useEffect(() => {
    if (isTourActive && tourSteps[currentStep].targetSelector) {
      const targetElement = document.querySelector(tourSteps[currentStep].targetSelector!);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentStep, isTourActive]);

  if (!isOpen) {
    return (
      <button
        onClick={startTour}
        className="fixed bottom-4 left-4 glass rounded-full px-4 py-2 text-sm font-medium text-purple-300 border border-purple-500/30 hover:bg-purple-500/10 transition-colors z-40"
      >
         tour
      </button>
    );
  }

  const currentStepData = tourSteps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80" onClick={endTour}></div>
      
      {/* Tour Modal */}
      <div className="relative glass-strong rounded-2xl p-8 max-w-md mx-4 border border-purple-500/30">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-purple-300">{currentStepData.title}</h3>
          <button 
            onClick={endTour}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <p className="text-gray-300 mb-6">{currentStepData.content}</p>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {currentStep + 1} of {tourSteps.length}
          </div>
          
          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="glass rounded-full px-4 py-2 text-sm font-medium text-gray-300 border border-gray-500/30 hover:bg-gray-500/10 transition-colors"
              >
                Back
              </button>
            )}
            
            <button
              onClick={nextStep}
              className="glass rounded-full px-4 py-2 text-sm font-medium text-purple-300 border border-purple-500/30 hover:bg-purple-500/10 transition-colors"
            >
              {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidedTour;