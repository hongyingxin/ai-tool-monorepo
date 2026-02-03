import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewDB, type InterviewRecord } from '../db';
import { History, Calendar, Briefcase, ChevronRight, Trash2 } from 'lucide-react';

/**
 * 面试历史记录列表页面组件
 */
const HistoryList: React.FC = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<InterviewRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const data = await interviewDB.getAllInterviews();
      setRecords(data);
    } catch (error) {
      console.error('Failed to load interview history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('确定要删除这条面试记录吗？')) {
      try {
        await interviewDB.deleteInterview(id);
        await loadRecords();
      } catch (error) {
        console.error('Failed to delete record:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="font-medium">正在加载历史记录...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {records.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 p-20 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <History className="text-slate-200" size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">暂无面试记录</h3>
          <p className="text-slate-400 mb-8">您还没有完成过模拟面试，快去开启您的第一场挑战吧！</p>
          <button
            onClick={() => navigate('/interview')}
            className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors"
          >
            开启新面试
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <div
              key={record.id}
              onClick={() => navigate(`/interview/history/${record.id}`)}
              className="group bg-white rounded-3xl border border-slate-100 p-6 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer relative"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider rounded-full">
                      {record.config.interviewType === 'technical' ? '技术面试' : 
                       record.config.interviewType === 'behavioral' ? '行为面试' : '综合面试'}
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                      <Calendar size={14} />
                      {new Date(record.createdAt).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {record.config.jobTitle}
                    </h4>
                    <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
                      <div className="flex items-center gap-1.5">
                        <Briefcase size={14} className="text-slate-300" />
                        {record.config.company || '通用场景'}
                      </div>
                      <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                      <div>{record.config.experienceLevel}</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                  <div className="text-right">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">得分</div>
                    <div className="text-3xl font-black text-slate-900 tabular-nums">
                      {record.feedback.score}<span className="text-sm text-slate-300 ml-0.5">/100</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDelete(e, record.id)}
                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                      title="删除记录"
                    >
                      <Trash2 size={20} />
                    </button>
                    <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryList;

