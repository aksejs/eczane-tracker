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
