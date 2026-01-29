export interface JobCategory {
  label: string;
  options: string[];
}

export const JOB_CATEGORIES: JobCategory[] = [
  {
    label: '后端开发',
    options: ['Java', 'Python', 'Go', 'PHP', 'C++', 'C#', 'Node.js', '架构师', '数据开发']
  },
  {
    label: '前端/移动开发',
    options: ['前端开发', 'iOS', 'Android', '小程序', 'Flutter', 'React Native']
  },
  {
    label: '人工智能',
    options: ['机器学习', '深度学习', '算法工程师', '图像处理', '自然语言处理', '语音识别']
  },
  {
    label: '产品',
    options: ['产品经理', '产品助理', '数据产品经理', '策略产品经理', '游戏策划']
  },
  {
    label: '设计',
    options: ['UI设计师', '交互设计师', 'UX设计师', '视觉设计师', '平面设计师']
  },
  {
    label: '运营',
    options: ['内容运营', '产品运营', '新媒体运营', '活动运营', '电商运营']
  },
  {
    label: '测试/运维',
    options: ['测试工程师', '自动化测试', '运维工程师', 'SRE', '安全工程师']
  }
];

