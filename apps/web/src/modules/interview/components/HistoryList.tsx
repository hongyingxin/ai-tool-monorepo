import React, { useEffect, useState } from 'react';
import { interviewDB } from '../db';
import type { InterviewRecord } from '../db';
import { Clock, Calendar, ChevronRight, Trash2, Award } from 'lucide-react';

interface HistoryListProps {
  onSelect: (record: InterviewRecord) => void;
  onBack: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ onSelect, onBack }) => {
  const [records, setRecords] = useState<InterviewRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    setLoading(true);
    const data = await interviewDB.getAllInterviews();
    setRecords(data);
    setLoading(false);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('确定要删除这条面试记录吗？')) {
      await interviewDB.deleteInterview(id);
      await loadRecords();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">面试历史</h2>
          <p className="text-slate-500 text-sm mt-1">保存于本地浏览器的面试记录</p>
        </div>
        <button
          onClick={onBack}
          className="text-slate-500 hover:text-slate-900 font-medium text-sm transition"
        >
          返回首页
        </button>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="text-slate-400" size={32} />
          </div>
          <p className="text-slate-500 font-medium">暂无面试记录</p>
          <button
            onClick={onBack}
            className="mt-4 text-blue-600 font-bold hover:underline"
          >
            去开始一场面试
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <div
              key={record.id}
              onClick={() => onSelect(record)}
              className="group bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex flex-col items-center justify-center text-blue-600 shrink-0">
                <span className="text-xs font-bold leading-none">{record.feedback.score}</span>
                <span className="text-[8px] uppercase font-black opacity-50 mt-1">Score</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-slate-900 truncate">{record.config.jobTitle}</h4>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded font-bold uppercase">
                    {record.config.company}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-slate-400 text-xs">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(record.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Award size={12} />
                    {record.history.length} 轮对话
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleDelete(e, record.id)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
                <ChevronRight className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" size={20} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryList;

