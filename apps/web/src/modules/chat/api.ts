import { client } from '../../shared/api/client';

/**
 * AI 模型定义
 */
export interface AIModel {
  /** 模型唯一标识 */
  id: string;
  /** 模型名称 */
  name: string;
  /** 用于展示的友好名称 */
  displayName: string;
  /** 模型功能描述 */
  description: string;
}

/**
 * 聊天消息定义
 */
export interface ChatMessage {
  /** 发言角色：user (用户), model (AI) */
  role: 'user' | 'model';
  /** 消息内容文本 */
  content: string;
  /** 是否为错误消息 */
  isError?: boolean;
}

/**
 * 智能助手模块 API 服务
 */
export const chatApi = {
  /**
   * 获取所有可用的 AI 模型列表
   */
  getModels: () => client.get<AIModel[]>('/ai/models'),

  /**
   * 发起流式对话请求
   * @param model 模型 ID
   * @param messages 历史对话列表
   * @param onMessage 接收到新字符时的回调
   * @param onError 出错时的回调
   * @param signal 中断信号
   */
  chatStream: (
    model: string,
    messages: ChatMessage[],
    onMessage: (text: string) => void,
    onError?: (err: any) => void,
    signal?: AbortSignal
  ) => client.stream('/ai/chat/stream', { model, messages }, onMessage, onError, signal),
};

