import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // StanBlog proxy endpoint (backend exposes /diskusije outside /api/**, so proxy avoids CORS in dev)
      '/diskusije': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
