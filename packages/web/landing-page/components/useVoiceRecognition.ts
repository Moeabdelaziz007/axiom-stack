// components/useVoiceRecognition.ts - Enhanced voice recognition hook
import { useState, useEffect, useCallback } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export interface VoiceRecognitionHook {
  transcript: string;
  isListening: boolean;
  isProcessing: boolean;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  setProcessing: (processing: boolean) => void;
}

interface VoiceRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
}

const useVoiceRecognition = (options: VoiceRecognitionOptions = {}): VoiceRecognitionHook => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Add null check for useSpeechRecognition
  const speechRecognitionResult = useSpeechRecognition();
  const {
    transcript = '',
    listening = false,
    resetTranscript = () => {},
    browserSupportsSpeechRecognition = false
  } = speechRecognitionResult || {};

  const defaultOptions = {
    continuous: true,
    interimResults: true,
    language: 'en-US',
    ...options
  };

  const startListening = useCallback(() => {
    if (!browserSupportsSpeechRecognition) {
      console.warn('Browser does not support speech recognition');
      return;
    }

    SpeechRecognition.startListening(defaultOptions);
  }, [browserSupportsSpeechRecognition, defaultOptions]);

  const stopListening = useCallback(() => {
    SpeechRecognition.stopListening();
  }, []);

  const setProcessing = useCallback((processing: boolean) => {
    setIsProcessing(processing);
  }, []);

  return {
    transcript,
    isListening: listening,
    isProcessing,
    isSupported: browserSupportsSpeechRecognition,
    startListening,
    stopListening,
    resetTranscript,
    setProcessing
  };
};

export default useVoiceRecognition;