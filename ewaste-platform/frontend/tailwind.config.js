/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          900: '#062C1B', // Deep forest green
          800: '#0A3F27',
          700: '#0E5C39',
          600: '#10B981', // Muted emerald
          500: '#22C55E',
          400: '#4ADE80',
          100: '#DCFCE7',
          50: '#F0FDF4'
        },
        limeAccent: {
          500: '#84CC16',
          400: '#A3E635'
        },
        charcoal: {
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'scan-line': 'scan 2.5s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite'
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(100%)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        }
      }
    }
  },
  plugins: []
};
