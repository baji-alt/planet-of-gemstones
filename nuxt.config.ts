// https://nuxt.com/docs/api/configuration/nuxt-config
const SITE_URL = process.env.NUXT_PUBLIC_SITE_URL || 'https://planet-of-gemstones.netlify.app'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n', '@nuxt/image'],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      siteUrl: SITE_URL,
      // International format, digits only (no +). Replace with the store's real number.
      whatsappNumber: process.env.NUXT_PUBLIC_WHATSAPP_NUMBER || '96100000000',
      instagram: 'planet_of_gemstones',
      // Optional: path to an .hdr environment map in /public (e.g. /hdr/studio_small_1k.hdr).
      // Empty = procedural studio environment (zero download).
      hdriUrl: process.env.NUXT_PUBLIC_HDRI_URL || '',
    },
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      titleTemplate: '%s · Planet of Gemstones',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#7A1F3D' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&family=Noto+Kufi+Arabic:wght@300;400;500;600&display=swap',
        },
      ],
    },
  },

  i18n: {
    baseUrl: SITE_URL,
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    langDir: 'locales',
    locales: [
      { code: 'en', language: 'en-US', dir: 'ltr', name: 'English', file: 'en.json' },
      { code: 'ar', language: 'ar-LB', dir: 'rtl', name: 'العربية', file: 'ar.json' },
    ],
    detectBrowserLanguage: { useCookie: true, cookieKey: 'pog_lang', redirectOn: 'root' },
  },

  image: {
    format: ['avif', 'webp'],
    quality: 80,
    screens: { xs: 360, sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536 },
  },

  tailwindcss: { viewer: false },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/ar'],
      // filter query strings are client-side state; prerender each page once
      ignore: [route => route.includes('?')],
    },
    compressPublicAssets: true,
  },

  vite: {
    build: {
      // three.js lives in its own lazy chunk; keep the warning meaningful.
      chunkSizeWarningLimit: 900,
    },
  },
})
