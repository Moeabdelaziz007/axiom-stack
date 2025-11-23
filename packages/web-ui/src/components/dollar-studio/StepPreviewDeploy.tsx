'use client';

import React, { useState } from 'react';
import { Rocket, Check, Zap, Brain, MessagesSquare, Copy, Wallet as WalletIcon, AlertTriangle } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { generateAixDNA } from '@/lib/aix-generator';
import { registerAgentOnChain } from '@/lib/solana/registry';

interface StepPreviewDeployProps {
    onBack: () => void;
    agentConfig: any;
    isArabic: boolean;
}

import AuthModal from '@/components/auth/AuthModal';
import PaymentModal from '@/components/payment/PaymentModal';
import { auth } from '@/lib/firebase';

export default function StepPreviewDeploy({ onBack, agentConfig, isArabic }: StepPreviewDeployProps) {
    const { publicKey, signTransaction, signMessage } = useWallet();
    const [isDeploying, setIsDeploying] = useState(false);
    const [deployed, setDeployed] = useState(false);
    const [agentId, setAgentId] = useState<string | null>(null);
    const [deploymentTxHash, setDeploymentTxHash] = useState<string | null>(null);
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
    const [isChatting, setIsChatting] = useState(false);

    // Modals State
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [paymentProof, setPaymentProof] = useState<any>(null);

    const handleDeployClick = () => {
        // 1. Check Auth (Wallet OR Firebase)
        if (!publicKey && !user) {
            setShowAuthModal(true);
            return;
        }
        // 2. Check Payment
        if (!paymentProof) {
            setShowPaymentModal(true);
            return;
        }
        // 3. Proceed to Deploy
        handleDeployProcess();
    };

    const handleDeployProcess = async () => {
        setIsDeploying(true);

        try {
            const ownerId = publicKey ? publicKey.toString() : user.uid;

            // Step 1: Generate full AIX DNA
            const agentDNA = await generateAixDNA({
                templateId: agentConfig.templateId,
                knowledgeFile: agentConfig.knowledgeBase,
                owner: ownerId,
                adkVersion: '1.0',
                businessId: agentConfig.businessId
            });

            let signature = 'firebase_verified'; // Default for Web2 users

            // Step 2: Sign DNA (if Wallet connected)
            if (publicKey && signMessage) {
                const { default: bs58 } = await import('bs58');
                const message = new TextEncoder().encode(JSON.stringify(agentDNA));
                const signatureBytes = await signMessage(message);
                signature = bs58.encode(signatureBytes);

                // Register on-chain
                if (signTransaction) {
                    const txHash = await registerAgentOnChain(agentDNA, publicKey, signTransaction);
                    setDeploymentTxHash(txHash);
                }
            }

            // Step 3: Deploy to Backend
            const deployResponse = await fetch('https://brain.axiomid.app/deploy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dna: agentDNA,
                    signature: signature,
                    paymentProof: paymentProof,
                    authType: publicKey ? 'wallet' : 'firebase'
                })
            });

            if (!deployResponse.ok) {
                const errorData = await deployResponse.json();
                throw new Error(errorData.error || 'Backend deployment failed');
            }

            const deployResult = await deployResponse.json();
            setAgentId(agentDNA.id);
            setDeployed(true);

            setChatHistory([{
                role: 'ai',
                content: isArabic
                    ? `✅ مرحباً! تم تفعيل وكيلك بنجاح. ${publicKey ? 'تم التوثيق عبر Solana.' : 'تم التوثيق عبر البريد.'}`
                    : `✅ Hello! Your agent is successfully deployed. ${publicKey ? 'Verified via Solana.' : 'Verified via Email.'}`
            }]);

        } catch (error: any) {
            console.error('Deployment failed:', error);
            alert(error.message);
        } finally {
            setIsDeploying(false);
        }
    };

    const handleSendMessage = async () => {
        if (!chatInput.trim() || !deployed) return;

        const userMsg = chatInput;
        setChatInput('');
        setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsChatting(true);

        try {
            const response = await fetch('https://tools.axiomid.app/rag-query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: userMsg,
                    businessId: agentConfig.businessId
                })
            });

            const data = await response.json();
            const context = data.matches?.map((m: any) => m.text).join('\n\n') || '';

            // Simulate AI response (in real app, call Gemini Flash with context)
            const aiResponse = isArabic
                ? `بناءً على المعلومات المتوفرة:\n\n"${context.substring(0, 200)}..."\n\n(في النسخة الكاملة، سيقوم Gemini Flash بتوليد إجابة كاملة باستخدام هذا السياق)`
                : `Based on available information:\n\n"${context.substring(0, 200)}..."\n\n(In full version, Gemini Flash will generate complete answer using this context)`;

            setChatHistory(prev => [...prev, { role: 'ai', content: aiResponse }]);
        } catch (error) {
            setChatHistory(prev => [...prev, {
                role: 'ai',
                content: isArabic ? 'خطأ في الاتصال بالوكيل.' : 'Error connecting to agent.'
            }]);
        } finally {
            setIsChatting(false);
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-orbitron text-white mb-4">
                {isArabic ? '3. معاينة وتفعيل' : '3. Preview & Deploy'}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Summary Card */}
                <div>
                    <div className="glass-card p-6 border border-cyan-400/30">
                        <h3 className="text-xl font-orbitron text-cyan-400 mb-4">
                            {isArabic ? '✅ وكيلك جاهز!' : '✅ Your Agent is Ready!'}
                        </h3>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-white/60">{isArabic ? 'النوع:' : 'Type:'}</span>
                                <span className="text-white font-rajdhani">{agentConfig.templateName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60">{isArabic ? 'البيانات:' : 'Knowledge:'}</span>
                                <span className="text-white font-rajdhani">
                                    {agentConfig.knowledgeBase?.chunksProcessed || 0} {isArabic ? 'قطعة' : 'chunks'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60">{isArabic ? 'المهارات:' : 'Skills:'}</span>
                                <span className="text-white font-rajdhani">{agentConfig.tools?.length || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60">{isArabic ? 'السرعة:' : 'Speed:'}</span>
                                <span className="text-green-400 font-rajdhani flex items-center gap-1">
                                    <Zap className="w-3 h-3" />
                                    {isArabic ? '< 2 ثانية' : '< 2 seconds'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60">{isArabic ? 'اللغة:' : 'Language:'}</span>
                                <span className="text-white font-rajdhani">{isArabic ? 'العربية + الإنجليزية' : 'Arabic + English'}</span>
                            </div>
                        </div>

                        {/* Genome Info */}
                        <div className="mt-6 pt-4 border-t border-white/10">
                            <p className="text-xs text-white/50 mb-2">{isArabic ? 'الجينوم:' : 'Genome:'}</p>
                            <p className="text-sm text-cyan-400">{agentConfig.genome}</p>
                        </div>

                        {/* Wallet Connection */}
                        {!publicKey ? (
                            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-400/30 rounded-lg">
                                <div className="flex items-start gap-2 mb-3">
                                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-yellow-300 font-rajdhani font-bold">
                                            {isArabic ? 'مطلوب: ربط المحفظة' : 'Required: Connect Wallet'}
                                        </p>
                                        <p className="text-xs text-yellow-200/80 mt-1">
                                            {isArabic
                                                ? 'لتوثيق ملكية الوكيل على Solana البلوك تشين'
                                                : 'To verify agent ownership on Solana blockchain'}
                                        </p>
                                    </div>
                                </div>
                                <WalletMultiButton className="!bg-gradient-to-r !from-purple-500 !to-pink-500 !rounded-lg w-full" />
                            </div>
                        ) : (
                            <div className="mt-6 p-3 bg-green-400/10 border border-green-400/30 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <WalletIcon className="w-4 h-4 text-green-400" />
                                    <p className="text-xs text-green-300">
                                        {isArabic ? 'محفظة متصلة:' : 'Wallet connected:'}
                                    </p>
                                </div>
                                <code className="text-xs text-white/70 block mt-1 truncate">
                                    {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
                                </code>
                            </div>
                        )}

                        {/* Deploy Button */}
                        {!deployed ? (
                            <button
                                onClick={handleDeployClick}
                                disabled={isDeploying}
                                className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-green-400 to-cyan-400 text-black font-orbitron font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-400/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isDeploying ? (
                                    <>
                                        <Brain className="w-5 h-5 animate-pulse" />
                                        {isArabic ? 'جاري التفعيل...' : 'Deploying...'}
                                    </>
                                ) : (
                                    <>
                                        <Rocket className="w-5 h-5" />
                                        {isArabic ? '🚀 تفعيل الوكيل الآن' : '🚀 Deploy Agent Now'}
                                    </>
                                )}
                            </button>
                        ) : (
                            <div className="mt-6 p-4 bg-green-400/10 border border-green-400/30 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Check className="w-5 h-5 text-green-400" />
                                    <p className="text-green-400 font-bold">{isArabic ? 'تم التفعيل بنجاح!' : 'Successfully Deployed!'}</p>
                                </div>

                                {/* Agent Endpoint */}
                                <div className="mt-3">
                                    <p className="text-xs text-white/50 mb-1">{isArabic ? 'رابط الوكيل:' : 'Agent Endpoint:'}</p>
                                    <div className="flex items-center gap-2">
                                        <code className="flex-1 text-xs text-white/70 bg-black/30 p-2 rounded truncate">
                                            {`https://brain.axiomid.app/agents/${agentId}/chat`}
                                        </code>
                                        <button className="p-2 hover:bg-white/10 rounded">
                                            <Copy className="w-4 h-4 text-cyan-400" />
                                        </button>
                                    </div>
                                </div>

                                {/* Blockchain Transaction */}
                                {deploymentTxHash && (
                                    <div className="mt-3">
                                        <p className="text-xs text-white/50 mb-1">{isArabic ? 'معاملة البلوك تشين:' : 'Blockchain TX:'}</p>
                                        <a
                                            href={`https://explorer.solana.com/tx/${deploymentTxHash}?cluster=devnet`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-purple-400 hover:text-purple-300 underline block truncate"
                                        >
                                            {deploymentTxHash.slice(0, 20)}...
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Back Button */}
                    <button
                        onClick={onBack}
                        className="mt-4 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                    >
                        {isArabic ? 'رجوع' : 'Back'}
                    </button>
                </div>

                {/* Right: Live Test Chat */}
                <div className="glass-card p-6 border border-purple-400/30 flex flex-col h-[600px]">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <MessagesSquare className="w-5 h-5 text-purple-400" />
                        <h3 className="text-lg font-orbitron text-purple-400">
                            {isArabic ? 'جرّب وكيلك' : 'Test Your Agent'}
                        </h3>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
                        {chatHistory.length === 0 && !deployed && (
                            <div className="text-center text-white/40 mt-20">
                                {isArabic ? 'فعّل الوكيل أولاً للبدء بالمحادثة' : 'Deploy agent first to start chatting'}
                            </div>
                        )}
                        {chatHistory.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user'
                                    ? 'bg-cyan-400/20 text-cyan-200 rounded-tr-none'
                                    : 'bg-white/10 text-gray-200 rounded-tl-none'
                                    }`}>
                                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {isChatting && (
                            <div className="flex justify-start">
                                <div className="bg-white/10 p-3 rounded-lg rounded-tl-none animate-pulse text-gray-500">
                                    {isArabic ? 'يفكر...' : 'Thinking...'}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Chat Input */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder={isArabic ? 'اسأل عن معلومات من الملف...' : 'Ask about your uploaded content...'}
                            disabled={!deployed}
                            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-400/50 disabled:opacity-30"
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!deployed || !chatInput.trim()}
                            className="px-5 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-black rounded-lg hover:shadow-lg hover:shadow-purple-400/50 transition-all disabled:opacity-30"
                        >
                            <Zap className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
            {/* Modals */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onSuccess={(u) => {
                    setUser(u);
                    setShowAuthModal(false);
                    // Automatically open payment modal after auth
                    setShowPaymentModal(true);
                }}
                isArabic={isArabic}
            />

            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onSuccess={(proof) => {
                    setPaymentProof(proof);
                    setShowPaymentModal(false);
                    handleDeployProcess(); // Auto-deploy after payment
                }}
                isArabic={isArabic}
                amount={0.99}
            />
        </div>
    );
}
