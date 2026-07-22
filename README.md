# AI Tool Monorepo

基于 **Gemini** 的 AI 工具集合，包含模拟面试、智能助手、简历优化等功能。采用 pnpm monorepo 架构，前后端分离。

## 功能概览

| 模块 | 说明 |
|------|------|
| **AI 模拟面试** | 多岗位定制、主观题/选择题、流式 AI 评估报告、面试历史本地持久化 |
| **AI 智能助手** | 多轮对话、流式输出、图片多模态识别、Markdown 渲染与代码高亮、IndexedDB 会话持久化 |
| **简历优化** | PDF/DOCX 解析、AI 深度诊断、对标 JD 匹配分析、优化预览与 PDF 导出 |
| **PWA 支持** | 离线缓存、可安装到桌面/主屏幕 |

## 技术栈

- **前端**：React 19、TypeScript、Vite 7、React Router、Zustand、PWA
- **后端**：NestJS 11、Google Generative AI SDK
- **共享包**：`@ai-tool/shared`（类型、常量等）
- **包管理**：pnpm workspace

## 项目结构

```
ai-tool-monorepo/
├── apps/
│   ├── api/          # NestJS 后端 API
│   └── web/          # React 前端应用
├── packages/
│   └── shared/       # 前后端共享代码
├── package.json      # 根脚本与 workspace 配置
└── pnpm-workspace.yaml
```

## 环境要求

- Node.js >= 18
- pnpm >= 10（推荐 `10.11.1`，见 `package.json` 中 `packageManager` 字段）
- [Google Gemini API Key](https://aistudio.google.com/apikey)

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

在 `apps/api` 目录下创建 `.env` 文件：

```env
# 必填：Gemini API Key
GEMINI_API_KEY=your_api_key_here

# 可选
PORT=3000
GEMINI_BASE_URL=https://generativelanguage.googleapis.com
GEMINI_API_VERSION=v1beta
```

前端可选配置（`apps/web/.env`）：

```env
# 开发环境 API 地址，默认 http://localhost:3000
VITE_API_URL=http://localhost:3000
```

> 前端设置页也支持在浏览器本地存储自定义 API Key 和模型选择，无需重启服务。

### 3. 启动开发环境

在根目录一键启动前后端：

```bash
pnpm dev
```

- 前端：http://localhost:5173
- 后端：http://localhost:3000

也可分别启动：

```bash
pnpm --filter api start:dev   # 仅后端
pnpm --filter web dev         # 仅前端
```

## 常用脚本

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 并行启动 API 与 Web 开发服务 |
| `pnpm build` | 构建所有 workspace 包 |
| `pnpm lint` | 全项目 ESLint 检查 |
| `pnpm test` | 运行各包测试 |

## 生产部署

### 构建

```bash
pnpm build
```

### 启动后端

```bash
cd apps/api
pnpm start:prod
```

或使用 PM2（项目已包含 `ecosystem.config.js`）：

```bash
cd apps/api
pnpm build
pm2 start ecosystem.config.js
```

### 部署前端

将 `apps/web/dist` 目录部署到任意静态托管服务（Nginx、Vercel、Cloudflare Pages 等）。生产环境下前端默认请求同域 API；若 API 独立部署，需通过构建时环境变量 `VITE_API_URL` 指定地址。

## 路由说明

| 路径 | 页面 |
|------|------|
| `/` | 首页（小智工作台） |
| `/interview` | 模拟面试 |
| `/chat` | 智能助手 |
| `/resume` | 简历优化 |
| `/settings` | 设置（API Key、模型选择） |

## 路线图

- [ ] 模拟面试语音实时对话（Web Speech API / TTS）
- [ ] 打包与页面性能优化

完整版本记录见 [`packages/shared/src/constants/changelog.ts`](packages/shared/src/constants/changelog.ts)。

## License

ISC
