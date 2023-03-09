import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react-swc'

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
      "/place-api": {
        target: "https://maps.googleapis.com/maps/api/place/autocomplete/json",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/place-api/, ''),
      }
    }
  }
})
