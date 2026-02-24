import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { VitePWA } from 'vite-plugin-pwa'
// import { pwaConfig } from './vite.pwa.config'
import compression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // VitePWA(pwaConfig),
    compression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // 暂时关闭 brotli 压缩，减少dist空间和打包时长
    // compression({
    //   verbose: true,
    //   disable: false,
    //   threshold: 10240,
    //   algorithm: 'brotliCompress',
    //   ext: '.br',
    // }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('pdfjs-dist')) {
              return 'pdf-lib';
            }
            if (id.includes('react-syntax-highlighter') || id.includes('prismjs')) {
              return 'syntax-highlighter';
            }
            if (id.includes('mammoth')) {
              return 'mammoth-lib';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            // 将较大的 React 相关库放在一起
            if (id.includes('react') || id.includes('scheduler') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: true,
    // 极致的代码压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 生产环境关闭 console.log
        drop_debugger: true, // 生产环境关闭 debugger
      },
    },
  },
})
