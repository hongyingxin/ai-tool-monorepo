# AI Tool Monorepo

> **项目状态：已归档，不再维护。** 原 Gemini API Key 已过期，AI 相关功能无法正常使用，需要自己提供 Gemini API Key。本仓库仅作代码存档与学习参考。

基于 **Gemini** 的个人 AI 工具集合（小智工作台），包含模拟面试、智能助手、简历优化等功能。采用 pnpm monorepo 架构，前后端分离。

## 功能点

### 模拟面试

- 面试配置：支持多岗位选择，支持自定义面试场景
- 面试会话：文本与语音识别，支持主观题和选择题
- AI 评估报告：流式反馈生成
- 面试历史管理：IndexedDB 本地持久化，支持回顾与详情查看

### 智能助手

- 对话交互：流式输出
- 会话管理：可切换会话，保持上下文一致
- 多模态支持：图片附件识别与分析（Gemini 2.0）
- 视觉与体验：Gemini 风格界面
- 对话持久化：IndexedDB 存储，刷新不丢失
- Markdown 渲染与代码语法高亮

### 简历优化

- PDF / Word 简历上传与 AI 深度分析
- 优化后简历预览、下载及 PDF 规范化导出
- 支持简历对标 JD（职位描述）进行匹配度分析

### 平台能力

- PWA 离线缓存，支持安装到桌面 / 主屏幕
- 设置页支持自定义 Gemini API Key 与模型选择（本地持久化）
- 全局版本更新日志面板

### 未完成 / 已取消

- 「语音实时」面试官：利用 Web Speech API 实现语音实时识别与回答（未实现，随项目归档取消）

---

## 迭代日志

### v1.5.0（Roadmap · 已取消）


| 类型  | 内容                             |
| --- | ------------------------------ |
| 规划  | 模拟面试增加语音对话模式（Web Speech / TTS） |
| 规划  | 打包优化和页面性能优化                    |


### v1.4.0 · 2026-02-24


| 类型  | 内容                        |
| --- | ------------------------- |
| 新功能 | 新增离线缓存支持：支持离线访问，支持 PWA 安装 |
| 优化  | 优化 Changelog 文件           |
| 优化  | 调整路由显示优先级                 |


### v1.3.0 · 2026-02-20


| 类型  | 内容                                   |
| --- | ------------------------------------ |
| 新功能 | 新增简历专家诊断模块：支持 PDF/DOCX 自动解析与 AI 深度诊断 |
| 新功能 | 支持简历对标 JD（职位描述）进行精准匹配度分析             |
| 新功能 | 实现一键简历优化：根据专家建议重构并生成 Markdown 简历     |
| 新功能 | 支持优化后的简历预览、下载及 PDF 规范化导出             |
| 优化  | 针对移动端优化 Markdown 代码块展示，解决布局溢出问题      |
| 优化  | 全局 UI 打印适配优化，支持简历跨页排版打印              |


### v1.2.0 · 2026-02-12


| 类型  | 内容                                    |
| --- | ------------------------------------- |
| 新功能 | 智能助手支持 Markdown 解析与代码语法高亮             |
| 新功能 | 支持用户自定义 Gemini API Key                |
| 新功能 | 支持用户自定义模型选择，并实现本地持久化缓存                |
| 优化  | 后端架构升级：基于 AsyncLocalStorage 实现请求上下文隔离 |
| UI  | 全新的设置页面交互设计，支持凭据状态卡片展示                |
| UI  | 新增全局版本更新日志面板                          |
| 优化  | 修复模型列表重复请求及页面闪烁等交互问题                  |


### v1.1.0 · 2026-02-08


| 类型  | 内容                      |
| --- | ----------------------- |
| 新功能 | 智能助手模块上线：支持多轮对话与多模态图片识别 |
| UI  | 响应式布局优化，深度适配移动端交互体验     |
| 优化  | 环境变量与 API 接口调用逻辑优化      |
| 优化  | 引入 PM2 进程管理，提升生产环境稳定性   |
| 修复  | 修复多项构建报错及样式兼容性问题        |


### v1.0.0 · 2026-02-01


