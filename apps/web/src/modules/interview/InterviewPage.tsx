import React, { useState } from 'react';
import { InterviewStatus } from './types';
import type { InterviewConfig, Message } from './types';
import SettingsForm from './components/SettingsForm';
import InterviewSession from './components/InterviewSession';
import FeedbackReport from './components/FeedbackReport';
import HistoryList from './components/HistoryList';
import HistoryDetail from './components/HistoryDetail';
import type { InterviewRecord } from './db';
import { ArrowRight, History } from 'lucide-react';

/**
 * 面试模块主页面组件
 * 负责管理面试的整体流程状态：欢迎页 -> 配置 -> 面试中 -> 结果展示 / 历史记录列表 -> 历史详情
 */
const InterviewPage: React.FC = () => {
  // 当前面试流程状态
  const [status, setStatus] = useState<InterviewStatus>(InterviewStatus.IDLE);
  // 当前面试的配置信息
  const [config, setConfig] = useState<InterviewConfig | null>(null);
  // 当前面试的对话历史
  const [history, setHistory] = useState<Message[]>([]);
  // 当前正在查看的历史记录对象
  const [viewingRecord, setViewingRecord] = useState<InterviewRecord | null>(null);

  /**
   * 处理开始面试，从配置进入面试对话
   */
  const handleStartInterview = (newConfig: InterviewConfig) => {
    setConfig(newConfig);
    setStatus(InterviewStatus.INTERVIEWING);
  };

  /**
   * 处理面试结束，进入结果报告页
   */
  const handleFinishInterview = (interviewHistory: Message[]) => {
    setHistory(interviewHistory);
    setStatus(InterviewStatus.COMPLETED);
  };

  /**
   * 重置所有状态，回到欢迎页
   */
  const handleRestart = () => {
    setStatus(InterviewStatus.IDLE);
    setHistory([]);
    setConfig(null);
    setViewingRecord(null);
  };

  /**
   * 从历史列表中选择某条记录查看详情
   */
  const handleSelectHistory = (record: InterviewRecord) => {
    setViewingRecord(record);
    setStatus(InterviewStatus.VIEWING_HISTORY);
  };

  return (
    <div className="h-full">
      {/* 1. 欢迎页 (IDLE) */}
      {status === InterviewStatus.IDLE && (
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

      {/* 2. 配置页 (CONFIGURING) */}
      {status === InterviewStatus.CONFIGURING && (
        <div className="max-w-2xl mx-auto py-8">
          <SettingsForm onStart={handleStartInterview} />
        </div>
      )}

      {/* 3. 面试对话页 (INTERVIEWING) */}
      {status === InterviewStatus.INTERVIEWING && config && (
        <div className="h-full">
          <InterviewSession config={config} onFinish={handleFinishInterview} />
        </div>
      )}

      {/* 4. 面试结果页 (COMPLETED) */}
      {status === InterviewStatus.COMPLETED && config && (
        <div className="py-8">
          <FeedbackReport history={history} config={config} onRestart={handleRestart} />
        </div>
      )}

      {/* 5. 历史记录列表页 (HISTORY) */}
      {status === InterviewStatus.HISTORY && (
        <HistoryList 
          onSelect={handleSelectHistory} 
          onBack={handleRestart} 
        />
      )}

      {/* 6. 历史记录详情页 (VIEWING_HISTORY) */}
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
