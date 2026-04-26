import { defineNuxtConfig } from 'nuxt/config'
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2026-04-23',
  runtimeConfig: {
    pgHost: process.env.PG_HOST || 'localhost',
    pgPort: process.env.PG_PORT || 5432,
    pgDatabase: process.env.PG_DATABASE || 'restaurant_db',
    pgUser: process.env.PG_USER || 'juliana',
    pgPassword: process.env.PG_PASSWORD || 'juliana2004',
    jwtSecret: process.env.JWT_SECRET || 'super-secret-key',
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  typescript: {
    strict: true,
    shim: false,
  },
  css: ['~/assets/styles/main.css'],
})
