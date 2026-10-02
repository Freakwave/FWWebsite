import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./architectural_landing_page.html', './src/**/*.{html,js,svg}'],
  theme: {
    extend: {
      colors: {
        parchment: '#102b24',
        'parchment-subtle': '#183a30',
        'parchment-panel': '#214638',
        'blueprint-border': '#456858',
        'blueprint-line': '#345749',
        'drafting-ink': '#e8f0e8',
        'forest-deep': '#091d18',
        'technical-orange': '#f28c28',
        'technical-orange-hover': '#d97816',
        'gate-emerald': '#83c29d',
        'gate-amber': '#f28c28',
        'hitl-blue': '#9bbcf0',
        human: '#f0a052',
        'human-soft': '#28483a',
        advisory: '#9bbcf0',
        neutral: {
          50: '#f4f7f4',
          100: '#e1eae3',
          200: '#25483c',
          300: '#3b5b4c',
          400: '#688172',
          500: '#a4b7aa',
          600: '#bdccc1',
          700: '#d4dfd7',
          800: '#e8f0e8',
          900: '#f6f8f6',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [forms],
};
