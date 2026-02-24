import type { VitePWAOptions } from 'vite-plugin-pwa';

/**
 * Vite PWA 插件配置
 * 包含了 Service Worker 行为、离线缓存策略以及 Manifest 元数据
 */
export const pwaConfig: Partial<VitePWAOptions> = {
  // 注册方式：autoUpdate 表示一旦检测到新版本就自动更新 Service Worker
  registerType: 'autoUpdate',
  
  // 在 index.html 中自动注入 Service Worker 注册脚本
  injectRegister: 'auto',
  
  // 开发模式配置
  devOptions: {
    enabled: true, // 在开发模式下也启用 PWA，方便本地调试离线功能
  },

  // 包含在 Manifest 中的静态资源
  includeAssets: ['vite.svg'],

  // PWA 应用元数据（决定了“安装”到桌面后的显示效果）
  manifest: {
    name: 'AI Tool Monorepo',
    short_name: 'AI Tool',
    description: '具有离线支持的 AI 效率中心',
    theme_color: '#ffffff',
    background_color: '#ffffff',
    display: 'standalone', // 独立窗口模式运行，没有浏览器地址栏
    icons: [
      {
        src: 'vite.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        src: 'vite.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
    ],
  },

  // Workbox 核心配置（决定了具体如何缓存文件）
  workbox: {
    skipWaiting: true,      // 强制等待中的 Service Worker 立即激活
    clientsClaim: true,     // Service Worker 激活后立即控制所有页面
    cleanupOutdatedCaches: true, // 清理旧版本的缓存数据

    // 预缓存配置
    maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 允许缓存的最大文件大小（4MiB），防止主包过大导致无法缓存
    globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'], // 需要预缓存的文件类型

    // 导航回退：离线时刷新任何 URL 都会指向 index.html，由前端路由接管
    navigateFallback: 'index.html',
    // 排除掉以 /__ 开头的内部路径（如 Firebase 内部链接）
    navigateFallbackAllowlist: [/^(?!\/__).*/],

    // 运行时缓存：针对外部 CDN 或第三方资源的请求策略
    runtimeCaching: [
      {
        // 缓存 Google Fonts 样式表
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'CacheFirst', // 优先从缓存读取，适合不经常变动的资源
        options: {
          cacheName: 'google-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365, // 缓存有效期 1 年
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        // 缓存 Google Fonts 字体文件
        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'gstatic-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365,
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
};
