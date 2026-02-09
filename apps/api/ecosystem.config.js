module.exports = {
  apps: [
    {
      name: 'ai-tool-api',
      script: './dist/main.js',
      // --- 关键修改：开启监控 ---
      watch: ['dist'],           // 监控 dist 目录的变化
      ignore_watch: ['node_modules', 'logs', '.env'], // 忽略不需要监控的目录
      watch_options: {
        usePolling: true,         // 在某些服务器环境下，轮询检测更可靠
        interval: 1000            // 每秒检测一次
      },
      // --- 运行配置 ---
      instances: 1,               // 个人项目建议先设为 1，方便排查日志；并发大再改 'max'
      exec_mode: 'fork',          // NestJS 单机部署建议先用 fork 模式，更稳定
      autorestart: true,          // 崩溃自动重启
      max_memory_restart: '500M', // 内存占用过高自动重启
      env: {
        NODE_ENV: 'production',
      }
    },
  ],
};