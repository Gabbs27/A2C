import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'

const SITE_URL = process.env.VITE_SITE_URL || 'https://a2cinternational.com'

// Deploy dual: GitHub Pages sirve bajo /A2C/ (default); Vercel construye
// con VITE_BASE_PATH=/ (ver vercel.json).
const BASE = process.env.VITE_BASE_PATH || '/A2C/'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: SITE_URL,
      dynamicRoutes: ['/inventario', '/comparar', '/privacidad', '/terminos'],
      exclude: ['/admin', '/admin/*', '/404'],
      generateRobotsTxt: false,
    }),
  ],
  base: BASE,
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'supabase': ['@supabase/supabase-js'],
        },
      },
    },
  },
})
