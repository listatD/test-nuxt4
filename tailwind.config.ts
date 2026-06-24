import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/App.vue',
    './app/plugins/**/*.{js,ts}',
    './app/composables/**/*.{js,ts}',
    './app/utils/**/*.{js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': 'rgb(var(--color-brand-primary) / <alpha-value>)',
        'auth-text': 'rgb(var(--color-auth-text) / <alpha-value>)',
        'auth-page': 'rgb(var(--color-auth-page) / <alpha-value>)',
        'auth-description': 'rgb(var(--color-auth-description) / <alpha-value>)',
        'auth-title': 'rgb(var(--color-auth-title) / <alpha-value>)',
        'auth-header': 'rgb(var(--color-auth-header) / <alpha-value>)',
        'auth-border': 'rgb(var(--color-auth-border) / <alpha-value>)',
        'auth-card': 'rgb(var(--color-auth-card) / <alpha-value>)',
        'auth-chrome': 'rgb(var(--color-auth-chrome) / <alpha-value>)'
      },
      spacing: {},
      fontFamily: {
        sans: ['Roboto', 'Arial', 'sans-serif']
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
