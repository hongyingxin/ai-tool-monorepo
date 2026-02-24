import React from 'react';
import Markdown from '../../../shared/components/Markdown';
import { Download, Copy, Check, FileDown, Sparkles } from 'lucide-react';
import { useResumeStore } from '../store';
import { useNavigate } from 'react-router-dom';

const ResumePreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { analysisReport } = useResumeStore();
  const [copied, setCopied] = React.useState(false);

  if (!analysisReport?.optimized_resume) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 font-bold">暂无优化后的简历内容</p>
        <button 
          onClick={() => navigate('/resume')}
          className="mt-4 text-blue-600 font-bold hover:underline"
        >
          返回分析
        </button>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(analysisReport.optimized_resume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const element = document.createElement("a");
    const file = new Blob([analysisReport.optimized_resume], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = "优化后的简历.md";
    document.body.appendChild(element);
    element.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 no-print">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Sparkles className="text-blue-600" size={24} />
            AI 优化简历预览
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all"
          >
            {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
            <span>{copied ? '已复制' : '复制内容'}</span>
          </button>
          
          <button 
            onClick={handleDownloadMarkdown}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all"
          >
            <Download size={16} />
            <span>下载 MD</span>
          </button>

          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl font-black text-sm hover:bg-blue-500 transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            <FileDown size={16} />
            <span>导出 PDF / 打印</span>
          </button>
        </div>
      </div>

      {/* Resume Preview Card */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden print:shadow-none print:border-none print:rounded-none resume-content">
        <div className="p-8 md:p-12 print:p-0">
          <div className="prose prose-slate max-w-none prose-headings:font-black prose-headings:text-gray-900 prose-p:font-medium prose-p:text-gray-600 prose-li:font-medium">
            <Markdown content={analysisReport.optimized_resume} />
          </div>
        </div>
      </div>

      {/* Floating Tip */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 no-print animate-in slide-in-from-bottom-10">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Sparkles size={16} />
        </div>
        <p className="text-sm font-bold">已根据专家诊断建议完成全量优化</p>
      </div>

      {/* Print Specific Styles */}
      <style>{`
        @media print {
          /* 1. 隐藏所有带有 no-print 类的元素 */
          .no-print { display: none !important; }
          
          /* 2. 解除所有父容器的高度限制和滚动限制，确保内容可以分页跨页 */
          html, body, #root, .flex.h-screen, main {
            height: auto !important;
            overflow: visible !important;
            position: static !important;
            display: block !important;
          }

          /* 3. 重置边距 */
          body { 
            background: white !important; 
            margin: 0 !important;
            padding: 0 !important;
          }

          .max-w-4xl { 
            max-width: 100% !important; 
            width: 100% !important;
            margin: 0 !important;
          }

          /* 4. 去掉简历卡片的圆角、阴影和边框，并设置打印边距 */
          .resume-content {
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            padding: 20mm !important;
          }

          /* 5. 设置 A4 纸张边距 */
          @page { 
            size: A4;
            margin: 0; /* 隐藏浏览器自带的页眉页脚 */
          }

          /* 6. 强制文字颜色为黑色，提高打印清晰度 */
          .prose { 
            color: black !important; 
            max-width: 100% !important;
          }
          .prose h1, .prose h2, .prose h3 { color: black !important; }
        }
      `}</style>
    </div>
  );
};

export default ResumePreviewPage;

