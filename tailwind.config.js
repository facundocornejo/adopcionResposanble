/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fondos cálidos
        cream: '#FAF7F2',
        warm: {
          50: '#FDF8F3',
          100: '#FAF7F2',
        },
        // Textos marrones (tierra, confianza)
        brown: {
          50: '#F7F3EF',
          100: '#E8E2DB',
          200: '#D4CBC0',
          300: '#C4B8AD',
          400: '#A69787',
          500: '#8B7E74',
          600: '#6B5D52',
          700: '#5C4B3A',
          800: '#4A3728',
          900: '#3D2E22',
          950: '#2D1F14',
        },
        // Acento primario (terracotta - amor, acción)
        terracotta: {
          50: '#FDF5F0',
          100: '#FAE8DE',
          500: '#D97756',
          600: '#C4613D',
          700: '#A84E2F',
        },
        // Acento secundario (sage - vida, esperanza)
        sage: {
          100: '#E8F0E6',
          200: '#D1E3CD',
          500: '#7D9B76',
          600: '#6B8A63',
        },
        // Estados de animales
        estado: {
          disponible: '#7D9B76',
          'en-proceso': '#E5A84B',
          adoptado: '#9B8AC4',
          'en-transito': '#6BA3BE',
        },
        // Error y warning cálidos
        error: '#C45C4A',
        warning: '#D4915A',
      },
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out',
        slideUp: 'slideUp 0.4s ease-out',
        slideDown: 'slideDown 0.3s ease-out',
        scaleIn: 'scaleIn 0.2s ease-out',
        shimmer: 'shimmer 2s infinite linear',
        countUp: 'countUp 0.5s ease-out',
        float: 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
