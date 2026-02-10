import { client } from '../../shared/api/client';

export interface AIModel {
  id: string;
  name: string;
  displayName: string;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  isError?: boolean;
}

export const chatApi = {
  getModels: () => client.get<AIModel[]>('/ai/models'),
  chatStream: (
    model: string,
    messages: ChatMessage[],
    onMessage: (text: string) => void,
    onError?: (err: any) => void,
    signal?: AbortSignal
  ) => client.stream('/ai/chat/stream', { model, messages }, onMessage, onError, signal),
};

