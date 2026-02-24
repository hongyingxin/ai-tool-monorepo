import React from 'react';
import { 
  Trophy, 
  AlertTriangle, 
  Zap, 
  Lightbulb, 
  CheckCircle2, 
  XCircle,
  Hash
} from 'lucide-react';
import type { ResumeAnalysisResult } from '../types';

interface ResumeReportProps {
  report: ResumeAnalysisResult;
}

const ResumeReport: React.FC<ResumeReportProps> = ({ report }) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-500 border-emerald-100 bg-emerald-50';
    if (score >= 70) return 'text-blue-500 border-blue-100 bg-blue-50';
    if (score >= 60) return 'text-amber-500 border-amber-100 bg-amber-50';
    return 'text-red-500 border-red-100 bg-red-50';
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header: Score & Match Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`col-span-1 p-8 rounded-[2.5rem] border flex flex-col items-center justify-center text-center ${getScoreColor(report.score)}`}>
          <p className="text-xs font-black uppercase tracking-widest mb-2">综合诊断分</p>
          <div className="text-7xl font-black mb-2">{report.score}</div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/50 rounded-full text-[10px] font-bold">
            <Trophy size={12} />
            <span>{report.score >= 80 ? '优秀级别' : '仍有优化空间'}</span>
          </div>
        </div>
        
        <div className="col-span-1 md:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-center">
          <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
            <Zap size={20} className="text-blue-500" />
            匹配度分析
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed font-medium">
            {report.match_analysis}
          </p>
        </div>
      </div>

      {/* Grid: Highlights & Red Flags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-emerald-50/30 border border-emerald-100 p-8 rounded-[2.5rem]">
          <h3 className="text-emerald-700 font-black mb-6 flex items-center gap-2">
            <CheckCircle2 size={20} />
            简历亮点
          </h3>
          <ul className="space-y-4">
            {report.highlights.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-emerald-800 font-medium leading-relaxed">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-red-50/30 border border-red-100 p-8 rounded-[2.5rem]">
          <h3 className="text-red-700 font-black mb-6 flex items-center gap-2">
            <AlertTriangle size={20} />
            风险提示 (Red Flags)
          </h3>
          <ul className="space-y-4">
            {report.red_flags.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-red-800 font-medium leading-relaxed">
                <XCircle size={16} className="mt-0.5 text-red-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Key Optimizations: Comparison */}
      <section className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-sm">
        <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-2">
          <Lightbulb size={24} className="text-amber-500" />
          核心优化建议 (修改前后)
        </h3>
        <div className="space-y-6">
          {report.key_optimizations.map((opt, i) => (
            <div key={i} className="group border border-gray-50 rounded-3xl overflow-hidden hover:border-blue-100 transition-colors">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-6 bg-gray-50/50 border-b md:border-b-0 md:border-r border-gray-100">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">修改前</span>
                  <p className="text-sm text-gray-500 italic line-through">{opt.original}</p>
                </div>
                <div className="p-6 bg-blue-50/20">
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3 block">专家优化后</span>
                  <p className="text-sm text-blue-700 font-bold leading-relaxed">{opt.suggestion}</p>
                  {opt.reason && (
                    <p className="mt-3 text-[11px] text-blue-400 bg-white/50 inline-block px-2 py-1 rounded-lg border border-blue-50">
                      💡 {opt.reason}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Missing Keywords */}
      {report.missing_keywords.length > 0 && (
        <section className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
          <h3 className="text-lg font-black mb-6 flex items-center gap-2">
            <Hash size={20} className="text-blue-400" />
            查漏补缺：JD 核心关键词
          </h3>
          <div className="flex flex-wrap gap-3">
            {report.missing_keywords.map((word, i) => (
              <span key={i} className="px-4 py-2 bg-white/10 rounded-xl text-sm font-bold border border-white/10 hover:bg-white/20 transition-colors">
                {word}
              </span>
            ))}
          </div>
          <p className="mt-6 text-xs text-slate-400 font-medium">
            提示：在简历中适当增加以上关键词，能显著提升招聘系统 (ATS) 的筛选通过率。
          </p>
        </section>
      )}
    </div>
  );
};

export default ResumeReport;

