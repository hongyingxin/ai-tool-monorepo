import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Upload, 
  Target, 
  ArrowRight, 
  Loader2, 
  X, 
  AlertCircle,
  FileSearch,
  ChevronRight,
  History
} from 'lucide-react';
import { parseResumeFile } from '../utils/parser';
import { client } from '../../../shared/api/client';
import type { ResumeAnalysisResult } from '../types';
import { useResumeStore } from '../store';

const ResumeSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    extractedText, 
    fileName, 
    targetJobDescription,
    setExtractedText,
    setFileName,
    setTargetJobDescription,
    setAnalysisReport,
  } = useResumeStore();

  const [status, setStatus] = useState<'idle' | 'parsing' | 'analyzing' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 如果已经有报告，进入此页面时重置
  useEffect(() => {
    // 只有在初始挂载且有报告时才决定是否重置，或者保持状态
    // 这里我们选择不自动重置，让用户可以看到之前的选择
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = async (selectedFile: File) => {
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx'].includes(extension || '')) {
      setError('仅支持 PDF 和 DOCX 格式的文件');
      setStatus('error');
      return;
    }

    setFileName(selectedFile.name);
    setStatus('parsing');
    setError(null);

    try {
      const text = await parseResumeFile(selectedFile);
      setExtractedText(text);
      setStatus('idle');
    } catch (err: any) {
      setError(err.message || '文件解析失败');
      setStatus('error');
      setFileName('');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const handleStartAnalysis = async () => {
    if (!extractedText) return;

    setStatus('analyzing');
    setError(null);

    try {
      const result = await client.post<ResumeAnalysisResult>('/ai/resume/analyze', {
        resumeText: extractedText,
        jobDescription: targetJobDescription
      });
      setAnalysisReport(result);
      setStatus('idle');
      navigate('/resume/result');
    } catch (err: any) {
      setError(err.message || '分析失败，请稍后重试');
      setStatus('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Left: Input Area */}
        <div className="lg:col-span-3 space-y-6">
          <section className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Upload size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">上传简历</h2>
                <p className="text-xs text-gray-400 font-medium">支持 PDF, DOCX 格式</p>
              </div>
            </div>

            {fileName ? (
              <div className="relative group bg-blue-50/30 border-2 border-dashed border-blue-200 rounded-3xl p-8 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                    <FileText size={28} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-gray-900 truncate">{fileName}</p>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">
                      {status === 'parsing' ? '正在提取文本...' : '已解析'}
                    </p>
                  </div>
                  <button 
                    onClick={() => { setFileName(''); setExtractedText(''); }}
                    className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                {status === 'parsing' && (
                  <div className="mt-6 flex items-center gap-2 text-blue-600 text-xs font-bold animate-pulse">
                    <Loader2 size={14} className="animate-spin" />
                    <span>智能解析中...</span>
                  </div>
                )}
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="group border-2 border-dashed border-gray-100 hover:border-blue-400 hover:bg-blue-50/30 rounded-3xl p-12 transition-all cursor-pointer text-center"
              >
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept=".pdf,.docx" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
                <div className="w-16 h-16 bg-gray-50 group-hover:bg-white rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 mx-auto mb-4 transition-all shadow-sm">
                  <Upload size={28} />
                </div>
                <p className="text-sm font-bold text-gray-600 mb-1">点击或拖拽简历到此处</p>
                <p className="text-xs text-gray-400">我们将自动提取简历内容进行分析</p>
              </div>
            )}
          </section>

          <section className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <Target size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">目标岗位 (可选)</h2>
                <p className="text-xs text-gray-400 font-medium">提供 JD 可以让分析更具针对性</p>
              </div>
            </div>
            <textarea 
              value={targetJobDescription}
              onChange={(e) => setTargetJobDescription(e.target.value)}
              placeholder="粘贴目标职位的描述 (JD)，我们将针对性地分析您的匹配度..."
              className="w-full h-48 px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium resize-none placeholder:text-gray-300"
            />
          </section>
        </div>

        {/* Right: Guide Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-200">
            <h3 className="text-lg font-black mb-6 flex items-center gap-2">
              <FileSearch size={20} className="text-blue-400" />
              分析说明
            </h3>
            <ul className="space-y-4">
              {[
                { title: '多维度评分', desc: '基于内容质量、逻辑性和岗位匹配度打分' },
                { title: '硬伤扫雷', desc: '自动识别简历中可能导致被淘汰的负面因素' },
                { title: '表达建议', desc: '将普通描述转化为更具竞争力的专业表达' },
                { title: '关键词对标', desc: '对比 JD 查漏补缺，提升系统筛选通过率' }
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <div>
                    <p className="text-sm font-bold">{item.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <button 
              onClick={handleStartAnalysis}
              disabled={!fileName || status === 'parsing' || status === 'analyzing'}
              className="w-full mt-10 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95"
            >
              {status === 'analyzing' ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>专家诊断中...</span>
                </>
              ) : (
                <>
                  <span>开始 AI 专家诊断</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-xs font-bold animate-in zoom-in-95">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-[2rem] border border-gray-100 p-6 flex items-center justify-between group cursor-pointer hover:border-blue-200 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors">
                <History size={20} />
              </div>
              <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">历史分析记录</span>
            </div>
            <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500 transition-all group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeSetupPage;
