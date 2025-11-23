'use client';

import React, { useState } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { Mail, Lock, LogIn, UserPlus, X } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (user: any) => void;
    isArabic: boolean;
}

export default function AuthModal({ isOpen, onClose, onSuccess, isArabic }: AuthModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const result = await signInWithPopup(auth, googleProvider);
            onSuccess(result.user);
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            let result;
            if (isLogin) {
                result = await signInWithEmailAndPassword(auth, email, password);
            } else {
                result = await createUserWithEmailAndPassword(auth, email, password);
            }
            onSuccess(result.user);
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md bg-dark-void border border-cyan-400/30 rounded-2xl p-8 shadow-2xl shadow-cyan-400/20">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Header */}
                <h2 className="text-2xl font-orbitron text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                    {isLogin
                        ? (isArabic ? 'تسجيل الدخول' : 'Welcome Back')
                        : (isArabic ? 'إنشاء حساب جديد' : 'Create Account')}
                </h2>

                {/* Google Login */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-lg font-bold hover:bg-gray-100 transition-all mb-6"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                    {isArabic ? 'المتابعة باستخدام Google' : 'Continue with Google'}
                </button>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-dark-void text-white/50">
                            {isArabic ? 'أو' : 'Or'}
                        </span>
                    </div>
                </div>

                {/* Email Form */}
                <form onSubmit={handleEmailAuth} className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                        <input
                            type="email"
                            placeholder={isArabic ? 'البريد الإلكتروني' : 'Email Address'}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-cyan-400/50"
                            required
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                        <input
                            type="password"
                            placeholder={isArabic ? 'كلمة المرور' : 'Password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-cyan-400/50"
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <span className="animate-pulse">...</span>
                        ) : isLogin ? (
                            <>
                                <LogIn className="w-5 h-5" />
                                {isArabic ? 'دخول' : 'Sign In'}
                            </>
                        ) : (
                            <>
                                <UserPlus className="w-5 h-5" />
                                {isArabic ? 'تسجيل' : 'Sign Up'}
                            </>
                        )}
                    </button>
                </form>

                {/* Toggle Mode */}
                <p className="text-center mt-6 text-sm text-white/60">
                    {isLogin
                        ? (isArabic ? 'ليس لديك حساب؟' : "Don't have an account?")
                        : (isArabic ? 'لديك حساب بالفعل؟' : "Already have an account?")}
                    {' '}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-cyan-400 hover:text-cyan-300 font-bold underline"
                    >
                        {isLogin
                            ? (isArabic ? 'إنشاء حساب' : 'Sign Up')
                            : (isArabic ? 'تسجيل الدخول' : 'Sign In')}
                    </button>
                </p>
            </div>
        </div>
    );
}
