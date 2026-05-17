import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#F2F6FB',
          100: '#E2EDF7',
          200: '#C4DAEA',
          300: '#9BB8D3',
          500: '#3B6EA5',
          600: '#2F5C8F',
          700: '#244B75',
          900: '#162F4A',
        },
        amber: {
          DEFAULT: '#C47B2B',
          light:   '#E8A44A',
          pale:    '#FEF3E2',
          bg:      '#FDF5EA',
        },
        'blue-pale': '#E8EFF6',
        'blue-mist': '#F0F4F8',
        green: {
          DEFAULT: '#2A7A5A',
          bg:      '#EAF5EF',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        pill: '100px',
      },
      boxShadow: {
        soft: '0 2px 16px rgba(22,47,74,.07)',
        card: '0 4px 24px rgba(22,47,74,.10)',
      },
      animation: {
        fadeUp:   'fadeUp .65s ease forwards',
        floatY:   'floatY 7s ease-in-out infinite',
        pinPulse: 'pinPulse 3.5s ease-in-out infinite',
        spin:     'spin .8s linear infinite',
        mapPing:  'mapPing 2.5s infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        floatY: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-9px)' },
        },
        pinPulse: {
          '0%,100%': { boxShadow: '0 0 0 3px rgba(196,123,43,.25),0 0 0 6px rgba(196,123,43,.1)' },
          '50%':     { boxShadow: '0 0 0 5px rgba(196,123,43,.18),0 0 0 10px rgba(196,123,43,.06)' },
        },
        mapPing: {
          '0%':   { transform: 'scale(1)', opacity: '.5' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
