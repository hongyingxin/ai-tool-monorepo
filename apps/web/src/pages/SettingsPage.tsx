import React from 'react';
import { Settings as SettingsIcon, ShieldCheck, Cpu, Zap } from 'lucide-react';

const SettingsPage: React.FC = () => {
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
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold">模型凭据</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Gemini API Key</label>
              <div className="flex gap-3">
                <input 
                  type="password" 
                  placeholder="请输入您的 Google Gemini API Key"
                  className="flex-1 px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono"
                  defaultValue="••••••••••••••••"
                />
                <button className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-blue-700 transition">
                  保存
                </button>
              </div>
              <p className="mt-3 text-xs text-gray-400">
                您的 API Key 将仅保存在本地浏览器缓存中，不会上传到我们的服务器。
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border-2 border-blue-500 bg-blue-50/30">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-900">Gemini 2.5 Flash</span>
                <Zap size={16} className="text-blue-600 fill-current" />
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                速度极快，适合日常对话和模拟面试。
              </p>
            </div>
            <div className="p-5 rounded-2xl border-2 border-transparent bg-gray-50 hover:border-gray-200 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-400">Gemini 1.5 Pro</span>
                <span className="text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded-md uppercase font-bold">即将支持</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                推理能力最强，适合处理复杂逻辑和长文本。
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;

