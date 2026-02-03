import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Feedback } from '../types';
import { api } from '../api';
import { interviewDB } from '../db';
import { useInterviewStore } from '../store';
import EvaluationResults from '../components/EvaluationResults';
import { Loader2, RefreshCw } from 'lucide-react';

/**
 * 面试结果报告页面组件
 * 路由路径: /interview/result
 */
const FeedbackReport: React.FC = () => {
  const navigate = useNavigate();
  const { config, messages: history, resetInterview, feedback, setFeedback } = useInterviewStore();
  
  const [loading, setLoading] = useState(!feedback);
  const [error, setError] = useState<string | null>(null);
  const [rawStreamedText, setRawStreamedText] = useState('');
  const [isSaved, setIsSaved] = useState(!!feedback);

  useEffect(() => {
    if (!config || history.length === 0) {
      navigate('/interview');
    }
  }, [config, history, navigate]);

  useEffect(() => {
    if (feedback || !config || history.length === 0) return;

    const fetchFeedback = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const resultText = await api.getFeedbackStream(history, config, (text) => {
          setRawStreamedText(text);
        });
        
        try {
          const parsedFeedback = JSON.parse(resultText);
          setFeedback(parsedFeedback);
          
          await interviewDB.saveInterview({
            id: crypto.randomUUID(),
            createdAt: Date.now(),
            config,
            history,
            feedback: parsedFeedback
          });
          setIsSaved(true);
        } catch (parseError) {
          console.error("Failed to parse final feedback JSON:", resultText);
          setError("报告生成格式有误，请重试。");
        }
      } catch (e) {
        console.error(e);
        setError("无法生成评估报告，检查网络或稍后重试。");
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeedback();
  }, [history, config, feedback, setFeedback]);

  const handleBackToHome = () => {
    resetInterview();
    navigate('/interview');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-12 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
        <div className="relative inline-flex">
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white animate-pulse"></div>
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">正在进行面试复盘...</h2>
          <p className="text-slate-400 mt-2 font-medium">专家 AI 正在深度分析你的表现并生成报告</p>
        </div>
        {rawStreamedText && (
          <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 font-mono text-xs text-slate-400 overflow-hidden text-left relative">
            <div className="flex items-center gap-2 mb-3 text-slate-500 font-bold">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
              <span>数据流实时预览</span>
            </div>
            <div className="whitespace-pre-wrap break-all opacity-50 line-clamp-4">
              {rawStreamedText}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (error || !feedback || !config) {
    return (
      <div className="max-w-2xl mx-auto p-12 bg-white rounded-[2.5rem] border border-slate-100 text-center shadow-xl shadow-slate-200/50">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <RefreshCw size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">生成报告失败</h3>
        <p className="text-slate-400 mb-8">{error || '出现未知错误'}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all active:scale-95"
        >
          重试生成
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      <EvaluationResults feedback={feedback} config={config} />
      {isSaved && (
        <div className="flex justify-center">
          <div className="inline-flex bg-emerald-50 text-emerald-700 px-6 py-3 rounded-2xl text-xs font-black border border-emerald-100 items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="w-5 h-5 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            已自动存入本地历史记录，可随时查看
          </div>
        </div>
      )}
      <div className="flex justify-center pt-4">
        <button
          onClick={handleBackToHome}
          className="group px-12 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black hover:bg-blue-600 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-200"
        >
          返回欢迎页
        </button>
      </div>
    </div>
  );
};

export default FeedbackReport;

