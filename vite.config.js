import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: 4173,
    host: true
  },
  server: {
    port: 4173,
    host: true
  }
})