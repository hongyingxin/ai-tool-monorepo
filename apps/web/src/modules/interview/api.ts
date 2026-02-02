import { client } from '../../shared/api/client';
import type { InterviewConfig, Message, Feedback } from './types';

export const api = {
  startInterview: (config: InterviewConfig) => 
    client.post<{ text: string }>('/ai/start', config),

  sendMessage: (history: Message[], message: string, config: InterviewConfig) => 
    client.post<{ text: string }>('/ai/chat', { history, message, config }),

  getFeedback: (history: Message[], config: InterviewConfig) => 
    client.post<Feedback>('/ai/feedback', { history, config }),
};
