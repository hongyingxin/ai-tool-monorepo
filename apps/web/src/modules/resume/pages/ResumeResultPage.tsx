import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Sparkles, Wand2, ArrowRight } from 'lucide-react';
import ResumeReport from '../components/ResumeReport';
import { useResumeStore } from '../store';

const ResumeResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { analysisReport, extractedText } = useResumeStore();

  // 如果没有报告且没有解析出的文本（说明是直接刷新或跳转过来的），则返回设置页
  useEffect(() => {
    if (!analysisReport && !extractedText) {
      navigate('/resume');
    }
  }, [analysisReport, extractedText, navigate]);

  if (!analysisReport) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-700">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 animate-pulse">
          <Sparkles size={32} />
        </div>
        <p className="text-gray-500 font-bold">正在加载诊断结果...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 优化引导卡片 */}
      <div className="mb-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
            <Wand2 size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black mb-1">想要一键应用这些优化吗？</h2>
            <p className="text-blue-100 text-sm font-medium">AI 已根据诊断建议为您重写了一份高分简历</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/resume/preview')}
          className="group flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-2xl font-black hover:bg-blue-50 transition-all active:scale-95 shadow-lg shrink-0"
        >
          <span>预览优化后的简历</span>
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <ResumeReport 
        report={analysisReport} 
      />
      
      <div className="mt-12 text-center pb-20">
        <p className="text-sm text-gray-400 font-medium mb-4">想要尝试不同的 JD 进行对标分析？</p>
        <button 
          onClick={() => navigate('/resume')}
          className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200"
        >
          <RefreshCw size={18} />
          <span>重新上传或修改 JD</span>
        </button>
      </div>
    </div>
  );
};

export default ResumeResultPage;

