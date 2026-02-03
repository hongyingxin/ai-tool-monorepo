/**
 * 面试模块状态枚举
 */
export enum InterviewStatus {
  /** 闲置状态，显示欢迎页 */
  IDLE = 'IDLE',
  /** 配置状态，显示设置表单 */
  CONFIGURING = 'CONFIGURING',
  /** 面试中状态，显示对话界面 */
  INTERVIEWING = 'INTERVIEWING',
  /** 面试完成状态，显示生成的反馈报告 */
  COMPLETED = 'COMPLETED',
  /** 历史记录列表状态 */
  HISTORY = 'HISTORY',
  /** 查看特定历史记录详情状态 */
  VIEWING_HISTORY = 'VIEWING_HISTORY'
}

/**
 * 面试配置接口
 */
export interface InterviewConfig {
  /** 职位名称 */
  jobTitle: string;
  /** 目标公司 */
  company: string;
  /** 经验水平（初级、中级、高级等） */
  experienceLevel: string;
  /** 面试类型 */
  interviewType: 'technical' | 'behavioral' | 'general';
  /** 自定义描述或额外要求 */
  customDescription: string;
}

/**
 * 对话消息接口
 */
export interface Message {
  /** 发言人：user 为候选人，model 为 AI 面试官 */
  role: 'user' | 'model';
  /** 消息文本内容 */
  text: string;
  /** 消息生成的时间戳 */
  timestamp: number;
  /** 消息类型：text 为普通文本，choice 为选择题 */
  type?: 'text' | 'choice';
  /** 选择题选项列表 */
  options?: string[];
  /** 是否为错误消息 */
  isError?: boolean;
}

/**
 * 后端返回的消息格式
 */
export interface InterviewResponse {
  /** 消息文本 */
  content: string;
  /** 消息类型 */
  type: 'text' | 'choice';
  /** 选项 */
  options?: string[];
}

/**
 * 面试评估报告接口
 */
export interface Feedback {
  /** 综合评分 (0-100) */
  score: number;
  /** 表现亮点 */
  pros: string[];
  /** 待改进项 */
  cons: string[];
  /** 提升建议 */
  suggestions: string[];
  /** 专家总结点评 */
  overallSummary: string;
}
