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
        primary: {
          50:  '#fdf4ff',
          100: '#fae8ff',
          200: '#f3d0fe',
          300: '#e9a8fd',
          400: '#d974fa',
          500: '#c044f0',
          600: '#a626d3',
          700: '#8b1ab0',
          800: '#731990',
          900: '#5f1875',
          950: '#3e0651',
        },
        accent: {
          50:  '#fff7ed',
          100: '#ffeed4',
          200: '#ffd9a8',
          300: '#ffbe72',
          400: '#ff9a3a',
          500: '#ff7a14',
          600: '#f05e09',
          700: '#c7440a',
          800: '#9e3610',
          900: '#7f2f11',
          950: '#451407',
        },
        gallery: {
          dark:    '#0a0a0f',
          surface: '#12121a',
          card:    '#1a1a26',
          border:  '#2a2a3e',
        }
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease-in-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'slide-in':   'slideIn 0.3s ease-out',
        'float':      'float 3s ease-in-out infinite',
        'glow':       'glow 2s ease-in-out infinite alternate',
        'shimmer':    'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' },                    '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideIn: { '0%': { transform: 'translateX(-20px)', opacity: '0' }, '100%': { transform: 'translateX(0)', opacity: '1' } },
        float:   { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        glow:    { '0%': { boxShadow: '0 0 5px #c044f0' },    '100%': { boxShadow: '0 0 20px #c044f0, 0 0 40px #c044f070' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' },   '100%': { backgroundPosition: '200% 0' } },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':  'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient':   'linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 50%, #0a0a0f 100%)',
        'card-gradient':   'linear-gradient(145deg, rgba(26,26,38,1) 0%, rgba(18,18,26,1) 100%)',
        'shimmer-gradient':'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-sm':  '0 0 10px rgba(192, 68, 240, 0.3)',
        'glow-md':  '0 0 20px rgba(192, 68, 240, 0.4)',
        'glow-lg':  '0 0 40px rgba(192, 68, 240, 0.5)',
        'card':     '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}
