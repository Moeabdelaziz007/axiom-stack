'use client';

import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';

interface ConstitutionCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  agentData: any;
}

/**
 * ConstitutionCheckModal - Holographic DNA Protocol Validation
 * Simulates governance compliance check with neon animations
 */
export const ConstitutionCheckModal: React.FC<ConstitutionCheckModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  agentData
}) => {
  const [status, setStatus] = useState<'scanning' | 'success' | 'error'>('scanning');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setStatus('scanning');
      setProgress(0);

      // Simulate scanning progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setStatus('success');
            setTimeout(() => {
              onSuccess();
              onClose();
            }, 2000);
            return 100;
          }
          return prev + 10;
        });
      }, 150);

      return () => clearInterval(interval);
    }
  }, [isOpen, onSuccess, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-void/90 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg holographic-panel p-8 border-2 border-cyber-cyan/50 overflow-hidden">
        
        {/* Animated Background Grid */}
        <div className="absolute inset-0 grid-hud-overlay opacity-30 pointer-events-none"></div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
              status === 'scanning' ? 'bg-cyber-cyan/20 animate-pulse' :
              status === 'success' ? 'bg-axiom-success/20' :
              'bg-axiom-red/20'
            } border-2 ${
              status === 'scanning' ? 'border-cyber-cyan' :
              status === 'success' ? 'border-axiom-success' :
              'border-axiom-red'
            } shadow-[0_0_30px_rgba(0,255,255,0.4)]`}>
              {status === 'scanning' && <Loader2 className="w-10 h-10 text-cyber-cyan animate-spin" />}
              {status === 'success' && <CheckCircle className="w-10 h-10 text-axiom-success" />}
              {status === 'error' && <AlertTriangle className="w-10 h-10 text-axiom-red" />}
            </div>
          </div>

          <h3 className="text-2xl font-orbitron text-center text-white mb-2">
            {status === 'scanning' && 'Scanning DNA Protocol...'}
            {status === 'success' && 'DNA COMPLIANT'}
            {status === 'error' && 'Compliance Failed'}
          </h3>

          <p className="text-center text-white/60 font-rajdhani mb-6">
            {status === 'scanning' && 'Validating against Zentix Governance v1.2'}
            {status === 'success' && 'Governance Policy V1.2 Passed'}
            {status === 'error' && 'Please review your configuration'}
          </p>

          {/* Glow Progress Bar */}
          <div className="mb-6">
            <div className="h-3 bg-dark-void/50 rounded-full overflow-hidden border border-cyber-cyan/30">
              <div 
                className="h-full bg-gradient-to-r from-cyber-cyan to-holo-blue transition-all duration-300 relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs font-mono text-white/50">Progress</span>
              <span className="text-xs font-mono text-cyber-cyan">{progress}%</span>
            </div>
          </div>

          {/* Validation Checks */}
          {status === 'scanning' && (
            <div className="space-y-2 font-mono text-sm">
              <div className="flex items-center gap-2 text-white/70">
                <div className="live-data-dot"></div>
                <span>Checking reasoning protocol...</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <div className="live-data-dot"></div>
                <span>Validating trait boundaries...</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <div className="live-data-dot"></div>
                <span>Verifying collaboration layer...</span>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="bg-axiom-success/10 border border-axiom-success/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-axiom-success shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-axiom-success font-orbitron mb-1">
                    Secured DNA Certification
                  </p>
                  <p className="text-xs text-white/70 font-rajdhani">
                    Your agent meets all governance requirements and is ready for deployment.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConstitutionCheckModal;