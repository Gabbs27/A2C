import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://a2cinternational.com',
      exclude: ['/admin', '/admin/*'],
      generateRobotsTxt: false,
    }),
  ],
  base: '/A2C/',
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
