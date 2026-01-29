import React, { useState } from 'react';
import { InterviewStatus } from '../types';
import type { InterviewConfig, Message } from '../types';
import SettingsForm from '../components/SettingsForm';
import InterviewSession from '../components/InterviewSession';
import FeedbackReport from '../components/FeedbackReport';
import { Sparkles, MessageSquare } from 'lucide-react';

const InterviewPage: React.FC = () => {
  const [status, setStatus] = useState<InterviewStatus>(InterviewStatus.IDLE);
  const [config, setConfig] = useState<InterviewConfig | null>(null);
  const [history, setHistory] = useState<Message[]>([]);

  const handleStartInterview = (newConfig: InterviewConfig) => {
    setConfig(newConfig);
    setStatus(InterviewStatus.INTERVIEWING);
  };

  const handleFinishInterview = (interviewHistory: Message[]) => {
    setHistory(interviewHistory);
    setStatus(InterviewStatus.COMPLETED);
  };

  const handleRestart = () => {
    setStatus(InterviewStatus.IDLE);
    setHistory([]);
    setConfig(null);
  };

  return (
    <div className="h-full">
      {status === InterviewStatus.IDLE && (
        <div className="max-w-3xl mx-auto pt-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-8">
            <Sparkles size={16} />
            <span>AI 模拟面试专家</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
            全方位的模拟面试 <br />
            助力你斩获梦寐以求的 Offer
          </h1>
          <p className="text-gray-500 text-lg mb-12">
            基于最新的大模型技术，针对 100+ 热门岗位提供沉浸式、专业化的面试体验。获取即时评估报告，快速查漏补缺。
          </p>
          
          <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm flex flex-col md:flex-row items-center gap-8 text-left">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-4">准备好开始了吗？</h3>
              <ul className="space-y-3 text-sm text-gray-500 mb-8">
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-[10px] font-bold">✓</div>
                  支持产品、开发、设计、市场等全行业岗位
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-[10px] font-bold">✓</div>
                  支持英文面试和中文面试切换
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-[10px] font-bold">✓</div>
                  实时复盘，多维深度反馈
                </li>
              </ul>
              <button 
                onClick={() => setStatus(InterviewStatus.CONFIGURING)}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-200"
              >
                配置面试场景
              </button>
            </div>
            <div className="w-full md:w-64 aspect-square bg-slate-50 rounded-[1.5rem] flex items-center justify-center">
              <MessageSquare size={80} className="text-blue-100" />
            </div>
          </div>
        </div>
      )}

      {status === InterviewStatus.CONFIGURING && (
        <div className="max-w-2xl mx-auto py-8">
          <SettingsForm onStart={handleStartInterview} />
        </div>
      )}

      {status === InterviewStatus.INTERVIEWING && config && (
        <div className="h-full">
          <InterviewSession config={config} onFinish={handleFinishInterview} />
        </div>
      )}

      {status === InterviewStatus.COMPLETED && config && (
        <div className="py-8">
          <FeedbackReport history={history} config={config} onRestart={handleRestart} />
        </div>
      )}
    </div>
  );
};

export default InterviewPage;

