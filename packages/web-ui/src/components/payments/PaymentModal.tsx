'use client';

import React, { useState, useEffect } from 'react';
import { X, CreditCard, Wallet, Smartphone, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import DataTicker from '@/components/common/DataTicker';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    currency: string;
    itemName: string;
    onSuccess: () => void;
}

type PaymentMethod = 'CRYPTO' | 'CARD' | 'PAYPAL' | 'GOOGLE_PAY';

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, amount, currency, itemName, onSuccess }) => {
    const { status, connectWallet } = useWallet();
    const connected = status === 'connected';

    const [method, setMethod] = useState<PaymentMethod>('CRYPTO');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<'SELECT' | 'CONFIRM' | 'PROCESSING' | 'SUCCESS'>('SELECT');

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setStep('SELECT');
            setIsProcessing(false);
            setError(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handlePayment = async () => {
        setIsProcessing(true);
        setError(null);
        setStep('PROCESSING');

        try {
            // Simulate API call / Transaction
            await new Promise(resolve => setTimeout(resolve, 3000));

            setStep('SUCCESS');
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 2000);
        } catch (err) {
            setError('Transaction failed. Please try again.');
            setStep('CONFIRM');
        } finally {
            setIsProcessing(false);
        }
    };

    const cryptoAmount = currency === 'AXM' ? amount : (amount / 150).toFixed(4); // Mock conversion
    const cryptoSymbol = currency === 'AXM' ? 'AXM' : 'SOL';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-void/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md bg-dark-void border border-cyber-cyan/30 rounded-2xl shadow-[0_0_50px_rgba(0,255,255,0.2)] overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                    <h3 className="text-xl font-orbitron text-white">Secure Checkout</h3>
                    <button onClick={onClose} className="text-white/50 hover:text-white transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">

                    {/* Data Ticker - Live Exchange Rate */}
                    {currency !== 'USD' && (
                        <DataTicker 
                            fromCurrency="USD" 
                            toCurrency="AXM" 
                            baseAmount={1} 
                            className="mb-6"
                        />
                    )}

                    {/* Order Summary */}
                    <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
                        <p className="text-sm text-white/50 font-rajdhani mb-1">Purchasing</p>
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-white font-orbitron">{itemName}</span>
                            <span className="text-xl font-mono text-cyber-cyan">
                                {currency === 'USD' ? '$' : ''}{amount} {currency !== 'USD' ? currency : ''}
                            </span>
                        </div>
                    </div>

                    {step === 'SELECT' && (
                        <div className="space-y-4">
                            <p className="text-sm text-white/70 font-rajdhani mb-2">Select Payment Method</p>

                            <button
                                onClick={() => setMethod('CRYPTO')}
                                className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${method === 'CRYPTO'
                                        ? 'bg-cyber-cyan/10 border-cyber-cyan shadow-glow-cyan'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                <div className={`p-2 rounded-lg ${method === 'CRYPTO' ? 'bg-cyber-cyan text-dark-void' : 'bg-white/10 text-white'}`}>
                                    <Wallet className="w-6 h-6" />
                                </div>
                                <div className="text-left flex-1">
                                    <p className="font-bold text-white font-orbitron">Crypto Wallet</p>
                                    <p className="text-xs text-white/50 font-rajdhani">Solana, Ethereum, USDC</p>
                                </div>
                                {method === 'CRYPTO' && <CheckCircle className="w-5 h-5 text-cyber-cyan" />}
                            </button>

                            <button
                                onClick={() => setMethod('CARD')}
                                className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${method === 'CARD'
                                        ? 'bg-neon-purple/10 border-neon-purple shadow-glow-purple'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                <div className={`p-2 rounded-lg ${method === 'CARD' ? 'bg-neon-purple text-white' : 'bg-white/10 text-white'}`}>
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <div className="text-left flex-1">
                                    <p className="font-bold text-white font-orbitron">Credit / Debit Card</p>
                                    <p className="text-xs text-white/50 font-rajdhani">Powered by Stripe</p>
                                </div>
                                {method === 'CARD' && <CheckCircle className="w-5 h-5 text-neon-purple" />}
                            </button>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setMethod('PAYPAL')}
                                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${method === 'PAYPAL'
                                            ? 'bg-holo-blue/10 border-holo-blue shadow-glow-blue'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    <span className="font-bold text-white font-orbitron">PayPal</span>
                                </button>
                                <button
                                    onClick={() => setMethod('GOOGLE_PAY')}
                                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${method === 'GOOGLE_PAY'
                                            ? 'bg-white/20 border-white shadow-glow-white'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    <span className="font-bold text-white font-orbitron">GPay</span>
                                </button>
                            </div>

                            <button
                                onClick={() => setStep('CONFIRM')}
                                className="w-full py-4 mt-4 bg-gradient-to-r from-cyber-cyan to-holo-blue text-dark-void font-bold rounded-xl hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all font-orbitron flex items-center justify-center gap-2"
                            >
                                Continue <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {step === 'CONFIRM' && (
                        <div className="space-y-6 animate-fade-in">
                            {method === 'CRYPTO' && (
                                <div className="text-center">
                                    {!connected ? (
                                        <div className="space-y-4">
                                            <AlertCircle className="w-12 h-12 text-axiom-warning mx-auto" />
                                            <p className="text-white font-rajdhani">Please connect your wallet to proceed.</p>
                                            <button
                                                onClick={connectWallet}
                                                className="w-full py-3 bg-axiom-warning/20 border border-axiom-warning text-axiom-warning font-bold rounded-xl hover:bg-axiom-warning/30 transition font-orbitron"
                                            >
                                                Connect Wallet
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="p-4 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-xl">
                                                <p className="text-sm text-white/60 mb-1">Estimated Total</p>
                                                <p className="text-3xl font-mono text-cyber-cyan">{cryptoAmount} {cryptoSymbol}</p>
                                            </div>
                                            <p className="text-xs text-white/40 font-rajdhani">
                                                Network Fee: ~0.00005 SOL
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {method === 'CARD' && (
                                <div className="space-y-4">
                                    {/* Mock Card Form */}
                                    <input type="text" placeholder="Card Number" className="w-full p-3 bg-dark-void border border-white/20 rounded-lg text-white font-mono" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" placeholder="MM/YY" className="w-full p-3 bg-dark-void border border-white/20 rounded-lg text-white font-mono" />
                                        <input type="text" placeholder="CVC" className="w-full p-3 bg-dark-void border border-white/20 rounded-lg text-white font-mono" />
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-4 mt-8">
                                <button
                                    onClick={() => setStep('SELECT')}
                                    className="flex-1 py-3 border border-white/20 text-white/70 font-bold rounded-xl hover:bg-white/5 transition font-rajdhani"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handlePayment}
                                    disabled={method === 'CRYPTO' && !connected}
                                    className="flex-1 py-3 bg-axiom-success text-dark-void font-bold rounded-xl hover:bg-axiom-success/90 transition font-orbitron disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Pay Now
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'PROCESSING' && (
                        <div className="text-center py-12 animate-fade-in">
                            <Loader2 className="w-16 h-16 text-cyber-cyan animate-spin mx-auto mb-6" />
                            <h4 className="text-xl font-orbitron text-white mb-2">Processing Payment...</h4>
                            <p className="text-white/50 font-rajdhani">Please do not close this window.</p>
                        </div>
                    )}

                    {step === 'SUCCESS' && (
                        <div className="text-center py-12 animate-fade-in">
                            <div className="w-20 h-20 bg-axiom-success/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-axiom-success shadow-[0_0_30px_rgba(0,255,148,0.4)]">
                                <CheckCircle className="w-10 h-10 text-axiom-success" />
                            </div>
                            <h4 className="text-2xl font-orbitron text-white mb-2">Payment Successful!</h4>
                            <p className="text-white/50 font-rajdhani">Redirecting...</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
