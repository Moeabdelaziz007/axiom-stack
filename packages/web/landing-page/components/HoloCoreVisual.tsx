// components/HoloCoreVisual.tsx - 3D Holographic Visualization Component
import { useState } from 'react';

// Main HoloCoreVisual component
const HoloCoreVisual = ({ state = 'idle' }: { state?: string }) => {
  return (
    <div className="w-full h-64 md:h-80 relative">
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black rounded-xl">
        {/* Animated core sphere representation */}
        <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${
          state === 'isBuilding' ? 'bg-purple-500 animate-pulse shadow-lg shadow-purple-500/50' : 
          state === 'isListening' ? 'bg-blue-500 animate-pulse shadow-lg shadow-blue-500/50' : 
          state === 'isProcessing' ? 'bg-yellow-500 animate-pulse shadow-lg shadow-yellow-500/50' : 
          'bg-gradient-to-br from-blue-400 to-purple-500'
        }`}>
          <div className="w-24 h-24 rounded-full bg-black/30 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/20"></div>
          </div>
        </div>
      </div>
      
      {/* Status indicator overlay */}
      <div className="absolute bottom-4 left-4 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1 text-xs">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            state === 'isBuilding' ? 'bg-purple-500 animate-pulse' : 
            state === 'isListening' ? 'bg-blue-500 animate-pulse' : 
            state === 'isProcessing' ? 'bg-yellow-500 animate-pulse' : 
            'bg-green-500'
          }`}></div>
          <span className="text-white">
            {state === 'isBuilding' ? 'Building SDK' : 
             state === 'isListening' ? 'Listening' : 
             state === 'isProcessing' ? 'Processing' : 
             'Ready'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HoloCoreVisual;