import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  resolve:{
    alias: {
      "@taurus": path.resolve(__dirname, "../web/src"),
      // "taurus": path.resolve(__dirname, "../src")
    }
  },
  plugins: [react()],
  server: {
    port: 3000
  }
})
