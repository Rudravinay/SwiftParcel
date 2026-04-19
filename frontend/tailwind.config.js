/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        p: {
          50:'#f0fdf9', 100:'#ccfbef', 200:'#99f6e0', 300:'#5eead4',
          400:'#2dd4bf', 500:'#14b8a6', 600:'#0d9488', 700:'#0f766e',
          800:'#115e59', 900:'#134e4a',
        },
        dark: {
          900:'#0a0f1e', 800:'#0d1426', 700:'#111827', 600:'#1a2235',
          500:'#1f2a3d', 400:'#243044', 300:'#2d3a50',
        }
      },
      fontFamily: {
        sans: ['"Outfit"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
        display: ['"Syne"', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 30px rgba(20,184,166,0.15)',
        'glow-lg': '0 0 60px rgba(20,184,166,0.2)',
        'card': '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(20,184,166,0.2)',
        'modal': '0 25px 80px rgba(0,0,0,0.8)',
      },
      backgroundImage: {
        'grid': 'linear-gradient(rgba(20,184,166,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(20,184,166,0.04) 1px,transparent 1px)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      backgroundSize: { 'grid': '40px 40px' },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-right': 'slideRight 0.4s ease forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeUp:     { from:{ opacity:0, transform:'translateY(20px)' }, to:{ opacity:1, transform:'translateY(0)' } },
        fadeIn:     { from:{ opacity:0 }, to:{ opacity:1 } },
        slideRight: { from:{ opacity:0, transform:'translateX(-16px)' }, to:{ opacity:1, transform:'translateX(0)' } },
        pulseGlow:  { '0%,100%':{ boxShadow:'0 0 20px rgba(20,184,166,0.3)' }, '50%':{ boxShadow:'0 0 40px rgba(20,184,166,0.6)' } },
        shimmer:    { '0%':{ backgroundPosition:'-200% 0' }, '100%':{ backgroundPosition:'200% 0' } },
        float:      { '0%,100%':{ transform:'translateY(0)' }, '50%':{ transform:'translateY(-8px)' } },
      },
    },
  },
  plugins: [],
}
