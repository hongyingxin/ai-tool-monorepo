import React, { useState, useRef, useEffect } from 'react';
import type { Message, InterviewConfig } from '../types';
import { api } from '../api';

interface InterviewSessionProps {
  config: InterviewConfig;
  onFinish: (history: Message[]) => void;
}

const InterviewSession: React.FC<InterviewSessionProps> = ({ config, onFinish }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  // const initialized = useRef(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // if (initialized.current) return;
    // initialized.current = true;

    const initInterview = async () => {
      try {
        const { text } = await api.startInterview(config);
        setMessages([{ role: 'model', text, timestamp: Date.now() }]);
      } catch (error) {
        console.error("Failed to start interview", error);
        setMessages([{ role: 'model', text: "系统繁忙，请稍后再试。", timestamp: Date.now() }]);
      } finally {
        setLoading(false);
      }
    };
    initInterview();
  }, [config]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || loading) return;

    const userMsg: Message = { role: 'user', text: inputText, timestamp: Date.now() };
    const currentMessages = [...messages, userMsg];
    setMessages(currentMessages);
    setInputText('');
    setLoading(true);

    try {
      const { text } = await api.sendMessage(currentMessages, inputText, config);
      const modelMsg: Message = { role: 'model', text, timestamp: Date.now() };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error("Message error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-100 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">智能面试官</h3>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> 正在面试中
            </p>
          </div>
        </div>
        <button
          onClick={() => onFinish(messages)}
          className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-semibold transition"
        >
          结束面试
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50"
      >
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              <span className={`text-[10px] mt-2 block opacity-60 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-2">
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-.5s]"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="relative flex items-center">
          <textarea
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="输入你的回答..."
            className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-xl outline-none resize-none pr-12 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={loading || !inputText.trim()}
            className={`absolute right-2 p-2 rounded-lg transition-colors ${
              loading || !inputText.trim() ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-50'
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 text-center">
          按 Enter 发送，Shift + Enter 换行
        </p>
      </div>
    </div>
  );
};

export default InterviewSession;

