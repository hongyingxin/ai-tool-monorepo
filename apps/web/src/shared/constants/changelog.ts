export interface ChangelogItem {
  type: 'feature' | 'optimization' | 'bugfix' | 'ui' | 'planned';
  content: string;
}

export interface VersionRecord {
  version: string;
  date: string;
  status: 'completed' | 'planned';
  items: ChangelogItem[];
}

export const CHANGELOG: VersionRecord[] = [
  {
    version: 'v1.3.0 (Roadmap)',
    date: '未来规划',
    status: 'planned',
    items: [
      { type: 'planned', content: '移动端适配优化' },
      { type: 'planned', content: '离线缓存支持 Server-Worker' },
    ],
  },
  {
    version: 'v1.2.0',
    date: '2026-02-12',
    status: 'completed',
    items: [
      { type: 'feature', content: '智能助手支持 Markdown 解析与代码语法高亮' },
      { type: 'feature', content: '支持用户自定义 Gemini API Key' },
      { type: 'feature', content: '支持用户自定义模型选择，并实现本地持久化缓存' },
      { type: 'optimization', content: '后端架构升级：基于 AsyncLocalStorage 实现请求上下文隔离' },
      { type: 'ui', content: '全新的设置页面交互设计，支持凭据状态卡片展示' },
      { type: 'ui', content: '新增全局版本更新日志面板' },
      { type: 'optimization', content: '修复模型列表重复请求及页面闪烁等交互问题' },
    ],
  },
  {
    version: 'v1.1.0',
    date: '2026-02-08',
    status: 'completed',
    items: [
      { type: 'feature', content: '智能助手模块上线：支持多轮对话与多模态图片识别' },
      { type: 'ui', content: '响应式布局优化，深度适配移动端交互体验' },
      { type: 'optimization', content: '环境变量与 API 接口调用逻辑优化' },
      { type: 'optimization', content: '引入 PM2 进程管理，提升生产环境稳定性' },
      { type: 'bugfix', content: '修复多项构建报错及样式兼容性问题' },
    ],
  },
  {
    version: 'v1.0.0',
    date: '2026-02-01',
    status: 'completed',
    items: [
      { type: 'feature', content: '模拟面试模块正式发布：支持岗位定制、模拟提问' },
      { type: 'feature', content: '新增面试历史管理功能，支持回顾与详情查看' },
      { type: 'optimization', content: '整体路由模式重构，支持更灵活的页面跳转' },
      { type: 'optimization', content: '前后端目录结构调整与代码注释补充' },
      { type: 'ui', content: '初版 UI 框架搭建，确定简约专业的设计风格' },
    ],
  },
];
