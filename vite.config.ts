import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import qiankun from 'vite-plugin-qiankun'
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import path from 'path'

export default defineConfig({
  base: '/',
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    qiankun('adcommercial', { useDevMode: true })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          // 可以在这里自定义 Ant Design 主题变量
          '@primary-color': '#1890ff',
        },
      },
    },
  },
  server: {
    port: 3001,
    cors: true,
    origin: 'http://localhost:3001'
  },
  build: {
    target: 'esnext',
    lib: {
      name: 'adcommercial',
      entry: './src/main.tsx',
      formats: ['umd']
    }
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: ['react', 'react-dom', 'antd', '@ant-design/icons'],
  },
})