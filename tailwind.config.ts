import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './plugins/**/*.{js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': 'rgb(var(--color-brand-primary) / <alpha-value>)'
      },
      spacing: {},
      fontFamily: {
        sans: ['Graphik', 'sans-serif'],
        serif: ['Merriweather', 'serif']
      },
      fontSize: {
        'brand-font-size': 'var(--font-size-brand)'
      },
      lineHeight: {
        'brand-line-height': 'var(--line-height-brand)'
      }
    }
  },
  plugins: []
} satisfies Config
