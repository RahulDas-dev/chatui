/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: {
          750: '#2d3748', // A mid-dark gray for the dark theme
        },
      },      animation: {
        'fadeIn': 'fadeIn 0.3s ease-in-out',
        'slideInRight': 'slideInRight 0.3s ease-out',
        'slideOutRight': 'slideOutRight 0.3s ease-in',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'robot-pulse': 'robotPulse 1.5s ease-in-out infinite',
        'robot-blink': 'robotBlink 3s ease-in-out infinite',
        'typing-dot': 'typingDot 1s infinite',
        'typing-dot-1': 'typingDot 1s infinite',
        'typing-dot-2': 'typingDot 1s infinite 0.2s',
        'typing-dot-3': 'typingDot 1s infinite 0.4s',
        'glow': 'glow 1.5s ease-in-out infinite',
      },      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        robotPulse: {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '50%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '0.7' },
        },
        robotBlink: {
          '0%, 100%': { opacity: '1', color: 'rgb(107, 114, 128)' },
          '50%': { opacity: '0.85', color: 'rgb(59, 130, 246)' },
        },
        typingDot: {
          '0%, 100%': { opacity: '0.2', transform: 'translateY(0px)' },
          '50%': { opacity: '1', transform: 'translateY(-1px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 0 rgba(59, 130, 246, 0)' },
          '50%': { boxShadow: '0 0 8px rgba(59, 130, 246, 0.3)' },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'xl': '1rem',
      },
    },
  },
  plugins: [],
}