import React, { useState } from 'react';
import type { InterviewRecord } from '../db';
import EvaluationResults from './EvaluationResults';
import { MessageSquare, ArrowLeft, Calendar, Award, ChevronDown, ChevronUp } from 'lucide-react';

interface HistoryDetailProps {
  record: InterviewRecord;
  onBack: () => void;
}

const HistoryDetail: React.FC<HistoryDetailProps> = ({ record, onBack }) => {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      {/* Top Navigation */}
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

      {/* 1. Dialogue History (Top, Collapsible) */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all">
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

        {showHistory && (
          <div className="p-6 bg-slate-50/50 border-t border-slate-100 space-y-6 max-h-[600px] overflow-y-auto animate-in slide-in-from-top-2 duration-300">
            {record.history.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {msg.role === 'user' ? '候选人 (你)' : '面试官'}
                  </span>
                </div>
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

      {/* 2. Evaluation Results (Bottom) */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 px-1">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
            <Award size={20} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">评估结果</h3>
        </div>
        <EvaluationResults feedback={record.feedback} config={record.config} />
      </section>
    </div>
  );
};

export default HistoryDetail;
