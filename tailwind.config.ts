import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './contexts/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0A1C2E',
        gold: '#C6A43F',
        'dashboard-bg': '#F4F1EA',
        cream: '#FDFBF7',
        'text-primary': '#1A2A3A',
        'text-secondary': '#5A6B7A',
        linen: '#E8E2D9',
        success: '#2E6B47',
        error: '#B23C3C',
        vio: {
          white: '#FFFFFF',
          cream: '#FDFBF7',
          navy: '#0A1C2E',
          gold: '#C6A43F',
          muted: '#5A6B7A',
          linen: '#E8E2D9',
          success: '#2E6B47',
          error: '#B23C3C',
        },
      },
      fontFamily: {
        heading: ['var(--font-cormorant-garamond)', 'serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        accent: ['var(--font-cormorant-sc)', 'serif'],
      },
      maxWidth: {
        dashboard: '1280px',
      },
    },
  },
  plugins: [],
}

export default config
