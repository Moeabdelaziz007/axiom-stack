// components/HoloCoreWidget.tsx
import { useState, useEffect, useRef } from 'react';
import { saveAs } from 'file-saver';
import { io, Socket } from 'socket.io-client';
import useVoiceRecognition from './useVoiceRecognition';
import useWakeWord from './useWakeWord';
import dynamic from 'next/dynamic';
import ConnectionStatusIndicator from './ConnectionStatusIndicator';

// Dynamically import HoloCoreVisual and DISABLE SSR
const HoloCoreVisual = dynamic(
  () => import('./HoloCoreVisual'),
  {
    ssr: false, // <-- This is the critical fix
    // Optional: Add a placeholder while the 3D component is loading
    loading: () => <div style={{ height: '300px', width: '300px', opacity: 0 }} /> 
  }
);

declare type SpeechRecognitionOptions = {
  interimResults?: boolean;
  lang?: string;
  continuous?: boolean;
};

const HoloCoreWidget = () => {
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  const [isBuildingSDK, setIsBuildingSDK] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
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
    setErrorMessage('');
    
    // Initialize Socket.io connection with resilience options
    // Use SOCKET_SERVER_URL if available (for internal communication), otherwise fallback to domain-based logic
    const socketUrl = process.env.SOCKET_SERVER_URL || 
                     (process.env.NODE_ENV === 'production' ? 'https://api.axiomid.app' : 'http://localhost:3001');
    
    console.log('[HOLO-WIDGET] Attempting to connect to:', socketUrl);
    
    // Task 1: Add Socket.io resilience configuration
    socketRef.current = io(socketUrl, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      transports: ['websocket']
    });
    
    // START: CRITICAL DEBUG LOGS
    console.log(`[HOLO-WIDGET] Attempting to connect to: ${socketUrl}`);

    // Task 3: Link socket events to UI state
    socketRef.current.on('connect', () => {
      console.log('✅ [HOLO-WIDGET] SOCKET.IO CONNECTED SUCCESSFULLY!');
      console.log('Socket ID:', socketRef.current?.id);
      setConnectionStatus('connected');
    });
    
    socketRef.current.on('connect_error', (error: any) => { 
      console.error('❌ [HOLO-WIDGET] SOCKET.IO CONNECTION ERROR:', error.message); 
      console.error('Full Error Object:', error); 
      setConnectionStatus('error'); // Assuming 'Error' is a valid state
      setErrorMessage(error.message); // Set the error message state
    });

    socketRef.current.on('disconnect', (reason) => { 
      console.warn(`[HOLO-WIDGET] Socket disconnected. Reason: ${reason}`); 
      setConnectionStatus('error'); // Assuming 'Disconnected' is a valid state
    });
    // END: CRITICAL DEBUG LOGS
    
    socketRef.current.on('agent_speaks_response', (data: any) => {
      setProcessing(false);
      setLastResponse(data.text);
      // Use Web Speech API to speak the response
      if ('speechSynthesis' in window) {
        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(data.text);
        utterance.onend = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
      }
    });
    
    socketRef.current.on('agent_error', (data: any) => {
      setProcessing(false);
      setLastResponse(`Error: ${data.message}`);
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
                     isSpeaking ? 'isSpeaking' : 
                     isListening ? 'isListening' : 
                     isProcessing ? 'isProcessing' : 
                     'idle';

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-4 max-w-md">
      {/* Glassmorphism Control Panel */}
      <div className="glass-strong rounded-2xl p-6 w-full shadow-2xl border border-white/20">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl text-gradient-blue">Holo-Core</h3>
          <div className={`w-3 h-3 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' : 
            connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 
            connectionStatus === 'error' ? 'bg-red-500 animate-pulse' : 'bg-gray-500'
          }`}></div>
        </div>

        {/* HoloCore Visual - Centerpiece */}
        <div className="w-full h-80 mb-6 rounded-xl overflow-hidden relative">
          <HoloCoreVisual state={visualState} />
        </div>

        {/* Connection Status */}
        <div className="mb-4 glass rounded-lg p-3">
          <div className="text-xs text-gray-300 mb-1 font-medium">Connection Status</div>
          <ConnectionStatusIndicator status={connectionStatus} errorMessage={errorMessage} />
        </div>

        {/* Voice Status */}
        <div className="mb-4 glass rounded-lg p-3">
          <div className="text-xs text-gray-300 mb-1 font-medium">Voice Status</div>
          <div className="text-sm font-medium">
            {isListening ? (
              <span className="text-blue-400 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                Listening...
              </span>
            ) : isProcessing ? (
              <span className="text-yellow-400 flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                Processing...
              </span>
            ) : isBuildingSDK ? (
              <span className="text-purple-400 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                Building SDK...
              </span>
            ) : isSpeaking ? (
              <span className="text-green-400 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Speaking...
              </span>
            ) : (
              <span className="text-gray-400 flex items-center gap-2">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                Idle
              </span>
            )}
          </div>
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className="mb-4 glass rounded-lg p-3 max-h-24 overflow-y-auto">
            <div className="text-xs text-gray-400 mb-1">You said:</div>
            <div className="text-sm text-white">{transcript}</div>
          </div>
        )}

        {/* Response Display */}
        {lastResponse && (
          <div className="mb-4 glass rounded-lg p-3 max-h-32 overflow-y-auto border border-blue-500/30">
            <div className="text-xs text-blue-300 mb-1">Response:</div>
            <div className="text-sm text-white">{lastResponse}</div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex gap-3 mb-4">
          {!isListening ? (
            <button
              onClick={startListening}
              className="flex-1 glass-strong hover:bg-blue-500/20 text-white py-3 px-4 rounded-lg transition-all duration-300 font-medium border border-blue-500/30 hover:border-blue-500/50"
            >
              🎤 Start Listening
            </button>
          ) : (
            <button
              onClick={stopListening}
              className="flex-1 glass-strong hover:bg-red-500/20 text-white py-3 px-4 rounded-lg transition-all duration-300 font-medium border border-red-500/30 hover:border-red-500/50"
            >
              ⏹️ Stop Listening
            </button>
          )}

          <button
            onClick={downloadSampleSDK}
            disabled={isBuildingSDK}
            className="flex-1 glass-strong hover:bg-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg transition-all duration-300 font-medium border border-purple-500/30 hover:border-purple-500/50"
          >
            {isBuildingSDK ? '⚙️ Building...' : '📦 Get SDK'}
          </button>
        </div>

        {/* Wake Word Hint */}
        <div className="text-center">
          <div className="inline-block glass rounded-full px-4 py-2 text-xs text-gray-300">
            💬 Say <span className="text-blue-400 font-semibold">&quot;Hey Axiom&quot;</span> to activate
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoloCoreWidget;