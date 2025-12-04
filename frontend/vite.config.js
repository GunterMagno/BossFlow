import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  envDir: path.resolve(__dirname, '..'),
  server: {
    port: 5173,
    // Proxy para desarrollo: redirige /api al backend en http://localhost:5000
    proxy: {
      '/api': {
        // Allow overriding the proxy target via VITE_API_PROXY. Useful when Vite
        // runs inside Docker (target should be http://backend:5000) or locally
        // (target http://localhost:5000).
        target: process.env.VITE_API_PROXY || 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
      '/uploads': {
        target: process.env.VITE_API_PROXY || 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
