// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/bookings': 'http://localhost:3001',
      '/partners': 'http://localhost:3001',
    },
  },
})
