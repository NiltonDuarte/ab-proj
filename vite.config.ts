import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  // Relative assets work both at a custom domain and at a repository Pages URL.
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        loja: resolve(__dirname, 'loja/index.html')
      }
    }
  }
})
