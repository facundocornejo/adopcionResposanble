/**
 * Environment Configuration
 * Centraliza las variables de entorno
 *
 * Dev: usa proxy de Vite (target en vite.config.ts) → localhost:3000
 * Prod: usa VITE_API_URL de .env.production → Render
 */
const isDev = import.meta.env.DEV

export const config = {
  apiUrl: isDev ? '' : (import.meta.env.VITE_API_URL || 'https://adopcion-api.onrender.com'),
  apiTimeout: isDev ? 10000 : 15000,
} as const

export type Config = typeof config
