'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Loader2, Brain, Speaker } from 'lucide-react';

type VoiceState = 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING';

interface VoiceInteractionProps {
    onTranscript: (text: string) => void;
    isProcessing: boolean;
    isArabic: boolean;
    responseToSpeak?: string | null; // New prop to trigger speech
    onSpeechEnd?: () => void; // Callback when speech ends
}

export default function VoiceInteraction({
    onTranscript,
    isProcessing,
    isArabic,
    responseToSpeak,
    onSpeechEnd
}: VoiceInteractionProps) {
    const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
    const [error, setError] = useState<string | null>(null);
    const recognitionRef = useRef<any>(null);

    // Initialize Speech Recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false; // We want to stop after each sentence to process
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = isArabic ? 'ar-SA' : 'en-US';

            recognitionRef.current.onstart = () => {
                setVoiceState('LISTENING');
                setError(null);
            };

            recognitionRef.current.onend = () => {
                // Only go to IDLE if we are not processing or speaking
                // The loop logic will handle restarting if needed
                if (voiceState === 'LISTENING' && !isProcessing) {
                    setVoiceState('IDLE');
                }
            };

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setVoiceState('THINKING'); // Visual feedback immediately
                onTranscript(transcript);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                if (event.error !== 'no-speech') {
                    setError(isArabic ? 'حدث خطأ في التعرف على الصوت' : 'Voice recognition error');
                }
                setVoiceState('IDLE');
            };
        } else {
            setError(isArabic ? 'المتصفح لا يدعم الأوامر الصوتية' : 'Browser does not support voice commands');
        }
    }, [isArabic, onTranscript, isProcessing, voiceState]);

    // Handle Text-to-Speech (The Loop)
    useEffect(() => {
        if (responseToSpeak && voiceState !== 'SPEAKING') {
            speakResponse(responseToSpeak);
        }
    }, [responseToSpeak]);

    const speakResponse = (text: string) => {
        if (!('speechSynthesis' in window)) return;

        // 1. Stop Listening (Prevent Echo)
        if (recognitionRef.current) recognitionRef.current.stop();

        setVoiceState('SPEAKING');

        const utterance = new SpeechSynthesisUtterance(text);

        if (isArabic) {
            // 1. Force Language (Crucial for Dialect)
            utterance.lang = 'ar-SA';

            // 2. Best Effort Voice Selection (The Dialect Hack)
            const voices = window.speechSynthesis.getVoices();
            const arabicVoice = voices.find(v => v.lang.includes('ar') && v.name.includes('Google')) || // Google's Arabic is best
                voices.find(v => v.lang.includes('ar') && v.name.includes('Majed')) ||  // iOS Majed is good
                voices.find(v => v.lang.includes('ar')); // Fallback

            if (arabicVoice) {
                utterance.voice = arabicVoice;
            }

            // 3. Slow down slightly for elderly users
            utterance.rate = 0.9;
        } else {
            utterance.lang = 'en-US';
        }

        // Robust Resume Logic
        const resumeListening = () => {
            if (onSpeechEnd) onSpeechEnd(); // Clear the response prop in parent

            // Small delay to prevent picking up the very end of the TTS
            setTimeout(() => {
                setVoiceState('LISTENING');
                try {
                    recognitionRef.current?.start();
                } catch (e) {
                    console.log("Mic already on or interaction needed");
                    setVoiceState('IDLE'); // Fallback to IDLE if auto-start fails (browser policy)
                }
            }, 500);
        };

        utterance.onend = resumeListening;
        utterance.onerror = (e) => {
            console.error("TTS Error", e);
            resumeListening(); // Always resume even on error
        };

        window.speechSynthesis.cancel(); // Cancel any previous speech
        window.speechSynthesis.speak(utterance);
    };

    const toggleListening = () => {
        if (voiceState === 'LISTENING') {
            recognitionRef.current?.stop();
            setVoiceState('IDLE');
        } else {
            recognitionRef.current?.start();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-black/20 rounded-2xl backdrop-blur-sm border border-white/10">
            {/* Traffic Light Button */}
            <button
                onClick={toggleListening}
                disabled={voiceState === 'THINKING'}
                className={`
          relative w-32 h-32 rounded-full border-4 transition-all duration-500 flex items-center justify-center
          ${voiceState === 'LISTENING' ? 'bg-red-600 border-red-400 animate-pulse shadow-[0_0_30px_rgba(220,38,38,0.6)]' : ''}
          ${voiceState === 'THINKING' ? 'bg-yellow-500 border-yellow-300 shadow-[0_0_30px_rgba(234,179,8,0.6)]' : ''}
          ${voiceState === 'SPEAKING' ? 'bg-green-500 border-green-400 shadow-[0_0_30px_rgba(34,197,94,0.6)]' : ''}
          ${voiceState === 'IDLE' ? 'bg-gray-700 border-gray-500 hover:scale-105 shadow-lg' : ''}
        `}
            >
                {voiceState === 'LISTENING' && <Mic className="w-12 h-12 text-white" />}
                {voiceState === 'THINKING' && <Brain className="w-12 h-12 text-white animate-pulse" />}
                {voiceState === 'SPEAKING' && <Speaker className="w-12 h-12 text-white animate-bounce" />}
                {voiceState === 'IDLE' && <MicOff className="w-12 h-12 text-gray-400" />}

                {/* Ripple Effect for Listening */}
                {voiceState === 'LISTENING' && (
                    <>
                        <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
                    </>
                )}
            </button>

            {/* Status Text for Elderly Accessibility */}
            <p className="mt-6 text-xl font-bold text-white font-rajdhani tracking-wide">
                {voiceState === 'LISTENING' && (isArabic ? "تحدث الآن..." : "Listening...")}
                {voiceState === 'THINKING' && (isArabic ? "جاري التفكير..." : "Thinking...")}
                {voiceState === 'SPEAKING' && (isArabic ? "استمع للإجابة" : "Speaking...")}
                {voiceState === 'IDLE' && (isArabic ? "اضغط للتحدث" : "Tap to Speak")}
            </p>

            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>
    );
}
