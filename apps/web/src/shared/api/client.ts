const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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
};

