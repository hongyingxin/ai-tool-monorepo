import React, { useState } from 'react';
import { InterviewStatus } from './types';
import type { InterviewConfig, Message } from './types';
import SettingsForm from './components/SettingsForm';
import InterviewSession from './components/InterviewSession';
import FeedbackReport from './components/FeedbackReport';
import HistoryList from './components/HistoryList';
import HistoryDetail from './components/HistoryDetail';
import type { InterviewRecord } from './db';
import { Sparkles, MessageSquare, ArrowRight, Cpu, History } from 'lucide-react';

const InterviewPage: React.FC = () => {
  const [status, setStatus] = useState<InterviewStatus>(InterviewStatus.IDLE);
  const [config, setConfig] = useState<InterviewConfig | null>(null);
  const [history, setHistory] = useState<Message[]>([]);
  const [viewingRecord, setViewingRecord] = useState<InterviewRecord | null>(null);

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
    setViewingRecord(null);
  };

  const handleSelectHistory = (record: InterviewRecord) => {
    setViewingRecord(record);
    setStatus(InterviewStatus.VIEWING_HISTORY);
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

            <div className="pt-12 flex flex-col md:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setStatus(InterviewStatus.CONFIGURING)}
                className="group relative px-12 py-5 bg-slate-900 text-white rounded-2xl font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-200 w-full md:w-auto"
              >
                <span className="relative z-10 flex items-center gap-3 text-lg">
                  初始化面试场景
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>

              <button
                onClick={() => setStatus(InterviewStatus.HISTORY)}
                className="flex items-center gap-2 px-8 py-5 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all hover:border-slate-200 w-full md:w-auto justify-center"
              >
                <History size={20} />
                查看面试历史
              </button>
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

      {status === InterviewStatus.HISTORY && (
        <HistoryList 
          onSelect={handleSelectHistory} 
          onBack={handleRestart} 
        />
      )}

      {status === InterviewStatus.VIEWING_HISTORY && viewingRecord && (
        <HistoryDetail 
          record={viewingRecord} 
          onBack={() => setStatus(InterviewStatus.HISTORY)} 
        />
      )}
    </div>
  );
};

export default InterviewPage;

