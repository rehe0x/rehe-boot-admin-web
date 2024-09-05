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
  build: {
    target: 'esnext'  // 设置目标为 esnext 以支持顶层 await
  },
  worker: {
    format: 'es',  // 配置 Worker 输出格式为 es
    rollupOptions: {
      output: {
        format: 'es'  // 如果需要，可以单独为 Worker 指定输出格式
      }
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
