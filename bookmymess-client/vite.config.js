import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({

  plugins: [

    react(),

    tailwindcss(),

    VitePWA({

      registerType: 'autoUpdate',

      manifest: {

        name: 'BookMyMess',

        short_name: 'BookMyMess',

        description: 'Smart Meal Booking Platform',

        theme_color: '#2563eb',

        background_color: '#0f172a',

        display: 'standalone',

        start_url: '/',

        icons: [

          {
            src: '/icon.jpg',
            sizes: '192x192',
            type: 'image/jpeg'
          },

          {
            src: '/icon.jpg',
            sizes: '512x512',
            type: 'image/jpeg'
          }

        ]

      }

    })

  ],

  server: {

    proxy: {

      '/api': {

        target: 'http://localhost:5000',

        changeOrigin: true,

      },

    },

  },

})