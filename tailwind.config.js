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
          100: '#E8E2DB',
          200: '#D4CBC0',
          300: '#C4B8AD',
          500: '#8B7E74',
          600: '#6B5D52',
          700: '#5C4B3A',
          900: '#3D2E22',
        },
        // Acento primario (terracotta - amor, acción)
        terracotta: {
          500: '#D97756',
          600: '#C4613D',
          700: '#A84E2F',
        },
        // Acento secundario (sage - vida, esperanza)
        sage: {
          100: '#E8F0E6',
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
    },
  },
  plugins: [],
}
