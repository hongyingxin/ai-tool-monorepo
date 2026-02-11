const API_BASE_URL = import.meta.env.PROD 
  ? 'https://my-ai-tool.hongyingxin.com/api' 
  : (import.meta.env.VITE_API_URL || 'http://localhost:3000');

interface RequestOptions extends RequestInit {
  data?: any;
}

async function request<T>(endpoint: string, { data, ...customConfig }: RequestOptions = {}): Promise<T> {
  const customKey = localStorage.getItem('gemini_api_key');
  const customModel = localStorage.getItem('selected_model');
  const headers: Record<string, string> = { 
    'Content-Type': 'application/json' 
  };
  
  if (customKey) {
    headers['x-gemini-api-key'] = customKey;
  }

  if (customModel) {
    headers['x-gemini-model-id'] = customModel;
  }
  
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

  stream: async (endpoint: string, data: any, onMessage: (text: string) => void, onError?: (err: any) => void, signal?: AbortSignal) => {
    const customKey = localStorage.getItem('gemini_api_key');
    const customModel = localStorage.getItem('selected_model');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
    };

    if (customKey) {
      headers['x-gemini-api-key'] = customKey;
    }

    if (customModel) {
      headers['x-gemini-model-id'] = customModel;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
        signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Stream request failed');
      }
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        let boundary = buffer.indexOf('\n\n');
        while (boundary !== -1) {
          const event = buffer.slice(0, boundary).trim();
          buffer = buffer.slice(boundary + 2);

          const lines = event.split('\n');
          let dataContent = '';
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              dataContent += line.slice(6);
            }
          }

          if (dataContent) {
            try {
              const payload = JSON.parse(dataContent);
              if (payload.error) {
                onError?.(new Error(payload.error));
                return;
              }
              if (payload.text) {
                onMessage(payload.text);
              }
            } catch (e) {
              console.warn('Failed to parse SSE payload:', dataContent, e);
            }
          }
          boundary = buffer.indexOf('\n\n');
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('[Stream] Request aborted');
        return;
      }
      console.error('[Stream Error]:', error);
      onError?.(error);
      throw error; // 向上传递错误以触发 ChatPage 的 finally
    }
  }
};

