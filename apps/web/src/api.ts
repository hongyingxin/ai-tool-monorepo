import type { InterviewConfig, Message, Feedback } from './types';

const API_BASE_URL = 'http://localhost:3000/api';

export const api = {
  async startInterview(config: InterviewConfig): Promise<{ text: string }> {
    const response = await fetch(`${API_BASE_URL}/ai/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    return response.json();
  },

  async sendMessage(history: Message[], message: string): Promise<{ text: string }> {
    const response = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history, message }),
    });
    return response.json();
  },

  async getFeedback(history: Message[], config: InterviewConfig): Promise<Feedback> {
    const response = await fetch(`${API_BASE_URL}/ai/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history, config }),
    });
    return response.json();
  },
};

