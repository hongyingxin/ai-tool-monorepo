import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewDB, type InterviewRecord } from '../db';
import EvaluationResults from './EvaluationResults';
import { Clock, MessageSquare, Target, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * 面试详情展示页面组件
 * 通过 URL 中的 id 参数加载对应的面试记录
 */
const HistoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<InterviewRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [isChatExpanded, setIsChatExpanded] = useState(false);

  // 根据路由参数中的 id 加载数据
  useEffect(() => {
    if (id) {
      loadRecord(id);
    }
  }, [id]);

  const loadRecord = async (recordId: string) => {
    try {
      setLoading(true);
      const data = await interviewDB.getInterviewById(recordId);
      if (data) {
        setRecord(data);
      } else {
        // 如果找不到记录，返回列表页
        navigate('/interview/history');
      }
    } catch (error) {
      console.error('Failed to load history detail:', error);
      navigate('/interview/history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="font-medium">正在加载详情...</p>
      </div>
    );
  }

  if (!record) return null;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. 记录概览卡片 */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-slate-200 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-white/10 text-blue-400 text-[10px] font-black uppercase tracking-wider rounded-full backdrop-blur-md border border-white/5">
                {record.config.interviewType === 'technical' ? '技术面试' : 
                 record.config.interviewType === 'behavioral' ? '行为面试' : '综合面试'}
              </span>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                <Clock size={14} />
                {new Date(record.createdAt).toLocaleString('zh-CN')}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {record.config.jobTitle} <br />
              <span className="text-blue-500 text-2xl md:text-3xl opacity-80">@{record.config.company || '通用场景'}</span>
            </h1>

            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                <Target size={16} className="text-blue-400" />
                <span className="text-sm font-bold text-slate-300">{record.config.experienceLevel}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                <MessageSquare size={16} className="text-blue-400" />
                <span className="text-sm font-bold text-slate-300">{record.history.length} 轮对话</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">模拟面试评分</div>
            <div className="flex items-baseline gap-1">
              <span className="text-7xl font-black tabular-nums">{record.feedback.score}</span>
              <span className="text-2xl font-black text-slate-600">/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 历史对话记录回顾 (可收纳 + 内部滚动) */}
      <section className="space-y-6">
        <div 
          onClick={() => setIsChatExpanded(!isChatExpanded)}
          className="flex items-center justify-between cursor-pointer group px-2"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
              <MessageSquare size={20} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">对话回顾</h3>
          </div>
          <div className="flex items-center gap-2 text-slate-400 group-hover:text-blue-500 transition-all font-bold text-sm">
            {isChatExpanded ? '点击收回' : '点击展开'}
            {isChatExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>

        {isChatExpanded && (
          <div className="bg-slate-50/50 rounded-[2.5rem] border border-slate-100 p-6 md:p-8 animate-in slide-in-from-top-4 fade-in duration-500">
            <div className="max-h-[500px] overflow-y-auto pr-4 custom-scrollbar space-y-6">
              {record.history.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {msg.role === 'user' ? '候选人' : '面试官'}
                    </span>
                    <span className="text-[10px] text-slate-300 font-medium">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className={`max-w-[85%] rounded-[1.5rem] p-5 shadow-sm border ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white border-blue-500 rounded-tr-none' 
                      : 'bg-white border-slate-100 text-slate-700 rounded-tl-none'
                  }`}>
                    <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 3. 评估结果详细报告 */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">AI 评估报告</h3>
        </div>
        <EvaluationResults feedback={record.feedback} config={record.config} />
      </section>
    </div>
  );
};

export default HistoryDetail;
