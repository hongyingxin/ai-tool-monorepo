import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRound, MessageSquareText, FileText, Code2, ArrowRight } from 'lucide-react';

const tools = [
  {
    id: 'interview',
    title: 'AI 模拟面试',
    desc: '针对不同岗位进行 1:1 深度模拟面试，获取专业反馈和评估报告。',
    icon: <UserRound className="text-blue-500" size={32} />,
    color: 'bg-blue-50',
    path: '/interview'
  },
  {
    id: 'chat',
    title: 'AI 智能助手',
    desc: '基于 Gemini 2.5 的通用对话助手，回答问题、编写代码或头脑风暴。',
    icon: <MessageSquareText className="text-emerald-500" size={32} />,
    color: 'bg-emerald-50',
    path: '/chat'
  },
  {
    id: 'write',
    title: '简历优化',
    desc: '上传简历或输入经历，AI 帮你打磨出更具竞争力的内容。',
    icon: <FileText className="text-orange-500" size={32} />,
    color: 'bg-orange-50',
    path: '#'
  },
  {
    id: 'code',
    title: '代码解释器',
    desc: '深度解析代码逻辑，发现潜在漏洞并提供优化方案。',
    icon: <Code2 className="text-indigo-500" size={32} />,
    color: 'bg-indigo-50',
    path: '#'
  }
];

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-full pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Decorative Background Elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/2 -left-24 w-72 h-72 bg-emerald-400/5 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Hero Section */}
      <div className="relative z-10 mt-6 mb-16 p-12 md:p-20 bg-white/60 backdrop-blur-xl rounded-[3.5rem] border border-white shadow-sm shadow-blue-500/5">
        <div className="max-w-3xl">
          <div className="flex items-center gap-4 mb-10">
            <div className="px-4 py-1.5 rounded-full bg-white border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
              小智工作台
            </div>
            <div className="h-px w-12 bg-gray-200"></div>
            <span className="text-gray-400 text-sm font-semibold tracking-wide">
              {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })}
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-10 tracking-tight leading-[1.15]">
            你好，我是<span className="text-blue-600">小智</span><br />
            今天想开启哪项 AI 辅助？
          </h1>
          
          <p className="text-gray-500 text-xl font-medium leading-[2] max-w-xl">
            欢迎回到你的私人 AI 助手空间。在这里，你可以进行面试模拟、智能对话或通过 AI 深度优化你的工作流。
          </p>
        </div>
      </div>

      {/* Tools Grid */}
      <section className="relative z-10">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">核心工具</h2>
            <span className="bg-gray-100 text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Beta</span>
          </div>
          <span className="text-sm text-gray-400 font-bold tracking-wider uppercase">Active Modules: 4</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <div 
              key={tool.id}
              onClick={() => tool.path !== '#' && navigate(tool.path)}
              className={`
                group p-8 rounded-[2rem] border border-gray-100 bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer
                ${tool.path === '#' ? 'opacity-60 cursor-not-allowed' : ''}
              `}
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`w-16 h-16 ${tool.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  {tool.icon}
                </div>
                {tool.path === '#' ? (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border border-gray-100 px-2 py-1 rounded-md">即将上线</span>
                ) : (
                  <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                    <ArrowRight size={20} />
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {tool.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {tool.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

