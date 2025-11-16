// components/HoloCoreVisual.tsx - 2D Holographic Orb with Pure CSS
import { useEffect, useState } from 'react';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  delay: number;
}

const HoloCoreVisual = ({ state = 'idle' }: { state?: string }) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  // Generate sparkles for building state
  useEffect(() => {
    if (state === 'isBuilding') {
      const newSparkles: Sparkle[] = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 1.5,
      }));
      setSparkles(newSparkles);
    } else {
      setSparkles([]);
    }
  }, [state]);

  // Determine colors and animation classes based on state
  const getStateStyles = () => {
    switch (state) {
      case 'isListening':
        return {
          outerRing: 'border-blue-500/30 bg-blue-500/5',
          middleGlow: 'bg-blue-400/20 animate-pulse-medium',
          innerCore: 'bg-gradient-to-br from-blue-400 to-blue-600 orb-glow-listening',
          pulseClass: 'animate-pulse-medium',
          rotateClass: 'animate-rotate-slow',
        };
      case 'isProcessing':
        return {
          outerRing: 'border-yellow-500/30 bg-yellow-500/5',
          middleGlow: 'bg-yellow-400/20 animate-pulse-fast',
          innerCore: 'bg-gradient-to-br from-yellow-400 to-orange-600 orb-glow-processing',
          pulseClass: 'animate-pulse-fast',
          rotateClass: 'animate-rotate-slow',
        };
      case 'isBuilding':
        return {
          outerRing: 'border-purple-500/30 bg-purple-500/5',
          middleGlow: 'bg-purple-400/20 animate-pulse-fast',
          innerCore: 'bg-gradient-to-br from-purple-400 to-purple-600 orb-glow-building',
          pulseClass: 'animate-pulse-fast',
          rotateClass: 'animate-rotate-slow',
        };
      case 'isSpeaking':
        return {
          outerRing: 'border-green-500/30 bg-green-500/5',
          middleGlow: 'bg-green-400/20 animate-pulse-medium',
          innerCore: 'bg-gradient-to-br from-green-400 to-emerald-600 orb-glow-speaking',
          pulseClass: 'animate-pulse-medium',
          rotateClass: 'animate-rotate-slow',
        };
      default: // idle
        return {
          outerRing: 'border-indigo-500/30 bg-indigo-500/5',
          middleGlow: 'bg-indigo-400/20 animate-pulse-slow',
          innerCore: 'bg-gradient-to-br from-indigo-400 to-indigo-600 orb-glow-idle',
          pulseClass: 'animate-pulse-slow',
          rotateClass: 'animate-rotate-slow',
        };
    }
  };

  const styles = getStateStyles();

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {/* Outer Ring */}
      <div
        className={`absolute w-64 h-64 md:w-80 md:h-80 rounded-full border-2 ${styles.outerRing} ${styles.rotateClass}`}
        style={{
          background: `conic-gradient(from 0deg, transparent, ${
            state === 'isListening'
              ? 'rgba(59, 130, 246, 0.3)'
              : state === 'isProcessing'
              ? 'rgba(245, 158, 11, 0.3)'
              : state === 'isBuilding'
              ? 'rgba(168, 85, 247, 0.3)'
              : state === 'isSpeaking'
              ? 'rgba(16, 185, 129, 0.3)'
              : 'rgba(99, 102, 241, 0.3)'
          }, transparent)`,
        }}
      />

      {/* Middle Glow Layer */}
      <div
        className={`absolute w-48 h-48 md:w-60 md:h-60 rounded-full ${styles.middleGlow} ${styles.pulseClass}`}
        style={{
          filter: 'blur(20px)',
        }}
      />

      {/* Inner Core */}
      <div
        className={`relative w-32 h-32 md:w-40 md:h-40 rounded-full ${styles.innerCore} ${styles.pulseClass} flex items-center justify-center overflow-hidden`}
      >
        {/* Glass overlay */}
        <div className="absolute inset-0 glass-strong rounded-full" />
        
        {/* Rotating gradient overlay */}
        <div
          className={`absolute inset-0 rounded-full opacity-50 ${styles.rotateClass}`}
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, white 180deg, transparent 360deg)`,
          }}
        />

        {/* Center dot */}
        <div className="relative w-4 h-4 bg-white rounded-full animate-pulse" />

        {/* Sparkles for building state */}
        {state === 'isBuilding' &&
          sparkles.map((sparkle) => (
            <div
              key={sparkle.id}
              className="sparkle animate-sparkle"
              style={{
                left: `${sparkle.x}%`,
                top: `${sparkle.y}%`,
                animationDelay: `${sparkle.delay}s`,
              }}
            />
          ))}
      </div>

      {/* Status Label */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-12">
        <div className="glass rounded-full px-4 py-2 text-xs font-medium">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                state === 'isListening'
                  ? 'bg-blue-500 animate-pulse'
                  : state === 'isProcessing'
                  ? 'bg-yellow-500 animate-pulse'
                  : state === 'isBuilding'
                  ? 'bg-purple-500 animate-pulse'
                  : state === 'isSpeaking'
                  ? 'bg-green-500 animate-pulse'
                  : 'bg-indigo-500'
              }`}
            />
            <span className="text-white">
              {state === 'isListening'
                ? 'Listening'
                : state === 'isProcessing'
                ? 'Processing'
                : state === 'isBuilding'
                ? 'Building SDK'
                : state === 'isSpeaking'
                ? 'Speaking'
                : 'Ready'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoloCoreVisual;