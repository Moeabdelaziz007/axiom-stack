'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, Activity, Sparkles, Keyboard, Send } from 'lucide-react';

interface VoiceFactoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAgentCreated: (agentData: any) => void;
}

const VoiceFactoryModal: React.FC<VoiceFactoryModalProps> = ({ isOpen, onClose, onAgentCreated }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [audioLevel, setAudioLevel] = useState<number[]>(new Array(20).fill(10));
    const [mode, setMode] = useState<'VOICE' | 'TEXT'>('VOICE');
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (isOpen) {
            // Reset state when opening
            setTranscript('');
            setIsRecording(false);
            setIsAnalyzing(false);
            setMode('VOICE');
        }
    }, [isOpen]);

    // Simulate audio visualization
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRecording) {
            interval = setInterval(() => {
                setAudioLevel(prev => prev.map(() => Math.random() * 40 + 10));
            }, 100);
        } else {
            setAudioLevel(new Array(20).fill(10));
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    const startRecording = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Voice recognition is not supported in this browser. Switching to text mode.');
            setMode('TEXT');
            return;
        }

        const SpeechRecognition = (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onstart = () => {
            setIsRecording(true);
        };

        recognitionRef.current.onresult = (event: any) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    setTranscript(prev => prev + event.results[i][0].transcript);
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
        };

        recognitionRef.current.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            setIsRecording(false);
            if (event.error === 'not-allowed') {
                alert('Microphone access denied. Please enable permissions or use text mode.');
                setMode('TEXT');
            }
        };

        recognitionRef.current.onend = () => {
            setIsRecording(false);
        };

        recognitionRef.current.start();
    };

    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsRecording(false);
            // Auto-analyze if we have enough text
            if (transcript.length > 5) {
                analyzeIntent();
            }
        }
    };

    const analyzeIntent = () => {
        if (!transcript.trim()) return;

        setIsAnalyzing(true);

        // Simulate AI processing delay
        setTimeout(() => {
            setIsAnalyzing(false);

            // Mock AI generation based on "intent"
            // In a real app, this would send the transcript to an LLM
            const newAgent = {
                name: 'Voice Generated Agent',
                role: transcript.slice(0, 30) + '...', // Use part of transcript as role
                status: 'ONLINE',
                activity: 'Initialized via Voice Factory',
                tools: ['Voice Module', 'Quantum Core', 'Gemini 1.5 Pro'],
                isVoiceGenerated: true,
                description: transcript
            };

            onAgentCreated(newAgent);
            onClose();
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-void/80 backdrop-blur-sm animate-fade-in">
            <div className="holographic-panel w-full max-w-lg p-8 relative overflow-hidden border border-cyber-cyan/30 shadow-[0_0_50px_rgba(0,255,255,0.15)]">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-orbitron text-white mb-2">Voice Agent Factory</h2>
                    <p className="text-white/60 font-rajdhani">
                        {mode === 'VOICE' ? 'Speak to create. Describe your agent.' : 'Type your agent description.'}
                    </p>
                </div>

                {/* Mode Switcher */}
                <div className="flex justify-center mb-6">
                    <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
                        <button
                            onClick={() => setMode('VOICE')}
                            className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${mode === 'VOICE' ? 'bg-cyber-cyan text-dark-void' : 'text-white/50 hover:text-white'}`}
                        >
                            Voice
                        </button>
                        <button
                            onClick={() => setMode('TEXT')}
                            className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${mode === 'TEXT' ? 'bg-cyber-cyan text-dark-void' : 'text-white/50 hover:text-white'}`}
                        >
                            Text
                        </button>
                    </div>
                </div>

                {/* Interaction Area */}
                <div className="flex flex-col items-center justify-center mb-8 min-h-[200px]">

                    {mode === 'VOICE' ? (
                        <>
                            <button
                                onClick={isRecording ? stopRecording : startRecording}
                                disabled={isAnalyzing}
                                className={`
                                    w-32 h-32 rounded-full flex items-center justify-center
                                    transition-all duration-300 relative group
                                    ${isRecording
                                        ? 'bg-red-500/20 border-2 border-red-500 shadow-[0_0_30px_rgba(255,0,0,0.5)]'
                                        : 'bg-cyber-cyan/10 border-2 border-cyber-cyan/50 hover:bg-cyber-cyan/20 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]'
                                    }
                                    ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                {isAnalyzing ? (
                                    <Sparkles className="w-12 h-12 text-cyber-cyan animate-spin-slow" />
                                ) : (
                                    <Mic className={`w-12 h-12 ${isRecording ? 'text-red-500' : 'text-cyber-cyan'}`} />
                                )}

                                {/* Pulse Rings */}
                                {isRecording && (
                                    <>
                                        <div className="absolute inset-0 rounded-full border border-red-500/30 animate-ping"></div>
                                        <div className="absolute -inset-4 rounded-full border border-red-500/10 animate-pulse"></div>
                                    </>
                                )}
                            </button>

                            <div className="mt-6 h-8 flex items-end gap-1">
                                {audioLevel.map((height, i) => (
                                    <div
                                        key={i}
                                        className={`w-1.5 rounded-t-sm transition-all duration-100 ${isRecording ? 'bg-cyber-cyan' : 'bg-white/10'}`}
                                        style={{ height: `${height}%` }}
                                    ></div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="w-full">
                            <textarea
                                value={transcript}
                                onChange={(e) => setTranscript(e.target.value)}
                                placeholder="Describe your agent's mission, tools, and personality..."
                                className="w-full h-32 bg-dark-void/50 border border-white/20 rounded-xl p-4 text-white focus:border-cyber-cyan focus:outline-none resize-none font-mono text-sm"
                            />
                            <button
                                onClick={analyzeIntent}
                                disabled={!transcript.trim() || isAnalyzing}
                                className="w-full mt-4 py-3 bg-cyber-cyan text-dark-void font-bold rounded-xl hover:bg-cyber-cyan/90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isAnalyzing ? <Activity className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                {isAnalyzing ? 'Analyzing...' : 'Generate Agent'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Status Text (Voice Mode Only) */}
                {mode === 'VOICE' && (
                    <div className="text-center min-h-[60px]">
                        {isAnalyzing ? (
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-cyber-cyan font-orbitron animate-pulse">Analyzing Quantum Intent...</span>
                                <span className="text-xs text-white/40 font-mono">Synthesizing Agent DNA</span>
                            </div>
                        ) : isRecording ? (
                            <span className="text-red-400 font-rajdhani animate-pulse">Listening...</span>
                        ) : (
                            <span className="text-white/40 font-rajdhani">Tap microphone to start</span>
                        )}
                    </div>
                )}

                {/* Transcript Preview (Voice Mode Only) */}
                {mode === 'VOICE' && transcript && !isAnalyzing && (
                    <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10 text-sm text-white/80 font-mono max-h-24 overflow-y-auto">
                        "{transcript}"
                        <div className="mt-2 flex justify-end">
                            <button
                                onClick={analyzeIntent}
                                className="text-xs text-cyber-cyan hover:underline font-bold"
                            >
                                CONFIRM & GENERATE &gt;
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default VoiceFactoryModal;
