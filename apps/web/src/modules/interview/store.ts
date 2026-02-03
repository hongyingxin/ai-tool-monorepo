import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { InterviewConfig, Message } from './types';

/**
 * 面试状态接口
 */
interface InterviewState {
  /** 当前面试配置 */
  config: InterviewConfig | null;
  /** 当前面试对话历史 */
  messages: Message[];
  /** 是否正在生成报告 */
  isGeneratingReport: boolean;
  
  /** 更新配置 */
  setConfig: (config: InterviewConfig) => void;
  /** 添加消息 */
  addMessage: (message: Message) => void;
  /** 设置完整消息列表 */
  setMessages: (messages: Message[]) => void;
  /** 设置报告生成状态 */
  setGeneratingReport: (loading: boolean) => void;
  /** 重置面试状态（开启新面试时使用） */
  resetInterview: () => void;
}

/**
 * Zustand Store: 管理活跃面试的状态
 * 使用 persist 中间件将状态存储在 sessionStorage 中，实现刷新不丢失进度
 * 退出浏览器或关闭标签页后状态会清除（符合面试会话特性）
 */
export const useInterviewStore = create<InterviewState>()(
  persist(
    (set) => ({
      config: null,
      messages: [],
      isGeneratingReport: false,

      setConfig: (config) => set({ config }),
      
      addMessage: (message) => set((state) => ({ 
        messages: [...state.messages, message] 
      })),

      setMessages: (messages) => set({ messages }),

      setGeneratingReport: (loading) => set({ isGeneratingReport: loading }),

      resetInterview: () => set({ 
        config: null, 
        messages: [], 
        isGeneratingReport: false 
      }),
    }),
    {
      name: 'active-interview-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

