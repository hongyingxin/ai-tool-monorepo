import React from 'react';
import { X, Zap, Sparkles, CheckCircle2, Circle, Rocket } from 'lucide-react';
import { CHANGELOG, type VersionRecord } from '../../constants/changelog';

interface VersionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const VersionDrawer: React.FC<VersionDrawerProps> = ({ isOpen, onClose }) => {
  const [hasBeenOpened, setHasBeenOpened] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setHasBeenOpened(true);
    }
  }, [isOpen]);

  if (!hasBeenOpened && !isOpen) return null;

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'feature': return 'bg-blue-50 text-blue-600';
      case 'optimization': return 'bg-emerald-50 text-emerald-600';
      case 'bugfix': return 'bg-amber-50 text-amber-600';
      case 'ui': return 'bg-purple-50 text-purple-600';
      case 'planned': return 'bg-slate-100 text-slate-500';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'feature': return '新功能';
      case 'optimization': return '优化';
      case 'bugfix': return '修复';
      case 'ui': return '视觉';
      case 'planned': return '计划';
      default: return '更新';
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] transform transition-transform duration-500 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                <Rocket size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">更新日志</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Version & Roadmap</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-slate-600 transition-colors border border-transparent hover:border-slate-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
            {CHANGELOG.map((record, idx) => (
              <div key={record.version} className="relative pl-8">
                {/* Timeline Line */}
                {idx !== CHANGELOG.length - 1 && (
                  <div className="absolute left-[11px] top-6 bottom-[-40px] w-[2px] bg-slate-100" />
                )}

                {/* Timeline Dot */}
                <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 ${
                  record.status === 'completed' ? 'bg-blue-500' : 'bg-slate-200'
                }`}>
                  {record.status === 'completed' ? (
                    <CheckCircle2 size={12} className="text-white" />
                  ) : (
                    <Circle size={12} className="text-white fill-white" />
                  )}
                </div>

                {/* Version Info */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-lg font-black tracking-tight ${
                      record.status === 'completed' ? 'text-slate-900' : 'text-slate-400'
                    }`}>
                      {record.version}
                    </span>
                    {idx === 1 && (
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-md uppercase">Current</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 font-bold">{record.date}</div>
                </div>

                {/* Changelog Items */}
                <div className="space-y-3">
                  {record.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 group">
                      <div className={`mt-1 shrink-0 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${getTypeStyles(item.type)}`}>
                        {getTypeText(item.type)}
                      </div>
                      <p className={`text-sm leading-relaxed ${
                        record.status === 'completed' ? 'text-slate-600 font-medium' : 'text-slate-400 font-medium italic'
                      }`}>
                        {item.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-50 bg-slate-50/30 text-center">
            <p className="text-xs text-slate-400 font-medium">
              {/* 感谢您的支持，我们会持续进化 🚀 */}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default VersionDrawer;

