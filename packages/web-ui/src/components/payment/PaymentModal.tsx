'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { CreditCard, Wallet, Bitcoin, CheckCircle, X, Loader } from 'lucide-react';

// Initialize Stripe (Replace with your Publishable Key)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || 'pk_test_placeholder');

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (paymentProof: any) => void;
    isArabic: boolean;
    amount: number;
}

// Stripe Form Component
const StripeForm = ({ onSuccess, isArabic }: { onSuccess: (id: string) => void, isArabic: boolean }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        setProcessing(true);
        setError('');

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) return;

        // In production, fetch clientSecret from backend
        // const { clientSecret } = await fetch('/api/create-payment-intent').then(r => r.json());

        // Mock success for demo
        setTimeout(() => {
            onSuccess('pi_mock_123456789');
            setProcessing(false);
        }, 1500);

        /* Real implementation:
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card: cardElement }
        });
        if (error) setError(error.message || 'Payment failed');
        else if (paymentIntent.status === 'succeeded') onSuccess(paymentIntent.id);
        */
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-white rounded-lg border border-gray-200">
                <CardElement options={{
                    style: {
                        base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } },
                        invalid: { color: '#9e2146' },
                    },
                }} />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
                type="submit"
                disabled={!stripe || processing}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold transition-all disabled:opacity-50 flex justify-center"
            >
                {processing ? <Loader className="animate-spin" /> : (isArabic ? 'ادفع $0.99' : 'Pay $0.99')}
            </button>
        </form>
    );
};

export default function PaymentModal({ isOpen, onClose, onSuccess, isArabic, amount }: PaymentModalProps) {
    const [method, setMethod] = useState<'card' | 'paypal' | 'crypto' | 'moyasar'>('moyasar');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-lg bg-dark-void border border-green-400/30 rounded-2xl p-8 shadow-2xl shadow-green-400/10">
                <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white">
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-orbitron text-center mb-2 text-white">
                    {isArabic ? 'إتمام الدفع' : 'Complete Payment'}
                </h2>
                <p className="text-center text-green-400 font-bold text-xl mb-8">
                    ${amount.toFixed(2)} / {isArabic ? 'شهرياً' : 'month'}
                </p>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 p-1 bg-white/5 rounded-lg">
                    <button
                        onClick={() => setMethod('moyasar')}
                        className={`flex-1 py-2 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2 ${method === 'moyasar' ? 'bg-blue-500 text-white shadow-lg' : 'text-white/50 hover:bg-white/10'
                            }`}
                    >
                        <CreditCard className="w-4 h-4" /> {isArabic ? 'مدى / فيزا' : 'Mada/Visa'}
                    </button>
                    <button
                        onClick={() => setMethod('paypal')}
                        className={`flex-1 py-2 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2 ${method === 'paypal' ? 'bg-blue-600 text-white shadow-lg' : 'text-white/50 hover:bg-white/10'
                            }`}
                    >
                        <Wallet className="w-4 h-4" /> PayPal
                    </button>
                    <button
                        onClick={() => setMethod('crypto')}
                        className={`flex-1 py-2 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2 ${method === 'crypto' ? 'bg-orange-500 text-white shadow-lg' : 'text-white/50 hover:bg-white/10'
                            }`}
                    >
                        <Bitcoin className="w-4 h-4" /> Crypto
                    </button>
                </div>

                {/* Content */}
                <div className="min-h-[200px]">
                    {method === 'card' && (
                        <Elements stripe={stripePromise}>
                            <StripeForm
                                onSuccess={(id) => onSuccess({ provider: 'stripe', id })}
                                isArabic={isArabic}
                            />
                        </Elements>
                    )}

                    {method === 'paypal' && (
                        <PayPalScriptProvider options={{
                            clientId: "EC6AAV9Zx97xm-diYSUwUnGTf248suISLG-IGX8P0Dlv1IFjxVqnIzuAomrwuE-K9jf4DMHe5UK80R0r",
                            currency: "USD"
                        }}>
                            <PayPalButtons
                                style={{ layout: "vertical" }}
                                createOrder={(data, actions) => {
                                    return actions.order.create({
                                        intent: "CAPTURE",
                                        purchase_units: [{ amount: { currency_code: "USD", value: amount.toString() } }]
                                    });
                                }}
                                onApprove={async (data, actions) => {
                                    // const order = await actions.order.capture();
                                    onSuccess({ provider: 'paypal', id: data.orderID });
                                }}
                            />
                        </PayPalScriptProvider>
                    )}

                    {method === 'crypto' && (
                        <div className="text-center py-8">
                            <div className="bg-white/10 p-4 rounded-lg inline-block mb-4">
                                <img
                                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=solana:G5...xyz"
                                    alt="QR Code"
                                    className="w-32 h-32 opacity-80"
                                />
                            </div>
                            <p className="text-sm text-white/60 mb-4">
                                {isArabic ? 'امسح الرمز للدفع عبر Solana Pay' : 'Scan to pay via Solana Pay'}
                            </p>
                            <button
                                onClick={() => onSuccess({ provider: 'crypto', id: 'tx_mock_solana' })}
                                className="px-6 py-2 bg-orange-500 text-white rounded-lg text-sm font-bold"
                            >
                                {isArabic ? 'محاكاة الدفع' : 'Simulate Payment'}
                            </button>
                        </div>
                    )}

                    {method === 'moyasar' && (
                        <div className="space-y-4">
                            <div className="p-4 bg-white rounded-lg border border-gray-200">
                                <div className="flex gap-2 mb-4 justify-center">
                                    <img src="https://cdn.moyasar.com/static/assets/images/payments/mada.png" alt="Mada" className="h-6" />
                                    <img src="https://cdn.moyasar.com/static/assets/images/payments/visa.png" alt="Visa" className="h-6" />
                                    <img src="https://cdn.moyasar.com/static/assets/images/payments/master.png" alt="Mastercard" className="h-6" />
                                </div>
                                <input
                                    type="text"
                                    placeholder={isArabic ? "اسم حامل البطاقة" : "Cardholder Name"}
                                    className="w-full mb-3 p-2 border rounded text-black"
                                />
                                <input
                                    type="text"
                                    placeholder={isArabic ? "رقم البطاقة" : "Card Number"}
                                    className="w-full mb-3 p-2 border rounded text-black"
                                />
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        className="w-1/2 p-2 border rounded text-black"
                                    />
                                    <input
                                        type="text"
                                        placeholder="CVC"
                                        className="w-1/2 p-2 border rounded text-black"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    // Mock Moyasar payment
                                    setTimeout(() => onSuccess({ provider: 'moyasar', id: 'pay_mock_123456' }), 1000);
                                }}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-all"
                            >
                                {isArabic ? `ادفع ${amount.toFixed(2)} ريال` : `Pay SAR ${amount.toFixed(2)}`}
                            </button>
                            <p className="text-xs text-center text-white/40 mt-2">
                                Powered by Moyasar
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-6 text-center text-xs text-white/30">
                    <p>Secured by Stripe & PayPal. Encrypted via SSL.</p>
                </div>
            </div>
        </div>
    );
}
