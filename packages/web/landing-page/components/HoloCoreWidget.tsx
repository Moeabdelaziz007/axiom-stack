// components/HoloCoreWidget.tsx
import { useState, useEffect, useRef } from 'react';
import { saveAs } from 'file-saver';
import { io, Socket } from 'socket.io-client';
import useVoiceRecognition from './useVoiceRecognition';
import useWakeWord from './useWakeWord';
import HoloCoreVisual from './HoloCoreVisual';

declare type SpeechRecognitionOptions = {
  interimResults?: boolean;
  lang?: string;
  continuous?: boolean;
};

const HoloCoreWidget = () => {
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [lastResponse, setLastResponse] = useState('');
  const [isBuildingSDK, setIsBuildingSDK] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const {
    transcript,
    isListening,
    isProcessing,
    isSupported: browserSupportsSpeechRecognition,
    startListening,
    stopListening,
    resetTranscript,
    setProcessing
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

  // Check browser support
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.warn('Browser does not support speech recognition');
    }
  }, [browserSupportsSpeechRecognition]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Handle wake word detection
  useEffect(() => {
    if (detectWakeWord(transcript)) {
      resetWakeWord();
      resetTranscript();
      // Connect to backend
      connectToBackend();
    }
  }, [transcript, detectWakeWord, resetWakeWord, resetTranscript]);

  const connectToBackend = () => {
    setConnectionStatus('connecting');
    
    // Initialize Socket.io connection
    // Use production domain when deployed, localhost when developing
    const socketUrl = process.env.NODE_ENV === 'production' ? 'https://axiomid.app' : 'http://localhost:3001';
    socketRef.current = io(socketUrl);
    
    socketRef.current.on('connect', () => {
      console.log('Connected to backend');
      setConnectionStatus('connected');
    });
    
    socketRef.current.on('agent_connected', (data: any) => {
      console.log('Agent connected:', data);
    });
    
    socketRef.current.on('agent_processing', (data: any) => {
      setProcessing(true);
      setLastResponse(data.message);
    });
    
    socketRef.current.on('agent_speaks_response', (data: any) => {
      setProcessing(false);
      setLastResponse(data.text);
    });
    
    socketRef.current.on('agent_error', (data: any) => {
      setProcessing(false);
      setLastResponse(`Error: ${data.message}`);
    });
    
    socketRef.current.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });
  };

  // startListening and stopListening are now provided by useVoiceRecognition hook

  const handleSpeechEnd = () => {
    if (transcript.trim()) {
      setProcessing(true);
      // Send to backend for processing
      processUserInput(transcript);
      resetTranscript();
    }
  };

  const processUserInput = async (input: string) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('user_sends_speech', {
        text: input,
        timestamp: new Date().toISOString()
      });
    } else {
      // Fallback for when not connected
      setTimeout(() => {
        setProcessing(false);
        setLastResponse(`I heard you say: "${input}". This is a simulated response.`);
      }, 1500);
    }
  };

  const downloadSampleSDK = () => {
    setIsBuildingSDK(true);
    
    // Request SDK generation from backend
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('user_requests_sdk', {
        name: 'MyAxiomAgent',
        type: 'custom',
        description: 'My custom Axiom Agent',
        timestamp: new Date().toISOString()
      });
    }
  };

  // Handle SDK delivery from backend
  useEffect(() => {
    if (!socketRef.current) return;
    
    const handleSDKDelivery = (data: any) => {
      if (data.sdk) {
        // Convert base64 to blob
        const byteCharacters = atob(data.sdk);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/zip' });
        
        // Download the SDK
        saveAs(blob, data.name || 'AxiomAgentSDK.zip');
      }
      setIsBuildingSDK(false);
    };
    
    socketRef.current.on('agent_delivers_sdk', handleSDKDelivery);
    
    return () => {
      if (socketRef.current) {
        socketRef.current.off('agent_delivers_sdk', handleSDKDelivery);
      }
    };
  }, []);

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-4">
        <p className="text-red-200">Browser does not support speech recognition.</p>
      </div>
    );
  }

  // Determine visual state for HoloCoreVisual
  const visualState = isBuildingSDK ? 'isBuilding' : 
                     isListening ? 'isListening' : 
                     isProcessing ? 'isProcessing' : 
                     'idle';

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-4">
      {/* HoloCore Visual Component */}
      <div className="w-64 h-64 md:w-80 md:h-80 rounded-xl overflow-hidden shadow-2xl">
        <HoloCoreVisual state={visualState} />
      </div>
      
      {/* Control Panel */}
      <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-xl p-4 w-80 shadow-2xl">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg">Holo-Core Assistant</h3>
          <div className={`w-3 h-3 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500' : 
            connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
          }`}></div>
        </div>
        
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-1">Status</div>
          <div className="text-sm">
            {isListening ? (
              <span className="text-green-400">Listening...</span>
            ) : isProcessing ? (
              <span className="text-yellow-400">Processing...</span>
            ) : isBuildingSDK ? (
              <span className="text-blue-400">Building SDK...</span>
            ) : (
              <span className="text-gray-400">Idle</span>
            )}
          </div>
        </div>
        
        {transcript && (
          <div className="mb-4 p-2 bg-gray-800/50 rounded">
            <div className="text-xs text-gray-500">You said:</div>
            <div className="text-sm">{transcript}</div>
          </div>
        )}
        
        {lastResponse && (
          <div className="mb-4 p-2 bg-blue-900/30 rounded">
            <div className="text-xs text-gray-500">Response:</div>
            <div className="text-sm">{lastResponse}</div>
          </div>
        )}
        
        <div className="flex gap-2">
          {!isListening ? (
            <button
              onClick={startListening}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
            >
              Start Listening
            </button>
          ) : (
            <button
              onClick={stopListening}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition"
            >
              Stop Listening
            </button>
          )}
          
          <button
            onClick={downloadSampleSDK}
            disabled={isBuildingSDK}
            className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 text-white py-2 px-4 rounded-lg transition"
          >
            {isBuildingSDK ? 'Building...' : 'Get SDK'}
          </button>
        </div>
        
        <div className="mt-3 text-xs text-gray-500 text-center">
          Say &quot;Hey Axiom&quot; to activate
        </div>
      </div>
    </div>
  );
};

export default HoloCoreWidget;