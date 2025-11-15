import Head from 'next/head';
import { useState, useEffect } from 'react';
import HoloCoreWidget from '../components/HoloCoreWidget';

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
          
          <div className="flex flex-col items-center justify-center mt-8">
            <p className="text-lg text-gray-400 mb-4">Activate the Holo-Core by saying &quot;Hey Axiom&quot;</p>
            <p className="text-sm text-gray-500 mb-8">Or click the &quot;Start Listening&quot; button in the interface below</p>
          </div>
        </div>
        
        {isClient && (
          <>
            <div className="mt-8">
              <HoloCoreWidget />
            </div>
            
            <div className="mt-16 max-w-3xl mx-auto text-gray-400">
              <h2 className="text-2xl font-bold mb-4 text-center">Holo-Factory Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                  <div className="text-blue-400 text-2xl mb-3">🔊</div>
                  <h3 className="text-lg font-semibold mb-2">Voice-First Interface</h3>
                  <p className="text-sm">Control everything with your voice. Just say "Hey Axiom" to activate.</p>
                </div>
                
                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                  <div className="text-purple-400 text-2xl mb-3">✨</div>
                  <h3 className="text-lg font-semibold mb-2">Holographic Visualization</h3>
                  <p className="text-sm">Interactive 3D visualization that responds to your commands.</p>
                </div>
                
                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                  <div className="text-green-400 text-2xl mb-3">🛠️</div>
                  <h3 className="text-lg font-semibold mb-2">SDK Factory</h3>
                  <p className="text-sm">Generate custom agent SDKs with a single voice command.</p>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <p className="text-lg mb-2">Connected to live backend at <span className="text-blue-400">https://api.axiomid.app</span></p>
                <p className="text-sm text-gray-500">Real-time communication powered by Socket.io</p>
              </div>
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