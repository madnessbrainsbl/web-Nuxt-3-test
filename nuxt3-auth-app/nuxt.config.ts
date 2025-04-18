// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@nuxt/ui'
  ],

  css: [
    '~/assets/scss/main.scss'
  ],

  typescript: {
    strict: true
  },

  app: {
    head: {
      title: 'Nuxt 3 Auth App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  compatibilityDate: '2025-04-18'
})