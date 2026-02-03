import { client } from '../../shared/api/client';
import type { InterviewConfig, Message, Feedback } from './types';

/**
 * 面试模块 API 服务
 */
export const api = {
  /**
   * 开始一场新的模拟面试
   * @param config 面试配置
   * @returns 初始开场白
   */
  startInterview: (config: InterviewConfig) => 
    client.post<{ text: string }>('/ai/start', config),

  /**
   * 发送面试回答消息
   * @param history 对话历史
   * @param message 新发送的消息
   * @param config 面试配置
   * @returns AI 的回复
   */
  sendMessage: (history: Message[], message: string, config: InterviewConfig) => 
    client.post<{ text: string }>('/ai/chat', { history, message, config }),

  /**
   * 获取面试反馈（一次性获取）
   * @param history 对话历史
   * @param config 面试配置
   * @returns 评估报告
   */
  getFeedback: (history: Message[], config: InterviewConfig) => 
    client.post<Feedback>('/ai/feedback', { history, config }),

  /**
   * 获取面试反馈（流式获取，提升用户体验）
   * @param history 对话历史
   * @param config 面试配置
   * @param onChunk 接收到数据块时的回调
   * @returns 最终生成的完整文本
   */
  getFeedbackStream: async (history: Message[], config: InterviewConfig, onChunk: (text: string) => void) => {
    let fullText = '';
    await client.stream('/ai/feedback/stream', { history, config }, (chunkText) => {
      fullText += chunkText;
      onChunk(fullText);
    });
    return fullText;
  },
};
