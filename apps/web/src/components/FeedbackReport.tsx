import React, { useEffect, useState } from 'react';
import type { Feedback, Message, InterviewConfig } from '../types';
import { api } from '../api';

interface FeedbackReportProps {
  history: Message[];
  config: InterviewConfig;
  onRestart: () => void;
}

const FeedbackReport: React.FC<FeedbackReportProps> = ({ history, config, onRestart }) => {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const result = await api.getFeedback(history, config);
        setFeedback(result);
      } catch (e) {
        console.error(e);
        setError("无法生成评估报告，请检查网络或稍后重试。");
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, [history, config]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-white rounded-3xl shadow-sm border border-gray-100">
        <div className="inline-block animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-800">正在进行面试复盘...</h2>
        <p className="text-gray-500 mt-2">专家 AI 正在深度分析你的表现并生成报告</p>
      </div>
    );
  }

  if (error || !feedback) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4">{error}</div>
        <button onClick={onRestart} className="text-blue-600 hover:underline">重新开始</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold mb-2">面试评估报告</h2>
          <p className="opacity-90">{config.jobTitle} @ {config.company}</p>
          <div className="mt-6 inline-flex bg-white/20 backdrop-blur-md rounded-full px-6 py-2 items-center gap-2">
            <span className="text-sm font-medium">评估状态：</span>
            <span className="text-sm font-bold bg-green-400 text-green-900 px-2 py-0.5 rounded-full">已完成</span>
          </div>
        </div>
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/20" />
            <circle 
              cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
              strokeDasharray={364} 
              strokeDashoffset={364 - (364 * feedback.score) / 100}
              className="text-white"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-4xl font-black">{feedback.score}</span>
            <span className="text-[10px] uppercase tracking-wider font-bold opacity-80">综合得分</span>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4 text-emerald-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-bold">表现亮点</h3>
          </div>
          <ul className="space-y-3">
            {feedback.pros.map((pro, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-600 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                <span className="text-emerald-500 font-bold">•</span>
                {pro}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4 text-orange-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="font-bold">待改进项</h3>
          </div>
          <ul className="space-y-3">
            {feedback.cons.map((con, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-600 bg-orange-50/50 p-3 rounded-xl border border-orange-100">
                <span className="text-orange-500 font-bold">•</span>
                {con}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Improvement Suggestions */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4 text-blue-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h3 className="font-bold">提升建议</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {feedback.suggestions.map((suggestion, i) => (
            <div key={i} className="text-sm bg-blue-50/30 p-4 rounded-xl border border-blue-100 text-gray-700 italic">
              " {suggestion} "
            </div>
          ))}
        </div>
      </section>

      {/* Summary */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">综合点评</h3>
        <p className="text-gray-600 leading-relaxed text-sm">{feedback.overallSummary}</p>
      </section>

      <div className="flex justify-center pt-4">
        <button
          onClick={onRestart}
          className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg"
        >
          重新开启模拟
        </button>
      </div>
    </div>
  );
};

export default FeedbackReport;

