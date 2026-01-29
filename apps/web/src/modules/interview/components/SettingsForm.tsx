import React, { useState } from 'react';
import type { InterviewConfig } from '../types';

interface SettingsFormProps {
  onStart: (config: InterviewConfig) => void;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ onStart }) => {
  const [config, setConfig] = useState<InterviewConfig>({
    jobTitle: '前端开发工程师',
    company: '互联网大厂',
    experienceLevel: '中级 (3-5年)',
    interviewType: 'technical',
    customDescription: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(config);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">配置你的面试</h2>
        <p className="text-gray-500 mt-2">定制化面试场景，让模拟更加贴近实战</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">应聘职位</label>
          <input
            type="text"
            required
            value={config.jobTitle}
            onChange={e => setConfig({ ...config, jobTitle: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="例如：高级产品经理"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">目标公司 (可选)</label>
          <input
            type="text"
            value={config.company}
            onChange={e => setConfig({ ...config, company: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="例如：阿里巴巴"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">经验水平</label>
          <select
            value={config.experienceLevel}
            onChange={e => setConfig({ ...config, experienceLevel: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
          >
            <option>应届生/实习生</option>
            <option>初级 (1-2年)</option>
            <option>中级 (3-5年)</option>
            <option>高级 (5年以上)</option>
            <option>专家/架构师</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">面试侧重</label>
          <select
            value={config.interviewType}
            onChange={e => setConfig({ ...config, interviewType: e.target.value as any })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
          >
            <option value="technical">技术面 (硬技能为主)</option>
            <option value="behavioral">行为面 (软技能与价值观)</option>
            <option value="general">综合面 (HR + 技术混编)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">其他需求或背景描述</label>
        <textarea
          value={config.customDescription}
          onChange={e => setConfig({ ...config, customDescription: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition h-32"
          placeholder="例如：希望重点考察 React 架构能力，或者模拟压力面试环境..."
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all transform hover:scale-[1.01]"
      >
        开启模拟面试
      </button>
    </form>
  );
};

export default SettingsForm;

