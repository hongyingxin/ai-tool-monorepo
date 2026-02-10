import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquareText, 
  UserRound, 
  Settings as SettingsIcon,
  Sparkles,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: '工作台' },
    { to: '/interview', icon: <UserRound size={20} />, label: '模拟面试' },
    { to: '/chat', icon: <MessageSquareText size={20} />, label: '智能助手' },
    { to: '/settings', icon: <SettingsIcon size={20} />, label: '系统设置' },
  ];

  // 简单的路由标题映射
  const getPageTitle = () => {
    // 优先匹配精确路由
    const item = navItems.find(item => item.to === location.pathname);
    if (item) return item.label;

    // 处理嵌套路由标题
    if (location.pathname.startsWith('/interview/history/')) return '面试详情';
    if (location.pathname === '/interview/history') return '面试历史';
    if (location.pathname === '/interview/setup') return '定制面试场景';
    if (location.pathname === '/interview/session') return '面试进行中';
    if (location.pathname === '/interview/result') return '评估报告';
    if (location.pathname.startsWith('/interview')) return '模拟面试';
    
    return '返回';
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 font-sans overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-100">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
            <Sparkles className="text-white" size={24} fill="currentColor" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-800">
            小智 AI
          </span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-50/50' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-bold text-sm">{item.label}</span>
              </div>
              <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${location.pathname === item.to ? 'hidden' : ''}`} />
            </NavLink>
          ))}
        </nav>

        <div className="p-6">
          <div className="bg-slate-50 rounded-[1.5rem] p-4 border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Version</p>
            <p className="text-xs font-bold text-slate-600">v1.0.0 Personal</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-4">
             {!isHome && (
               <button 
                 onClick={() => navigate(-1)}
                 className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-xl transition-all active:scale-95 border border-slate-100 group"
               >
                 <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
               </button>
             )}
             <div>
               <h2 className="text-lg font-black text-slate-800 tracking-tight">
                 {getPageTitle()}
               </h2>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right mr-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase">System Status</p>
              <p className="text-xs font-bold text-green-500 flex items-center justify-end gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                已连接
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
              <UserRound size={20} />
            </div>
          </div>
        </header>

        {/* Unified Scrollable Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
          <div className={`${location.pathname === '/chat' ? 'max-w-none h-full' : 'max-w-5xl mx-auto px-8 py-10 min-h-full'}`}>
            <Outlet />
          </div>
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-100 flex items-center justify-around px-6 z-50 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex flex-col items-center gap-1.5 transition-all
              ${isActive ? 'text-blue-600 scale-110' : 'text-slate-400'}
            `}
          >
            {item.icon}
            <span className="text-[10px] font-black">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Layout;