| 类型  | 内容                     |
| --- | ---------------------- |
| 新功能 | 模拟面试模块正式发布：支持岗位定制、模拟提问 |
| 新功能 | 新增面试历史管理功能，支持回顾与详情查看   |
| 优化  | 整体路由模式重构，支持更灵活的页面跳转    |
| 优化  | 前后端目录结构调整与代码注释补充       |
| UI  | 初版 UI 框架搭建，确定简约专业的设计风格 |


---

## 技术栈


| 层级   | 技术                                                             |
| ---- | -------------------------------------------------------------- |
| 前端   | React 19、TypeScript、Vite 7、React Router 7、Zustand              |
| 前端增强 | react-markdown、react-syntax-highlighter、pdfjs-dist、mammoth、PWA |
| 后端   | NestJS 11、@google/generative-ai、AsyncLocalStorage 请求上下文        |
| 共享   | `@ai-tool/shared`（changelog 等常量）                               |
| 工具链  | pnpm workspace、ESLint 9、concurrently、PM2                       |


## 项目结构

```
ai-tool-monorepo/
├── apps/
│   ├── api/                              # NestJS 后端
│   │   ├── src/
│   │   │   ├── main.ts                   # 入口，默认端口 3000
│   │   │   ├── app.module.ts             # 根模块
│   │   │   ├── config.ts                 # 环境变量读取
│   │   │   ├── types.ts                  # 面试相关共享类型
│   │   │   ├── common/
│   │   │   │   ├── context/
│   │   │   │   │   └── request-context.ts    # AsyncLocalStorage 上下文
│   │   │   │   └── middleware/
│   │   │   │       └── context.middleware.ts   # 注入 API Key / 模型等请求上下文
│   │   │   └── modules/
│   │   │       ├── ai/
│   │   │       │   ├── ai.module.ts
│   │   │       │   ├── ai.controller.ts      # 模型列表、流式对话 SSE
│   │   │       │   └── gemini-client.service.ts
│   │   │       ├── interview/
│   │   │       │   ├── interview.module.ts
│   │   │       │   ├── interview.controller.ts
│   │   │       │   ├── interview.service.ts
│   │   │       │   └── prompts.ts              # 面试 / 评估 Prompt
│   │   │       ├── resume/
│   │   │       │   ├── resume.module.ts
│   │   │       │   ├── resume.controller.ts
│   │   │       │   └── resume.service.ts
│   │   │       └── debug/
│   │   │           ├── debug.module.ts
│   │   │           └── debug.controller.ts
│   │   ├── test/                         # E2E 测试配置
│   │   ├── ecosystem.config.js           # PM2 生产部署配置
│   │   ├── nest-cli.json
│   │   └── package.json
│   │
│   └── web/                              # React 前端
│       ├── index.html
│       ├── vite.config.ts                # Vite 构建、分包、gzip 压缩
│       ├── vite.pwa.config.ts            # PWA / Service Worker 配置
│       └── src/
│           ├── main.tsx                  # 应用入口
│           ├── App.tsx
│           ├── routes.tsx                # 全局路由（懒加载）
│           ├── modules/
│           │   ├── home/
│           │   │   └── Home.tsx          # 首页 / 小智工作台
│           │   ├── interview/            # 模拟面试模块
│           │   │   ├── pages/
│           │   │   │   ├── InterviewModule.tsx   # 模块布局
│           │   │   │   ├── InterviewHome.tsx
│           │   │   │   ├── SettingsForm.tsx        # 面试配置
│           │   │   │   ├── InterviewSession.tsx  # 面试会话
│           │   │   │   ├── FeedbackReport.tsx    # 评估报告
│           │   │   │   ├── HistoryList.tsx
│           │   │   │   └── HistoryDetail.tsx
│           │   │   ├── components/
│           │   │   │   └── EvaluationResults.tsx
│           │   │   ├── constants/
│           │   │   │   └── jobs.ts               # 岗位分类数据
│           │   │   ├── api.ts
│           │   │   ├── db.ts                     # IndexedDB 历史存储
│           │   │   ├── store.ts                  # Zustand 状态
│           │   │   └── types.ts
│           │   ├── chat/                 # 智能助手模块
│           │   │   ├── ChatPage.tsx
│           │   │   ├── api.ts
│           │   │   └── db.ts                     # IndexedDB 会话存储
│           │   ├── resume/               # 简历优化模块
│           │   │   ├── pages/
│           │   │   │   ├── ResumeModule.tsx
│           │   │   │   ├── ResumeSetupPage.tsx   # 上传 / 配置
│           │   │   │   ├── ResumeResultPage.tsx  # 诊断结果
│           │   │   │   └── ResumePreviewPage.tsx # 预览 / 导出
│           │   │   ├── components/
│           │   │   │   └── ResumeReport.tsx
│           │   │   ├── utils/
│           │   │   │   └── parser.ts             # PDF / DOCX 解析
│           │   │   ├── store.ts
│           │   │   └── types.ts
│           │   └── settings/
│           │       └── SettingsPage.tsx  # API Key / 模型设置
│           └── shared/
│               ├── api/
│               │   └── client.ts         # 统一 HTTP / SSE 客户端
│               └── components/
│                   ├── Layout.tsx        # 全局布局 / 导航
│                   ├── Markdown.tsx      # Markdown 渲染
│                   ├── OfflineBanner.tsx # 离线提示
│                   └── VersionDrawer/    # 版本更新日志抽屉
│
├── packages/
│   └── shared/                           # 前后端共享包
│       ├── src/
│       │   ├── index.ts
│       │   └── constants/
│       │       └── changelog.ts          # 版本迭代记录（前端 VersionDrawer 引用）
│       └── package.json
│
├── eslint.config.base.js                 # 共享 ESLint 配置
├── tsconfig.base.json                    # 共享 TypeScript 配置
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── package.json                          # 根脚本（dev / build / lint / test）
├── 需求清单.md                            # 功能需求跟踪
└── README.md
```

