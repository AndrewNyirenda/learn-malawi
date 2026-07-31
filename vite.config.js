import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    preview: {
      port: 4173,
      host: true,
      allowedHosts: [
        'learn-malawi.onrender.com',
        '.onrender.com',
        'https://learn-malawi-plum.vercel.app/',
        'https://learn-malawi-nestjs-api-v1-production-b67e.up.railway.app',
        'railway.app',
        
        
        
        
        
      ]
    },
    server: {
      port: 4173,
      host: true,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      }
    },
    // Expose env variables to your app
    define: {
      'process.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL),
      '__APP_ENV__': JSON.stringify(env.APP_ENV),
    }
  }
})