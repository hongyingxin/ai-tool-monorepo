import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquareText, 
  UserRound, 
  Settings as SettingsIcon,
  Sparkles,
  ChevronRight
} from 'lucide-react';

const Layout: React.FC = () => {
  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: '功能概览' },
    { to: '/interview', icon: <UserRound size={20} />, label: 'AI 模拟面试' },
    { to: '/chat', icon: <MessageSquareText size={20} />, label: 'AI 智能助手' },
    { to: '/settings', icon: <SettingsIcon size={20} />, label: '设置' },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Sparkles className="text-white" size={24} fill="currentColor" />
          </div>
          <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            小智 AI
          </span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-50' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
              `}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        <div className="p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 text-white">
            <p className="text-xs font-medium text-gray-400 mb-1">当前版本</p>
            <p className="text-sm font-bold italic">v1.0.0 Pro</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header - Mobile & Desktop */}
        <header className="h-16 flex items-center justify-between px-6 bg-white/50 backdrop-blur-md border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-4">
             <div className="md:hidden w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles size={18} className="text-white" fill="currentColor" />
             </div>
             <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
               小智 AI 助手控制台
             </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 border border-white shadow-sm"></div>
          </div>
        </header>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <div className="max-w-[1200px] mx-auto h-full">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Mobile Nav - Bottom */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-100 flex items-center justify-around px-4 z-50">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex flex-col items-center gap-1 transition-colors
              ${isActive ? 'text-blue-600' : 'text-gray-400'}
            `}
          >
            {item.icon}
            <span className="text-[10px] font-bold">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Layout;

