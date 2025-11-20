'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-axiom-dark via-axiom-purple/10 to-axiom-dark" />
      
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-axiom-cyan rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <Sparkles className="w-6 h-6 text-axiom-cyan" />
          <span className="text-sm font-mono text-axiom-cyan uppercase tracking-wider">
            Autonomous Agent Economy
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-7xl font-black mb-6 bg-gradient-to-r from-axiom-cyan via-axiom-purple to-axiom-cyan bg-clip-text text-transparent"
        >
          Axiom Command Center
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Monitor, manage, and optimize your decentralized agent network in real-time. 
          Built for the future of autonomous systems.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center justify-center gap-4"
        >
          <button className="px-8 py-4 rounded-full bg-gradient-to-r from-axiom-cyan to-axiom-purple font-bold text-lg hover:shadow-[0_0_40px_rgba(0,240,255,0.6)] transition-all flex items-center gap-2">
            View Dashboard
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button className="px-8 py-4 rounded-full border-2 border-axiom-cyan text-axiom-cyan font-bold text-lg hover:bg-axiom-cyan/10 transition-all">
            Learn More
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto"
        >
          {[
            { value: '12+', label: 'Active Agents' },
            { value: '94%', label: 'Network Health' },
            { value: '18K+', label: 'Tasks Completed' },
          ].map((stat, i) => (
            <div key={i} className="glass-panel p-6">
              <div className="text-4xl font-bold font-mono text-axiom-cyan mb-2">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}