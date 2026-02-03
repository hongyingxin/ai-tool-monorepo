import React, { useState } from 'react';
import type { InterviewRecord } from '../db';
import EvaluationResults from './EvaluationResults';
import { MessageSquare, ArrowLeft, Calendar, Award, ChevronDown, ChevronUp } from 'lucide-react';

interface HistoryDetailProps {
  /** 完整的面试历史记录对象 */
  record: InterviewRecord;
  /** 返回列表页的回调 */
  onBack: () => void;
}

/**
 * 历史面试详情页组件
 * 采用上下布局：顶部导航 -> 对话回顾（默认折叠） -> 评估结果
 * 专门用于回顾过去的面试表现和对话细节
 */
const HistoryDetail: React.FC<HistoryDetailProps> = ({ record, onBack }) => {
  // 控制对话历史回顾部分的折叠状态
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      {/* 顶部导航与元数据区域 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition font-medium group self-start"
        >
          <div className="p-2 rounded-full group-hover:bg-slate-100 transition-colors">
            <ArrowLeft size={20} />
          </div>
          返回历史列表
        </button>
        {/* 展示面试时间和对话轮数 */}
        <div className="flex flex-wrap items-center gap-4 md:gap-6 text-slate-400 text-xs">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg">
            <Calendar size={14} className="text-slate-300" />
            {new Date(record.createdAt).toLocaleString()}
          </div>
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg">
            <Award size={14} className="text-slate-300" />
            {record.history.length} 轮对话
          </div>
        </div>
      </div>

      {/* 1. 对话回顾区 (置顶，支持手风琴式折叠) */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all">
        {/* 折叠触发按钮 */}
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${showHistory ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
              <MessageSquare size={20} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-slate-900">对话回顾</h3>
              <p className="text-xs text-slate-400 mt-0.5">点击{showHistory ? '收起' : '展开'}完整的面试对话记录</p>
            </div>
          </div>
          {showHistory ? <ChevronUp className="text-slate-300" /> : <ChevronDown className="text-slate-300" />}
        </button>

        {/* 展开后的对话历史列表 */}
        {showHistory && (
          <div className="p-6 bg-slate-50/50 border-t border-slate-100 space-y-6 max-h-[600px] overflow-y-auto animate-in slide-in-from-top-2 duration-300">
            {record.history.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {msg.role === 'user' ? '候选人 (你)' : '面试官'}
                  </span>
                </div>
                {/* 对话气泡展示 */}
                <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 2. 评估结果区 (下方，直接展示) */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 px-1">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
            <Award size={20} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">评估结果</h3>
        </div>
        {/* 复用核心结果展示组件 */}
        <EvaluationResults feedback={record.feedback} config={record.config} />
      </section>
    </div>
  );
};

export default HistoryDetail;
