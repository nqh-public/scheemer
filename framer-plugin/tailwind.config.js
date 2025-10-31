/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
      },
      fontSize: {
        'xs': '10px',
        'sm': '12px',
        'base': '14px',
        'lg': '16px',
      },
      colors: {
        'framer-text': 'var(--framer-color-text)',
        'framer-text-secondary': 'var(--framer-color-text-secondary)',
        'framer-text-tertiary': 'var(--framer-color-text-tertiary)',
        'framer-bg': 'var(--framer-color-bg)',
        'framer-bg-secondary': 'var(--framer-color-bg-secondary)',
        'framer-tint': 'var(--framer-color-tint)',
        'framer-tint-border': 'var(--framer-color-tint-border)',
        'framer-divider': 'var(--framer-color-divider)',
      },
    },
  },
  plugins: [],
}

