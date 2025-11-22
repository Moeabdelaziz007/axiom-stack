import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'axiom-dark': '#050505',
        'axiom-panel': '#0F111A',
        'axiom-glass': 'rgba(255, 255, 255, 0.03)',
        'axiom-cyan': '#00F0FF',
        'axiom-purple': '#7000FF',
        'axiom-red': '#FF003C',
        'axiom-success': '#00FF94',
        'axiom-warning': '#FCEE0A',
        // Cyberpunk Palette
        'cyber-cyan': '#00FFFF',
        'neon-purple': '#9D4EDD',
        'dark-void': '#0A0E27',
        'holo-blue': '#4FACFE',
        'axiom-glow': '#00F0FF',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        display: ['var(--font-space)', 'sans-serif'],
        // Cyberpunk Fonts
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      backdropBlur: {
        'glass': '20px',
      },
      saturate: {
        'glass': '180%',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow-cyan': '0 0 20px rgba(0, 240, 255, 0.5)',
        'glow-purple': '0 0 20px rgba(112, 0, 255, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-fast': 'pulse 0.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 1.5s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'slide-in': 'slideIn 0.2s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'border-flow': 'borderFlow 3s linear infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px var(--axiom-cyan)' },
          '50%': { boxShadow: '0 0 20px var(--axiom-cyan)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0, 240, 255, 0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(0, 240, 255, 0.6)' },
        },
        slideIn: {
          from: { transform: 'translateY(10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        borderFlow: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;