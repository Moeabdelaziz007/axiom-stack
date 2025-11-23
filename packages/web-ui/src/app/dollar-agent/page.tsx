'use client';

import React, { useState } from 'react';
import { PDFUploader } from '@/components/rag/PDFUploader';
import { Zap, MessageSquare, Database } from 'lucide-react';

export default function DollarAgentPage() {
    const [businessId] = useState(`biz-${Math.random().toString(36).substring(7)}`);
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
    const [isChatting, setIsChatting] = useState(false);

    const handleUploadComplete = () => {
        // Add a system message or enable chat
        setChatHistory(prev => [...prev, { role: 'ai', content: 'Document processed! I am now ready to answer questions about your business.' }]);
    };

    const handleSendMessage = async () => {
        if (!chatInput.trim()) return;

        const userMsg = chatInput;
        setChatInput('');
        setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsChatting(true);

        try {
            // 1. Query RAG Endpoint (which uses Gemini Flash)
            // Note: In a real app, this would go to a dedicated chat endpoint that orchestrates RAG + LLM.
            // For this demo, we'll simulate the RAG retrieval + Generation loop or call a unified endpoint if available.
            // Since we only implemented /rag-query (retrieval) in tool-executor, we need to handle the generation here 
            // or assume /rag-query returns the answer (if we upgraded it).

            // Let's assume we call a new endpoint /dollar-chat that does RAG + Gemini Flash
            // For now, let's just use the retrieval to show it works, and simulate the "Answer" part 
            // or call the tool-executor's /rag-query to get context and then display it.

            const response = await fetch('https://tools.axiomid.app/rag-query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: userMsg, businessId })
            });

            const data = await response.json();
            const context = data.matches?.map((m: any) => m.text).join('\n\n');

            // In a real implementation, we'd send this context to Gemini Flash API here.
            // For the prototype, we'll display the retrieved context as the "AI Knowledge".

            setChatHistory(prev => [...prev, {
                role: 'ai',
                content: `[RAG Retrieval Success]\nI found this in your documents:\n\n"${context.substring(0, 200)}..."\n\n(Gemini Flash would use this to answer: "${userMsg}")`
            }]);

        } catch (error) {
            setChatHistory(prev => [...prev, { role: 'ai', content: 'Error connecting to the Dollar Agent brain.' }]);
        } finally {
            setIsChatting(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-void p-8 font-rajdhani">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
                        The Dollar Agent
                    </h1>
                    <p className="text-xl text-gray-400">Hire your AI Employee for <span className="text-green-400 font-bold">$0.99/mo</span></p>
                    <div className="flex justify-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Zap className="w-4 h-4" /> Instant Setup</span>
                        <span className="flex items-center gap-1"><Database className="w-4 h-4" /> Unlimited Data</span>
                        <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> Arabic Native</span>
                    </div>
                </div>

                {/* Step 1: Upload */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Train Your Agent</h2>
                        <PDFUploader businessId={businessId} onUploadComplete={handleUploadComplete} />
                    </div>

                    {/* Step 2: Test */}
                    <div className="bg-black/20 rounded-xl border border-white/10 p-6 flex flex-col h-[400px]">
                        <h2 className="text-2xl font-bold text-white mb-4">2. Test Drive</h2>

                        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
                            {chatHistory.length === 0 && (
                                <div className="text-center text-gray-600 mt-20">
                                    Agent is sleeping... Upload a PDF to wake it up.
                                </div>
                            )}
                            {chatHistory.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user'
                                            ? 'bg-cyber-cyan/20 text-cyber-cyan rounded-tr-none'
                                            : 'bg-white/10 text-gray-300 rounded-tl-none'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isChatting && (
                                <div className="flex justify-start">
                                    <div className="bg-white/10 p-3 rounded-lg rounded-tl-none animate-pulse text-gray-500">
                                        Thinking...
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask about your menu..."
                                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyber-cyan/50"
                            />
                            <button
                                onClick={handleSendMessage}
                                className="p-2 bg-cyber-cyan text-black rounded-lg hover:bg-cyan-400 transition-colors"
                            >
                                <Zap className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
