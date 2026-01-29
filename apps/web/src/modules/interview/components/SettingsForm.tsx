import React, { useState, useMemo } from 'react';
import type { InterviewConfig } from '../types';
import { JOB_CATEGORIES } from '../constants/jobs';
import { Briefcase, Building2, GraduationCap, Target, MessageSquarePlus, ChevronRight } from 'lucide-react';

interface SettingsFormProps {
  onStart: (config: InterviewConfig) => void;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ onStart }) => {
  const [category, setCategory] = useState(JOB_CATEGORIES[1].label); // 默认 前端/移动
  const [config, setConfig] = useState<InterviewConfig>({
    jobTitle: JOB_CATEGORIES[1].options[0],
    company: '',
    experienceLevel: '中级 (3-5年)',
    interviewType: 'technical',
    customDescription: ''
  });

  const selectedCategory = useMemo(() => 
    JOB_CATEGORIES.find(c => c.label === category), 
  [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(config);
  };

  return (
    <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-sm">
        <div className="mb-10">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Target className="text-blue-600" size={18} />
            </div>
            定制面试场景
          </h2>
          <p className="text-slate-400 text-sm mt-2 font-medium">请填写您的面试目标，小智将为您生成最匹配的题目</p>
        </div>

        <div className="space-y-8">
          {/* 1. 职位选择 - 二级联动 */}
          <section className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
              <Briefcase size={12} /> 应聘职位 (二级分类)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={category}
                onChange={e => {
                  const newCat = e.target.value;
                  setCategory(newCat);
                  const firstJob = JOB_CATEGORIES.find(c => c.label === newCat)?.options[0] || '';
                  setConfig({ ...config, jobTitle: firstJob });
                }}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 appearance-none cursor-pointer"
              >
                {JOB_CATEGORIES.map(c => (
                  <option key={c.label} value={c.label}>{c.label}</option>
                ))}
              </select>
              <select
                value={config.jobTitle}
                onChange={e => setConfig({ ...config, jobTitle: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 appearance-none cursor-pointer"
              >
                {selectedCategory?.options.map(job => (
                  <option key={job} value={job}>{job}</option>
                ))}
              </select>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 2. 目标公司 */}
            <section className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <Building2 size={12} /> 目标公司 (可选)
              </label>
              <input
                type="text"
                value={config.company}
                onChange={e => setConfig({ ...config, company: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                placeholder="例如：字节跳动"
              />
            </section>

            {/* 3. 经验水平 */}
            <section className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <GraduationCap size={12} /> 经验水平
              </label>
              <select
                value={config.experienceLevel}
                onChange={e => setConfig({ ...config, experienceLevel: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 appearance-none cursor-pointer"
              >
                <option>应届生/实习生</option>
                <option>初级 (1-2年)</option>
                <option>中级 (3-5年)</option>
                <option>高级 (5年以上)</option>
                <option>专家/架构师</option>
              </select>
            </section>
          </div>

          {/* 4. 其他需求 */}
          <section className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
              <MessageSquarePlus size={12} /> 补充信息 (Prompt 加强)
            </label>
            <textarea
              value={config.customDescription}
              onChange={e => setConfig({ ...config, customDescription: e.target.value })}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 h-32 placeholder:text-slate-300"
              placeholder="例如：希望重点考察分布式系统设计能力..."
            />
          </section>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-3 group"
            >
              初始化面试会话
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SettingsForm;

