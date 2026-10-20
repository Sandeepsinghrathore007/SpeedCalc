import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#070908',
          subtle: '#0c120e',
          surface: '#111814',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        card: {
          DEFAULT: 'rgba(15, 23, 19, 0.82)',
          hover: 'rgba(22, 33, 27, 0.92)',
          border: 'rgba(16, 185, 129, 0.16)',
        },
        brand: {
          emerald: '#10b981',
          mint: '#34d399',
          amber: '#f59e0b',
          coral: '#ef4444',
          violet: '#8b5cf6',
          cyan: '#06b6d4',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.35)',
        'glow-amber': '0 0 20px -3px rgba(245, 158, 11, 0.35)',
        'glow-coral': '0 0 20px -3px rgba(239, 68, 68, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
} satisfies Config;
