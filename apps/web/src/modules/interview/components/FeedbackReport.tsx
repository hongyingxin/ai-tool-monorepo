import React, { useEffect, useState } from 'react';
import type { Feedback, Message, InterviewConfig } from '../types';
import { api } from '../api';
import { interviewDB } from '../db';
import EvaluationResults from './EvaluationResults';

interface FeedbackReportProps {
  /** 面试全程对话历史 */
  history: Message[];
  /** 面试配置信息 */
  config: InterviewConfig;
  /** 重启面试的回调函数 */
  onRestart: () => void;
}

/**
 * 面试结果报告页面组件
 * 面试结束后的第一展示点。负责调用 AI 生成反馈，并将结果自动保存到本地。
 */
const FeedbackReport: React.FC<FeedbackReportProps> = ({ history, config, onRestart }) => {
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

  useEffect(() => {
    /**
     * 调用后端接口获取 AI 评估反馈
     */
    const fetchFeedback = async () => {
      try {
        setLoading(true);
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
          console.log('Interview result saved to local storage.');
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

  // 加载中状态展示：显示动画及流式文本块预览
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-12 bg-white rounded-3xl shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-block animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800">正在进行面试复盘...</h2>
          <p className="text-gray-500 mt-2">专家 AI 正在深度分析你的表现并生成报告</p>
        </div>
        
        {/* 流式文本预览区，让用户知道后台正在处理 */}
        {rawStreamedText && (
          <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 font-mono text-xs text-slate-400 overflow-hidden">
            <div className="flex items-center gap-2 mb-2 text-slate-500">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
              <span>正在生成数据块...</span>
            </div>
            <div className="whitespace-pre-wrap break-all opacity-50">
              {rawStreamedText.length > 500 ? '...' + rawStreamedText.slice(-500) : rawStreamedText}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 错误状态展示
  if (error || !feedback) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4">{error}</div>
        <button onClick={onRestart} className="text-blue-600 hover:underline">重新开始</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 引入评估结果展示组件 */}
      <EvaluationResults feedback={feedback} config={config} />
      
      {/* 成功保存提示标签 */}
      {isSaved && (
        <div className="flex justify-center">
          <div className="inline-flex bg-green-50 text-green-700 px-4 py-2 rounded-full text-xs font-bold border border-green-100 items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            已自动存入本地历史记录
          </div>
        </div>
      )}

      {/* 底部按钮区域 */}
      <div className="flex justify-center pt-4 pb-12">
        <button
          onClick={onRestart}
          className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg"
        >
          返回首页
        </button>
      </div>
    </div>
  );
};

export default FeedbackReport;
