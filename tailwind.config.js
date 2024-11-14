import { nextui } from '@nextui-org/theme';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'pop-blob': {
          '0%': { transform: 'scale(1)' },
          '33%': { transform: 'scale(1.2)' },
          '66%': { transform: 'scale(0.8)' },
          '100%': { transform: 'scale(1)' },
        },
        meteor: {
          '0%': { transform: 'translateY(-20%) translateX(-50%) rotate(-45deg)' },
          '100%': { transform: 'translateY(300%) translateX(-50%) rotate(-45deg)' },
        },
      },
      animation: {
        'pop-blob': 'pop-blob 5s infinite',
        meteor: 'meteor var(--duration) var(--delay) linear infinite',
      },
      backdropFilter: {
        'blur-20': 'blur(20px)',
        'blur-25': 'blur(25px)',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            background: '#FFFFFF',
            foreground: '#11181C',
            primary: {
              DEFAULT: '#006FEE',
              foreground: '#FFFFFF',
            },
            // Add more custom colors as needed
          },
        },
        dark: {
          colors: {
            background: '#000000',
            foreground: '#ECEDEE',
            primary: {
              DEFAULT: '#006FEE',
              foreground: '#FFFFFF',
            },
            // Add more custom colors as needed
          },
        },
      },
    }),
    require('tailwindcss-animate'),
  ],
};