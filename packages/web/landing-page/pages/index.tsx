import Head from 'next/head';
import { useState, useEffect } from 'react';
import HoloCoreWidget from '../components/HoloCoreWidget';
import TestSocketConnection from '../components/test-socket-connection';
import TestVoiceRecognition from '../components/test-voice-recognition';
import TestHoloCoreVisual from '../components/test-holocore-visual';

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <Head>
        <title>Axiom ID - Voice AI Partner</title>
        <meta name="description" content="Interactive holographic AI partner for Axiom ID" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Axiom ID <span className="text-blue-400">Holo-Partner</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Your voice-first, holographic AI assistant for the decentralized agent economy
          </p>
          
          <div className="flex flex-col items-center justify-center mt-16">
            <div className="relative w-64 h-64 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/30 animate-pulse">
              <div className="absolute inset-4 rounded-full bg-black/20 backdrop-blur-sm"></div>
              <div className="text-center z-10">
                <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <p className="text-sm">Say &quot;Hey Axiom&quot;</p>
              </div>
            </div>
            
            <div className="mt-8 text-gray-400">
              <p>Initializing Holo-Core...</p>
            </div>
          </div>
        </div>
        
        {isClient && (
          <>
            <div className="mt-8">
              <HoloCoreWidget />
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <TestSocketConnection />
              <TestVoiceRecognition />
            </div>
            <div className="mt-8">
              <TestHoloCoreVisual />
            </div>
          </>
        )}
      </main>

      <footer className="py-6 text-center text-gray-500 text-sm">
        <p>Powered by Axiom ID • Decentralized Agent Economy</p>
      </footer>
    </div>
  );
}