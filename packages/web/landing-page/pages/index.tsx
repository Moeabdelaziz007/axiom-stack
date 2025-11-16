import Head from 'next/head';
import { useState, useEffect } from 'react';
import HoloCoreWidget from '../components/HoloCoreWidget';
import ParticleBackground from '../components/ParticleBackground';

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      <Head>
        <title>Axiom ID - Voice AI Partner | Holo-Core Interface</title>
        <meta name="description" content="Experience the future of AI interaction with Axiom ID's Holo-Core - a voice-first, holographic AI partner for the decentralized agent economy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Particle Background */}
      {isClient && <ParticleBackground />}

      <main className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-block mb-6">
            <div className="glass-strong rounded-full px-6 py-2 text-sm font-medium text-blue-300 border border-blue-500/30">
              ✨ Powered by Advanced AI & Blockchain
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-gradient-blue">Axiom ID</span>
            <br />
            <span className="text-white">Holo-Core Interface</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience the future of AI interaction with our voice-first, holographic assistant
            for the <span className="text-blue-400 font-semibold">decentralized agent economy</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="glass-strong rounded-lg px-6 py-3 text-sm">
              <span className="text-gray-400">Try saying:</span>{' '}
              <span className="text-blue-400 font-semibold">&quot;Hey Axiom&quot;</span>
            </div>
            <div className="glass-strong rounded-lg px-6 py-3 text-sm">
              <span className="text-gray-400">Or use the</span>{' '}
              <span className="text-purple-400 font-semibold">widget below →</span>
            </div>
          </div>
        </div>

        {/* Features Section */}
        {isClient && (
          <div className="max-w-6xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              <span className="text-gradient">Holo-Factory Features</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Voice-First Interface */}
              <div className="glass-strong rounded-2xl p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 group">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 orb-glow-listening">
                  <span className="text-3xl">🎤</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-blue-300">Voice-First Interface</h3>
                <p className="text-gray-300 leading-relaxed">
                  Control everything with your voice. Natural language processing powered by advanced AI.
                  Just say &quot;Hey Axiom&quot; to activate your personal assistant.
                </p>
              </div>

              {/* Holographic Visualization */}
              <div className="glass-strong rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 orb-glow-building">
                  <span className="text-3xl">✨</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-purple-300">Holo-Core Visualization</h3>
                <p className="text-gray-300 leading-relaxed">
                  Beautiful 2D holographic interface that responds to your commands with dynamic
                  animations and state-aware visual feedback.
                </p>
              </div>

              {/* SDK Factory */}
              <div className="glass-strong rounded-2xl p-8 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 group">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 orb-glow-speaking">
                  <span className="text-3xl">🛠️</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-green-300">SDK Factory</h3>
                <p className="text-gray-300 leading-relaxed">
                  Generate custom agent SDKs with a single voice command. Build, deploy, and manage
                  autonomous agents in the decentralized economy.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Technical Details */}
        {isClient && (
          <div className="max-w-4xl mx-auto mb-20">
            <div className="glass-strong rounded-2xl p-8 border border-white/10">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2 text-gradient">Live Backend Connection</h3>
                <p className="text-gray-400">Real-time communication powered by Socket.io</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-2">Backend API</div>
                  <div className="text-blue-400 font-mono text-sm break-all">
                    https://api.axiomid.app
                  </div>
                </div>
                
                <div className="glass rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-2">Status</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 font-medium">Live & Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mb-20">
          <div className="glass-strong rounded-2xl p-12 max-w-3xl mx-auto border border-blue-500/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Experience the Future?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Activate the Holo-Core widget and start your journey into the decentralized agent economy
            </p>
            <div className="inline-block glass rounded-full px-8 py-4 text-lg font-semibold text-blue-300 border border-blue-500/30 animate-pulse-slow">
              👉 Check the bottom-right corner
            </div>
          </div>
        </div>
      </main>

      {/* HoloCoreWidget - Fixed Position */}
      {isClient && <HoloCoreWidget />}

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center border-t border-white/10">
        <div className="glass-strong inline-block rounded-full px-6 py-3">
          <p className="text-gray-400 text-sm">
            Powered by <span className="text-blue-400 font-semibold">Axiom ID</span> • 
            Decentralized Agent Economy • 
            <span className="text-purple-400"> Built with Next.js & TailwindCSS</span>
          </p>
        </div>
      </footer>
    </div>
  );
}