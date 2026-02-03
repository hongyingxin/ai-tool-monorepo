import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterviewStore } from './store';
import { ArrowRight, History } from 'lucide-react';

/**
 * 面试模块首页
 * 负责展示欢迎信息和核心功能入口
 */
const InterviewHome: React.FC = () => {
  const navigate = useNavigate();
  const resetInterview = useInterviewStore((state: any) => state.resetInterview);

  const handleStartNew = () => {
    resetInterview();
    navigate('/interview/setup');
  };

  return (
    <div className="h-full flex flex-col items-center justify-center max-w-4xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="w-full text-center space-y-8">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-mono font-bold tracking-[0.2em] uppercase">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
          Module: INTERVIEW_ENGINE_v1
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-tight">
          磨炼你的 <br />
          <span className="text-blue-600">面试直觉</span>
        </h1>

        <p className="text-slate-400 font-medium text-lg max-w-xl mx-auto leading-relaxed">
          在这里，没有评判，只有练习。通过与小智的深度模拟对话，<br className="hidden md:block" />
          在真实挑战到来前，找回你最好的表达状态。
        </p>

        <div className="pt-12 flex flex-col md:flex-row items-center justify-center gap-4">
          <button
            onClick={handleStartNew}
            className="group relative px-12 py-5 bg-slate-900 text-white rounded-2xl font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-200 w-full md:w-auto"
          >
            <span className="relative z-10 flex items-center gap-3 text-lg">
              初始化面试场景
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>

          <button
            onClick={() => navigate('/interview/history')}
            className="flex items-center gap-2 px-8 py-5 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all hover:border-slate-200 w-full md:w-auto justify-center"
          >
            <History size={20} />
            查看面试历史
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewHome;

