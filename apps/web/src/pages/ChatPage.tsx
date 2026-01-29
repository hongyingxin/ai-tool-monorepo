import React from 'react';
import { MessageSquareText, Sparkles } from 'lucide-react';

const ChatPage: React.FC = () => {
  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Chat Header */}
      <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <MessageSquareText size={24} />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">AI 智能助手</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gemini 2.5 Flash Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages Placeholder */}
      <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-200">
          <Sparkles size={40} />
        </div>
        <div className="max-w-md">
          <h2 className="text-xl font-bold text-gray-800 mb-2">有什么我可以帮您的吗？</h2>
          <p className="text-sm text-gray-400">
            您可以尝试问我：<br />
            “帮我写一个 React 响应式布局组件” 或 <br />
            “解释一下量子纠缠的基本原理”
          </p>
        </div>
      </div>

      {/* Chat Input Placeholder */}
      <div className="p-6 bg-gray-50/50">
        <div className="max-w-4xl mx-auto relative">
          <input 
            type="text"
            placeholder="输入您的问题..."
            className="w-full pl-6 pr-24 py-5 bg-white border border-gray-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            disabled
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm opacity-50 cursor-not-allowed">
              发送
            </button>
          </div>
        </div>
        <p className="text-center mt-3 text-[10px] text-gray-300 font-medium">
          助手可能会产生错误信息，请核实重要内容。
        </p>
      </div>
    </div>
  );
};

export default ChatPage;