## 路由说明


| 路径                       | 页面               |
| ------------------------ | ---------------- |
| `/`                      | 首页（小智工作台）        |
| `/interview`             | 模拟面试首页           |
| `/interview/setup`       | 面试配置             |
| `/interview/session`     | 面试会话             |
| `/interview/result`      | 评估报告             |
| `/interview/history`     | 面试历史列表           |
| `/interview/history/:id` | 历史详情             |
| `/chat`                  | 智能助手             |
| `/resume`                | 简历上传 / 配置        |
| `/resume/result`         | 诊断结果             |
| `/resume/preview`        | 优化预览 / 导出        |
| `/settings`              | 设置（API Key、模型选择） |


## 本地运行（仅供参考）

> 以下步骤仅供本地研究代码使用。由于 Gemini Key 已过期且项目不再维护，AI 功能预期无法正常工作；如需体验，须自行申请新的 API Key 并配置。

### 环境要求

- Node.js >= 18
- pnpm >= 10（推荐 `10.11.1`）

### 安装与配置

```bash
pnpm install
```

在 `apps/api/.env` 中配置：

```env
GEMINI_API_KEY=your_api_key_here
PORT=3000
GEMINI_BASE_URL=https://generativelanguage.googleapis.com
GEMINI_API_VERSION=v1beta
```

前端可选（`apps/web/.env`）：

```env
VITE_API_URL=http://localhost:3000
```

### 启动

```bash
pnpm dev          # 并行启动 API (3000) + Web (5173)
pnpm build        # 构建所有包
pnpm lint         # ESLint 检查
pnpm test         # 运行测试
```

单独启动：

```bash
pnpm --filter api start:dev
pnpm --filter web dev
```

### 生产部署

```bash
pnpm build
cd apps/api && pnpm start:prod
# 或使用 PM2：pm2 start ecosystem.config.js
```

前端将 `apps/web/dist` 部署至静态托管；API 独立部署时通过 `VITE_API_URL` 指定后端地址。

---

## 归档说明

- **Gemini API Key 已过期**，后端无法调用 Google Generative AI，对话、面试、简历分析等核心功能均不可用。
- **本项目已停止维护**，不会修复 Bug、适配新模型或继续迭代 v1.5.0 规划功能。
- 如需二次开发，请自行 fork 并替换 API Key / 模型接入层；代码结构可供 monorepo + NestJS + React 参考。

## License

ISC