// components/test-holocore-visual.tsx - Test component for HoloCoreVisual
import { useState } from 'react';
import HoloCoreVisual from './HoloCoreVisual';

const TestHoloCoreVisual = () => {
  const [currentState, setCurrentState] = useState('idle');

  const states = ['idle', 'isListening', 'isProcessing', 'isBuilding'];

  return (
    <div className="p-6 bg-gray-900 rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">HoloCore Visual Test</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Select State:</h3>
        <div className="flex flex-wrap gap-2">
          {states.map((state) => (
            <button
              key={state}
              onClick={() => setCurrentState(state)}
              className={`px-4 py-2 rounded-lg transition ${
                currentState === state
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              }`}
            >
              {state === 'isBuilding' ? 'Building SDK' : 
               state === 'isListening' ? 'Listening' : 
               state === 'isProcessing' ? 'Processing' : 
               'Idle'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-black/20 rounded-xl p-4">
        <HoloCoreVisual state={currentState} />
      </div>

      <div className="mt-6 text-sm text-gray-400">
        <p className="mb-2"><strong>Visual States:</strong></p>
        <ul className="list-disc pl-5 space-y-1">
          <li><span className="text-green-400">Idle</span>: Calm blue sphere with gentle rotation</li>
          <li><span className="text-blue-400">Listening</span>: Pulsing blue sphere with faster rotation</li>
          <li><span className="text-yellow-400">Processing</span>: Yellow sphere with distortion effects</li>
          <li><span className="text-purple-400">Building SDK</span>: Purple sphere with sparks and intense rotation</li>
        </ul>
      </div>
    </div>
  );
};

export default TestHoloCoreVisual;