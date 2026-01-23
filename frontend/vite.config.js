import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
<<<<<<< HEAD
  plugins: [react()],
  server: {
    proxy: {
      // StanBlog proxy endpoint (backend exposes /diskusije outside /api/**, so proxy avoids CORS in dev)
      '/diskusije': {
        target: 'https://progistanblog.azurewebsites.net/api/stanplan/discussions/positive',
        changeOrigin: true,
      },
    },
  },
=======
  plugins: [react()]
>>>>>>> origin/deployyyyy
})
