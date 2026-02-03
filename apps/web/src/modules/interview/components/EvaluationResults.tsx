import React from 'react';
import type { Feedback, InterviewConfig } from '../types';

interface EvaluationResultsProps {
  /** AI 生成的评估反馈数据 */
  feedback: Feedback;
  /** 当时的面试配置信息 */
  config: InterviewConfig;
}

/**
 * 面试评估结果展示组件
 * 纯展示组件，负责渲染得分、亮点、待改进项、建议和总结
 * 在结果报告页和历史详情页中复用
 */
const EvaluationResults: React.FC<EvaluationResultsProps> = ({ feedback, config }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 顶部得分区域 */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold mb-2">面试评估报告</h2>
          <p className="opacity-90">{config.jobTitle} @ {config.company}</p>
          <div className="mt-6 inline-flex bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 items-center gap-2">
            <span className="text-xs font-medium">评估状态：</span>
            <span className="text-xs font-bold bg-green-400 text-green-900 px-2 py-0.5 rounded-full">已完成</span>
          </div>
        </div>
        {/* 圆形进度条展示分数 */}
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/20" />
            <circle 
              cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
              strokeDasharray={364} 
              strokeDashoffset={364 - (364 * feedback.score) / 100}
              className="text-white transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-4xl font-black">{feedback.score}</span>
            <span className="text-[10px] uppercase tracking-wider font-bold opacity-80">综合得分</span>
          </div>
        </div>
      </div>

      {/* 亮点与不足双栏展示 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 亮点展示 */}
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

        {/* 待改进项展示 */}
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

      {/* 提升建议区域 */}
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

      {/* 专家点评总结 */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">综合点评</h3>
        <p className="text-gray-600 leading-relaxed text-sm">{feedback.overallSummary}</p>
      </section>
    </div>
  );
};

export default EvaluationResults;
