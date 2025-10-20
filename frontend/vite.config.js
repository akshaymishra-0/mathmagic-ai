import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate React and React DOM
          'react-vendor': ['react', 'react-dom'],
          // Separate routing
          'router': ['react-router-dom'],
          // Separate charting library
          'charts': ['recharts'],
          // Separate UI libraries
          'ui': ['lucide-react', 'react-hot-toast'],
          // Separate HTTP client
          'http': ['axios']
        }
      }
    },
    chunkSizeWarningLimit: 1000 // Increase limit to 1000kb
  }
})