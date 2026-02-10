import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Message, InterviewResponse } from '../types';
import { api } from '../api';
import { useInterviewStore } from '../store';
import { Mic, Send, LogOut, Loader2, Sparkles } from 'lucide-react';

/**
 * 面试会话核心页面组件 (原 InterviewSession)
 * 路由路径: /interview/session
 */
const InterviewSession: React.FC = () => {
  const navigate = useNavigate();
  const { config, messages, addMessage, setMessages } = useInterviewStore();
  
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!config) {
      navigate('/interview/setup');
    }
  }, [config, navigate]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'zh-CN';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setInputText(prev => prev + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const parseResponse = (text: string): Message => {
    try {
      const data: InterviewResponse = JSON.parse(text);
      return {
        role: 'model',
        text: data.content,
        type: data.type,
        options: data.options,
        timestamp: Date.now()
      };
    } catch (e) {
      return {
        role: 'model',
        text: text,
        timestamp: Date.now()
      };
    }
  };

  useEffect(() => {
    if (config && messages.length === 0) {
      const initInterview = async () => {
        try {
          setLoading(true);
          const { text } = await api.startInterview(config);
          const msg = parseResponse(text);
          setMessages([msg]);
        } catch (error) {
          console.error("Failed to start interview", error);
          addMessage({ role: 'model', text: "系统繁忙，请稍后再试。", timestamp: Date.now(), isError: true });
        } finally {
          setLoading(false);
        }
      };
      initInterview();
    }
  }, [config, messages.length, setMessages, addMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || inputText;
    if (!textToSend.trim() || loading || !config) return;

    const userMsg: Message = { role: 'user', text: textToSend, timestamp: Date.now() };
    const updatedMessages = [...messages, userMsg];
    
    setMessages(updatedMessages);
    setInputText('');
    setLoading(true);

    try {
      const { text } = await api.sendMessage(updatedMessages, textToSend, config);
      const modelMsg = parseResponse(text);
      addMessage(modelMsg);
    } catch (error) {
      console.error("Message error", error);
      addMessage({ role: 'model', text: "消息发送失败，请重试。", timestamp: Date.now(), isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    if (messages.length < 2) {
      if (!confirm('面试还没有正式开始，确定要结束吗？')) return;
    }
    navigate('/interview/result');
  };

  if (!config) return null;

  return (
    <div className="flex flex-col h-full md:h-[calc(100vh-160px)] max-w-4xl mx-auto bg-white md:rounded-[2.5rem] md:shadow-2xl md:shadow-slate-200/50 overflow-hidden md:border md:border-slate-100 animate-in fade-in zoom-in-95 duration-500 pb-20 md:pb-0">
      <div className="bg-slate-50/50 border-b border-slate-100 p-4 md:p-6 flex justify-between items-center backdrop-blur-md">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <Sparkles className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" />
          </div>
          <div>
            <h3 className="font-black text-slate-800 tracking-tight text-sm md:text-base">AI 智能面试官</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-green-500"></span>
              </span>
              <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 truncate max-w-[120px] md:max-w-none">
                Session Active • {config.jobTitle}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleFinish}
          className="flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 bg-white border border-slate-100 text-slate-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 rounded-xl text-xs md:text-sm font-bold transition-all active:scale-95"
        >
          <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" />
          <span className="hidden xs:inline">结束面试</span>
          <span className="xs:hidden">结束</span>
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 bg-white custom-scrollbar"
      >
        {messages.map((msg: Message, idx: number) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className="flex items-center gap-2 mb-1.5 md:mb-2 px-1">
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-300">
                {msg.role === 'user' ? '候选人' : '面试官'}
              </span>
            </div>
            <div className={`max-w-[90%] md:max-w-[85%] rounded-2xl md:rounded-[1.5rem] p-4 md:p-5 shadow-sm border ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white border-blue-500 rounded-tr-none' 
                : (msg.isError ? 'bg-red-50 border-red-100 text-red-600' : 'bg-slate-50 border-slate-100 text-slate-700 rounded-tl-none')
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed text-xs md:text-sm">{msg.text}</p>
              {msg.type === 'choice' && msg.options && (
                <div className="mt-4 md:mt-5 space-y-2">
                  {msg.options.map((option: string, optIdx: number) => (
                    <button
                      key={optIdx}
                      onClick={() => !loading && handleSend(option)}
                      disabled={loading || idx !== messages.length - 1}
                      className={`w-full text-left p-3 md:p-4 rounded-xl border transition-all font-bold text-xs md:text-sm ${
                        loading || idx !== messages.length - 1
                          ? 'bg-white/10 border-white/20 text-white/40 cursor-not-allowed'
                          : 'bg-white border-blue-100 hover:border-blue-400 hover:bg-blue-50 text-slate-700'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex flex-col items-start animate-pulse">
            <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2 px-1">面试官正在输入</div>
            <div className="bg-slate-50 border border-slate-100 p-3 md:p-4 rounded-xl md:rounded-2xl rounded-tl-none flex gap-1.5">
              <div className="w-1 md:w-1.5 h-1 md:h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
              <div className="w-1 md:w-1.5 h-1 md:h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-1 md:w-1.5 h-1 md:h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-.5s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 md:p-6 bg-slate-50/50 border-t border-slate-100">
        <div className="relative flex items-center gap-2 md:gap-3">
          <button
            onClick={toggleRecording}
            className={`p-3 md:p-4 rounded-xl md:rounded-2xl transition-all active:scale-90 shadow-lg ${
              isRecording 
                ? 'bg-red-500 text-white animate-pulse shadow-red-200' 
                : 'bg-white text-slate-400 hover:text-blue-600 border border-slate-100 shadow-slate-100'
            }`}
          >
            <Mic className="w-[18px] h-[18px] md:w-5 md:h-5" />
          </button>
          <div className="relative flex-1">
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
              placeholder={isRecording ? "正在倾听..." : "输入你的回答..."}
              className="w-full px-4 md:px-6 py-3 md:py-4 bg-white border border-slate-100 focus:border-blue-500 rounded-xl md:rounded-2xl outline-none resize-none transition-all shadow-sm text-xs md:text-sm font-normal placeholder:text-slate-300"
            />
          </div>
          <button
            onClick={() => handleSend()}
            disabled={loading || !inputText.trim()}
            className={`p-3 md:p-4 rounded-xl md:rounded-2xl transition-all active:scale-90 shadow-lg ${
              loading || !inputText.trim() 
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
            }`}
          >
            {loading ? <Loader2 className="w-[18px] h-[18px] md:w-5 md:h-5 animate-spin" /> : <Send className="w-[18px] h-[18px] md:w-5 md:h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;

