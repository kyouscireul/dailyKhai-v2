import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  // base: '/dailyKhai-v2/', // Removed for Vercel deployment (root domain)
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.png'],
      manifest: {
        name: "Pillarize",
        short_name: 'Pillarize',
        description: 'My daily routine and personal use PWA',
        theme_color: '#020617',
        background_color: '#020617',
        icons: [
          {
            src: 'icon.png',
            sizes: '512x512', // Assuming the original icon is large enough
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
