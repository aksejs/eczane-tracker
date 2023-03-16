import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react-swc'
import postcssNesting from 'postcss-nesting'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['public/favicon.ico', 'public/apple-touch-icon.png'],
      manifest: {
        name: 'Eczane Tracker',
        short_name: 'EczaneTracker',
        description: 'Duty pharmacies tracker',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'public/assets/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'public/assets/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      '/place-api': {
        target: 'https://maps.googleapis.com/maps/api/place/autocomplete/json',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/place-api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@/components': path.resolve(__dirname, './src/components'),
      '@': path.resolve(__dirname, './src/'),
    },
  },
  css: {
    postcss: {
      plugins: [postcssNesting],
    },
  },
})
