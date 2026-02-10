const API_BASE_URL = import.meta.env.PROD 
  ? 'https://my-ai-tool.hongyingxin.com/api' 
  : (import.meta.env.VITE_API_URL || 'http://localhost:3000');

interface RequestOptions extends RequestInit {
  data?: any;
}

async function request<T>(endpoint: string, { data, ...customConfig }: RequestOptions = {}): Promise<T> {
  const headers = { 'Content-Type': 'application/json' };
  
  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      // 统一错误处理逻辑可以在这里添加，例如弹出全局 Toast
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || '网络请求失败');
    }

    return await response.json();
  } catch (error) {
    console.error('[API Error]:', error);
    throw error;
  }
}

export const client = {
  get: <T>(endpoint: string, config?: RequestOptions) => 
    request<T>(endpoint, { ...config, method: 'GET' }),
  
  post: <T>(endpoint: string, data?: any, config?: RequestOptions) => 
    request<T>(endpoint, { ...config, method: 'POST', data }),
  
  put: <T>(endpoint: string, data?: any, config?: RequestOptions) => 
    request<T>(endpoint, { ...config, method: 'PUT', data }),
  
  delete: <T>(endpoint: string, config?: RequestOptions) => 
    request<T>(endpoint, { ...config, method: 'DELETE' }),

  stream: async (endpoint: string, data: any, onMessage: (text: string) => void, onError?: (err: any) => void) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Stream request failed');
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        // NestJS SSE format: "data: { ... }\n\n"
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.slice(6);
              if (!jsonStr.trim()) continue;
              const payload = JSON.parse(jsonStr);
              if (payload.text) {
                onMessage(payload.text);
              }
            } catch (e) {
              console.warn('Failed to parse SSE chunk:', line);
            }
          }
        }
      }
    } catch (error) {
      console.error('[Stream Error]:', error);
      onError?.(error);
    }
  }
};

