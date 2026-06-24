import { i18nLocales } from './i18n/languages-list'

const SITE_URL = process.env.NUXT_PUBLIC_SITE_URL || ''
const SITE_NAME = process.env.NUXT_SITE_NAME || ''

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {
    enabled: false,
    timeline: {
      enabled: true
    }
  },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@nuxt/icon',
    '@nuxt/image',
  ],
  icon: {
    serverBundle: 'remote'
  },
  tailwindcss: {
    cssPath: '@/assets/styles/main.scss',
    exposeConfig: true,
    viewer: true
  },
  app: {
    rootId: 'app',
    head: {
      viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
      charset: 'utf-8',
      titleTemplate: `%s | ${SITE_NAME}`,
      title: 'Welcome',
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg', id: 'dynamic-favicon' }]
    }
  },
  runtimeConfig: {
    public: {
      environment: process.env.NUXT_PUBLIC_ENVIRONMENT || 'dev',
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '',
      socketUrl: process.env.NUXT_PUBLIC_SOCKET_URL || '',
      siteUrl: SITE_URL
    }
  },
  i18n: {
    strategy: 'prefix_except_default',
    baseUrl: SITE_URL,
    locales: i18nLocales,
    defaultLocale: 'en',
    // detectBrowserLanguage: {
    //   useCookie: true,
    //   cookieKey: 'locale',
    //   redirectOn: 'all',
    //   alwaysRedirect: true,
    //   fallbackLocale: 'en'
    // }
  }
})
