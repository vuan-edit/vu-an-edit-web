import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        notFound: resolve(__dirname, '404.html'),

        projects: resolve(__dirname, 'projects/index.html'),
        courses: resolve(__dirname, 'courses/index.html'),
        // blog is now WordPress — served via Cloudflare Worker
        store: resolve(__dirname, 'store/index.html'),
        storeLogin: resolve(__dirname, 'store/store-login/index.html'),
        contact: resolve(__dirname, 'contact/index.html')
      }
    }
  }
})
