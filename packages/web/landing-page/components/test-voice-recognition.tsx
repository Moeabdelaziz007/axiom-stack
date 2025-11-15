// components/test-voice-recognition.tsx - Test component for enhanced voice recognition
import { useState, useEffect } from 'react';
import useVoiceRecognition from './useVoiceRecognition';
import useWakeWord from './useWakeWord';

const TestVoiceRecognition = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  
  const {
    transcript,
    isListening,
    isProcessing,
    isSupported: browserSupportsSpeechRecognition,
    startListening,
    stopListening,
    resetTranscript
  } = useVoiceRecognition({
    continuous: true,
    interimResults: true,
    language: 'en-US'
  });

  const {
    isWakeWordDetected,
    detectWakeWord,
    resetWakeWord
  } = useWakeWord({
    wakeWords: ['hey axiom', 'hi axiom', 'axiom'],
    sensitivity: 0.8
  });

  // Test wake word detection
  useEffect(() => {
    if (transcript) {
      const detected = detectWakeWord(transcript);
      if (detected) {
        setTestResults(prev => [...prev, `Wake word detected: "${transcript}"`]);
        resetWakeWord();
        resetTranscript();
      }
    }
  }, [transcript, detectWakeWord, resetWakeWord, resetTranscript]);

  const handleStartListening = () => {
    startListening();
    setTestResults(prev => [...prev, 'Started listening...']);
  };

  const handleStopListening = () => {
    stopListening();
    setTestResults(prev => [...prev, 'Stopped listening']);
  };

  const handleReset = () => {
    resetTranscript();
    setTestResults([]);
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg">
        <p className="text-red-200">Browser does not support speech recognition.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Voice Recognition Test</h2>
      
      <div className="mb-4">
        <div className="flex gap-2 mb-2">
          {!isListening ? (
            <button
              onClick={handleStartListening}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Start Listening
            </button>
          ) : (
            <button
              onClick={handleStopListening}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
            >
              Stop Listening
            </button>
          )}
          
          <button
            onClick={handleReset}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
          >
            Reset
          </button>
        </div>
        
        <div className="text-sm text-gray-400">
          Status: {isListening ? 'Listening' : 'Not listening'} | 
          Processing: {isProcessing ? 'Yes' : 'No'} | 
          Wake Word: {isWakeWordDetected ? 'Detected' : 'Not detected'}
        </div>
      </div>
      
      {transcript && (
        <div className="mb-4 p-2 bg-gray-700 rounded">
          <div className="text-xs text-gray-500">Transcript:</div>
          <div className="text-sm">{transcript}</div>
        </div>
      )}
      
      <div className="bg-gray-900 p-4 rounded max-h-40 overflow-y-auto">
        <h3 className="font-semibold mb-2">Test Results:</h3>
        {testResults.map((result, index) => (
          <div key={index} className="text-sm mb-1">{result}</div>
        ))}
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Try saying: "Hey Axiom", "Hi Axiom", or "Axiom"</p>
      </div>
    </div>
  );
};

export default TestVoiceRecognition;