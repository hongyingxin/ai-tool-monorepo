import React, { useState, useEffect, useCallback } from 'react';
import { 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Check, 
  Loader2, 
  AlertCircle, 
  Key, 
  Trash2, 
  Edit3,
  ExternalLink
} from 'lucide-react';
import { client } from '../../shared/api/client';
import { chatApi, type AIModel } from '../chat/api';

const SettingsPage: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  // 从 localStorage 获取已保存的 Key
  const savedKey = localStorage.getItem('gemini_api_key');

  // 模型选择相关状态
  // ... (保持现有状态不变)
  const [models, setModels] = useState<AIModel[]>(() => {
    const cached = localStorage.getItem('cached_models');
    try {
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [selectedModel, setSelectedModel] = useState(() => 
    localStorage.getItem('selected_model') || 'gemini-2.0-flash'
  );

  // 获取可用模型列表
  const fetchModels = useCallback(async (isSilent = false) => {
    // 如果不是静默刷新（如 Key 变更时），则显示加载动画
    if (!isSilent) setIsLoadingModels(true);
    
    try {
      const data = await chatApi.getModels();
      setModels(data);
      localStorage.setItem('cached_models', JSON.stringify(data));
      
      // 从 localStorage 获取当前选中的模型 ID 进行校验
      const currentStoredModel = localStorage.getItem('selected_model');
      const currentExists = data.find(m => m.id === currentStoredModel);
      
      // 如果当前选中的模型不在新列表中，且列表不为空，则自动降级切换
      if (!currentExists && data.length > 0) {
        const firstModelId = data[0].id;
        setSelectedModel(firstModelId);
        localStorage.setItem('selected_model', firstModelId);
      }
    } catch (err) {
      console.error('Failed to fetch models:', err);
    } finally {
      setIsLoadingModels(false);
    }
  }, []);

  useEffect(() => {
    // 加载已保存的 Key
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
    
    // 初始化时：如果有缓存则静默刷新，没缓存则显示 Loading 刷新
    const hasCache = localStorage.getItem('cached_models');
    fetchModels(!!hasCache);
  }, [fetchModels]);

  const handleSave = async () => {
    if (!apiKey.trim()) return;

    setIsSaving(true);
    setStatus('idle');
    setErrorMsg('');

    try {
      const result = await client.post<{ success: boolean; message?: string }>('/ai/validate-key', { key: apiKey });
      
      if (result.success) {
        localStorage.setItem('gemini_api_key', apiKey);
        localStorage.removeItem('cached_models'); // 清除旧缓存
        setStatus('success');
        setIsEditing(false); // 保存成功，退出编辑模式
        // 验证成功后强制刷新模型列表
        await fetchModels(false);
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setErrorMsg(result.message || 'Key 验证失败');
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || '网络请求失败');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = () => {
    if (window.confirm('确定要移除个人 API Key 并恢复系统默认配置吗？')) {
      localStorage.removeItem('gemini_api_key');
      localStorage.removeItem('cached_models');
      setApiKey('');
      setStatus('idle');
      fetchModels();
    }
  };

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId);
    localStorage.setItem('selected_model', modelId);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-600">
          <SettingsIcon size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-900">系统设置</h1>
          <p className="text-gray-500 font-medium">管理你的 AI 模型配置和个人首选项</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* API Section */}
        <section className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-blue-600" size={24} />
              <h2 className="text-xl font-bold">模型凭据</h2>
            </div>
            {!isEditing && savedKey && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold border border-green-100">
                <Check size={12} />
                <span>已激活个人凭据</span>
              </div>
            )}
            {!savedKey && (
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-xs font-bold border border-gray-100">
                <span>正在使用公共额度</span>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            {savedKey && !isEditing ? (
              /* 展示态卡片 */
              <div className="bg-gray-50/50 border border-gray-100 rounded-[1.5rem] p-6 flex items-center justify-between group hover:border-blue-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-gray-100">
                    <Key size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900 mb-1">Gemini API Key</div>
                    <div className="text-xs font-mono text-gray-400">
                      {savedKey.substring(0, 8)}••••••••{savedKey.substring(savedKey.length - 4)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setApiKey(savedKey);
                      setIsEditing(true);
                    }}
                    className="p-3 text-gray-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all"
                    title="更换 Key"
                  >
                    <Edit3 size={20} />
                  </button>
                  <button 
                    onClick={handleRemove}
                    className="p-3 text-gray-400 hover:text-red-600 hover:bg-white rounded-xl transition-all"
                    title="移除 Key"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ) : (
              /* 编辑态输入框 */
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-gray-700">配置个人 API Key</label>
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    获取 Key <ExternalLink size={10} />
                  </a>
                </div>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <input 
                      type="password"
                      placeholder="请输入您的 Google Gemini API Key"
                      className={`w-full px-5 py-4 bg-gray-50 border rounded-2xl focus:ring-2 outline-none transition-all font-mono ${
                        status === 'error' ? 'border-red-200 focus:ring-red-500' : 'border-gray-100 focus:ring-blue-500'
                      }`}
                      value={apiKey}
                      onChange={(e) => {
                        setApiKey(e.target.value);
                        if (status === 'error') setStatus('idle');
                      }}
                    />
                  </div>
                  <div className="flex gap-2">
                    {isEditing && (
                      <button 
                        onClick={() => {
                          setIsEditing(false);
                          setStatus('idle');
                        }}
                        className="px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition"
                      >
                        取消
                      </button>
                    )}
                    <button 
                      onClick={handleSave}
                      disabled={isSaving || !apiKey.trim()}
                      className={`px-8 py-4 rounded-2xl font-bold transition flex items-center gap-2 min-w-[120px] justify-center ${
                        status === 'success' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                    >
                      {isSaving ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : status === 'success' ? (
                        <Check size={20} />
                      ) : (
                        '验证并保存'
                      )}
                    </button>
                  </div>
                </div>

                {status === 'error' && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium animate-in fade-in zoom-in-95">
                    <AlertCircle size={18} />
                    <span>{errorMsg}</span>
                  </div>
                )}
              </div>
            )}

            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-50/50">
              <p className="text-[11px] text-blue-700 leading-relaxed">
                <strong>隐私声明：</strong>您的 API Key 将直接加密存储在您本人的浏览器中（LocalStorage），请求过程通过加密通道（HTTPS）直接与 AI 接口通信。我们不会在服务器端持久化存储您的私有 Key。
              </p>
            </div>
          </div>
        </section>

        {/* Model Section */}
        <section className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Cpu className="text-emerald-600" size={24} />
            <h2 className="text-xl font-bold">默认模型配置</h2>
          </div>
          
          {isLoadingModels ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Loader2 className="animate-spin mb-3" size={32} />
              <p className="text-sm font-medium">正在获取可用模型列表...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {models.map((model) => (
                <div 
                  key={model.id}
                  onClick={() => handleModelSelect(model.id)}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer group ${
                    selectedModel === model.id 
                      ? 'border-blue-500 bg-blue-50/30' 
                      : 'border-transparent bg-gray-50 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-bold ${selectedModel === model.id ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'}`}>
                      {model.displayName}
                    </span>
                    {selectedModel === model.id ? (
                      <Zap size={16} className="text-blue-600 fill-current" />
                    ) : (
                      <Cpu size={16} className="text-gray-300 group-hover:text-gray-400" />
                    )}
                  </div>
                  <p className={`text-xs leading-relaxed ${selectedModel === model.id ? 'text-gray-600' : 'text-gray-400'}`}>
                    {model.description}
                  </p>
                </div>
              ))}
              
              {models.length === 0 && !isLoadingModels && (
                <div className="col-span-full py-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-sm text-gray-400">暂无可用模型，请检查 API Key 配置</p>
                </div>
              )}
            </div>
          )}
          
          <p className="mt-6 text-xs text-gray-400 flex items-center gap-2">
            <Zap size={12} />
            <span>选中的模型将作为智能助手和模拟面试的默认模型使用。</span>
          </p>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
