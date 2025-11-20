'use client';

import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-axiom-dark text-white p-4">
      <div className="glass-panel p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="w-16 h-16 text-axiom-red" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          href="/" 
          className="inline-flex items-center px-6 py-3 glass-panel hover:border-axiom-cyan/50 transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}