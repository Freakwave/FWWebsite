import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./architectural_landing_page.html', './src/**/*.{html,js,svg}'],
  theme: {
    extend: {
      colors: {
        parchment: '#f4f1ea',
        'parchment-subtle': '#eae6dc',
        'parchment-panel': '#dfd9cc',
        'blueprint-border': '#cfc8ba',
        'blueprint-line': '#ded8ca',
        'drafting-ink': '#111111',
        'technical-orange': '#ff3b00',
        'technical-orange-hover': '#e03400',
        'gate-emerald': '#008744',
        'gate-amber': '#d97706',
        'hitl-blue': '#1e40af',
        human: '#b45309',
        'human-soft': '#fffaf3',
        advisory: '#1d4ed8',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [forms],
};
