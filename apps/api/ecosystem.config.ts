/**
 * PM2 配置文件
 * 用于在生产环境中管理和部署 NestJS 应用
 */
export default {
  apps: [
    {
      name: 'ai-tool-api', // 应用名称
      script: './dist/main.js', // 启动脚本路径（编译后的 JS 文件）
      instances: 'max', // 实例数量，'max' 表示根据 CPU 核心数启动最大数量的进程
      exec_mode: 'cluster', // 执行模式，'cluster' 表示集群模式，利用多核 CPU
      // 默认环境变量
      env: {
        NODE_ENV: 'development',
      },
      // 生产环境变量
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};

