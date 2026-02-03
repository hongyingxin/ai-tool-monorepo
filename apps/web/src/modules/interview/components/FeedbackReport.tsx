import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Feedback } from '../types';
import { api } from '../api';
import { interviewDB } from '../db';
import { useInterviewStore } from '../store';
import EvaluationResults from './EvaluationResults';
import { Loader2, RefreshCw } from 'lucide-react';

/**
 * 面试结果报告页面组件
 * 路由路径: /interview/result
 * 面试结束后的第一展示点。负责调用 AI 生成反馈，并将结果自动保存到本地。
 */
const FeedbackReport: React.FC = () => {
  const navigate = useNavigate();
  const { config, messages: history, resetInterview } = useInterviewStore();
  
  // AI 生成的反馈数据
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  // 加载状态
  const [loading, setLoading] = useState(true);
  // 错误信息
  const [error, setError] = useState<string | null>(null);
  // SSE 流式传输时的原始文本预览
  const [rawStreamedText, setRawStreamedText] = useState('');
  // 记录是否已成功保存到本地数据库
  const [isSaved, setIsSaved] = useState(false);

  // 校验数据是否存在
  useEffect(() => {
    if (!config || history.length === 0) {
      navigate('/interview');
    }
  }, [config, history, navigate]);

  useEffect(() => {
    if (!config || history.length === 0) return;

    /**
     * 调用后端接口获取 AI 评估反馈
     */
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 使用流式接口提升用户等待时的体验
        const resultText = await api.getFeedbackStream(history, config, (text) => {
          setRawStreamedText(text);
        });
        
        // 尝试解析最终生成的完整 JSON 字符串
        try {
          const parsedFeedback = JSON.parse(resultText);
          setFeedback(parsedFeedback);
          
          // 获取报告后，自动将其连同对话历史保存到本地 IndexedDB
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
        setError("无法生成评估报告，请检查网络或稍后重试。");
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeedback();
  }, [history, config]);

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
        
        {/* 流式文本预览区 */}
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
      {/* 评估报告结果 */}
      <EvaluationResults feedback={feedback} config={config} />
      
      {/* 成功保存提示 */}
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

      {/* 底部按钮区域 */}
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
