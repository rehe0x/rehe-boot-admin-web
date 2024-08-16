import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      // 代理所有 /api 请求
      '/api': {
        target: 'http://localhost:8081', // 代理的目标地址
        changeOrigin: true // 是否改变源地址,
        // rewrite: (path) => path.replace(/^\/api/, ''), // 去掉路径中的 /api 前缀
      },
    },
  },
})
