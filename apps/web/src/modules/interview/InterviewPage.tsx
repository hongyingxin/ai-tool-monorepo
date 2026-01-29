import React, { useState } from 'react';
import { InterviewStatus } from './types';
import type { InterviewConfig, Message } from './types';
import SettingsForm from './components/SettingsForm';
import InterviewSession from './components/InterviewSession';
import FeedbackReport from './components/FeedbackReport';
import { Sparkles, MessageSquare, ArrowRight, Cpu } from 'lucide-react';

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
        <div className="h-full flex flex-col items-center justify-center max-w-4xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="w-full text-center space-y-8">
            {/* Module Identifier */}
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

            <div className="pt-12">
              <button
                onClick={() => setStatus(InterviewStatus.CONFIGURING)}
                className="group relative px-12 py-5 bg-slate-900 text-white rounded-2xl font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-200"
              >
                <span className="relative z-10 flex items-center gap-3 text-lg">
                  初始化面试场景
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>

            {/* Technical metadata footer */}
            {/* <div className="pt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left border-t border-slate-100 mt-20">
              {[
                { label: 'SUPPORT_ROLES', value: '全行业岗位覆盖', icon: <Cpu size={14} /> },
                { label: 'LANGUAGE_ENGINE', value: '中英双语切换', icon: <MessageSquare size={14} /> },
                { label: 'ANALYSIS_DEPTH', value: '多维深度评估', icon: <Sparkles size={14} /> }
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-[10px] font-mono font-bold text-slate-300 tracking-widest flex items-center gap-2">
                    {stat.icon} {stat.label}
                  </p>
                  <p className="text-sm font-bold text-slate-600">{stat.value}</p>
                </div>
              ))}
            </div> */}
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

