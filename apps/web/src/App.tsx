import React, { useState } from 'react';
import { InterviewStatus } from './types';
import type { InterviewConfig, Message } from './types';
import SettingsForm from './components/SettingsForm';
import InterviewSession from './components/InterviewSession';
import FeedbackReport from './components/FeedbackReport';

const App: React.FC = () => {
  const [status, setStatus] = useState<InterviewStatus>(InterviewStatus.IDLE);
  const [config, setConfig] = useState<InterviewConfig | null>(null);
  const [history, setHistory] = useState<Message[]>([]);

  const handleStartInterview = (newConfig: InterviewConfig) => {
    setConfig(newConfig);
    setStatus(InterviewStatus.INTERVIEWING);
  };

  const handleFinishInterview = (interviewHistory: Message[]) => {
    setHistory(interviewHistory);
    setStatus(InterviewStatus.COMPLETED);
  };

  const handleRestart = () => {
    setStatus(InterviewStatus.IDLE);
    setHistory([]);
    setConfig(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans selection:bg-blue-100">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleRestart}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-lg">智</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-800">智面 AI <span className="text-blue-600">Interview</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-blue-600 transition">模拟场景</a>
            <a href="#" className="hover:text-blue-600 transition">面经题库</a>
            <a href="#" className="hover:text-blue-600 transition">我的报告</a>
          </div>
          <div>
             <button className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-blue-100 transition">
               登录
             </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {status === InterviewStatus.IDLE && (
          <div className="space-y-12">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-6xl font-black text-gray-900 leading-tight">
                通过 AI 模拟面试 <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  从容应对职场挑战
                </span>
              </h1>
              <p className="mt-6 text-xl text-gray-500 leading-relaxed">
                针对不同行业、不同职级的专业模拟面试。获取实时反馈，分析表达深度，助你在真实面试中脱颖而出。
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => setStatus(InterviewStatus.CONFIGURING)}
                  className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 transition transform hover:-translate-y-1"
                >
                  立即开始模拟
                </button>
                <button className="bg-white border border-gray-200 text-gray-700 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-gray-50 transition">
                  了解如何运作
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { title: "全岗位模拟", desc: "从产品经理到算法专家，涵盖 100+ 热门岗位。", icon: "💼" },
                 { title: "实时互动", desc: "基于最新大模型的自然语言对话，真实模拟面试氛围。", icon: "💬" },
                 { title: "多维报告", desc: "结构化评分、优劣势分析、改进建议，全方位复盘。", icon: "📊" }
               ].map((feat, i) => (
                 <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
                   <div className="text-4xl mb-4">{feat.icon}</div>
                   <h3 className="text-lg font-bold mb-2">{feat.title}</h3>
                   <p className="text-gray-500 text-sm">{feat.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        )}

        {status === InterviewStatus.CONFIGURING && (
          <SettingsForm onStart={handleStartInterview} />
        )}

        {status === InterviewStatus.INTERVIEWING && config && (
          <InterviewSession config={config} onFinish={handleFinishInterview} />
        )}

        {status === InterviewStatus.COMPLETED && config && (
          <FeedbackReport history={history} config={config} onRestart={handleRestart} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 py-12 border-t border-gray-100 text-center">
        <p className="text-gray-400 text-sm">© 2024 智面 AI - 基于 Google Gemini 提供动力支持</p>
      </footer>
    </div>
  );
};

export default App;
