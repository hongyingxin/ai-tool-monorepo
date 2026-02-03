import React, { useState, useRef, useEffect } from 'react';
import type { Message, InterviewConfig, InterviewResponse } from '../types';
import { api } from '../api';

interface InterviewSessionProps {
  /** 面试配置信息 */
  config: InterviewConfig;
  /** 面试结束（用户主动点击）时的回调，返回完整的对话历史 */
  onFinish: (history: Message[]) => void;
}

/**
 * 面试会话核心组件
 * 负责实时对话、语音识别、消息发送以及与后端的 Chat 接口对接
 */
const InterviewSession: React.FC<InterviewSessionProps> = ({ config, onFinish }) => {
  // 对话记录列表
  const [messages, setMessages] = useState<Message[]>([]);
  // 当前输入框的文本
  const [inputText, setInputText] = useState('');
  // 接口请求中的加载状态
  const [loading, setLoading] = useState(true);
  // 是否正在录音
  const [isRecording, setIsRecording] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // 初始化语音识别 (Web Speech API)
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

  /**
   * 切换录音状态
   */
  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  /**
   * 解析后端返回的包含 JSON 的响应
   * 后端返回格式参考 InterviewResponse 接口
   */
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
      // 容错处理：如果非标准 JSON，按普通文本展示
      return {
        role: 'model',
        text: text,
        timestamp: Date.now()
      };
    }
  };

  // 组件加载时自动初始化面试，获取第一句开场白
  useEffect(() => {
    const initInterview = async () => {
      try {
        const { text } = await api.startInterview(config);
        const msg = parseResponse(text);
        setMessages([msg]);
      } catch (error) {
        console.error("Failed to start interview", error);
        setMessages([{ role: 'model', text: "系统繁忙，请稍后再试。", timestamp: Date.now(), isError: true }]);
      } finally {
        setLoading(false);
      }
    };
    initInterview();
  }, [config]);

  // 消息更新后自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  /**
   * 发送用户消息
   * @param textOverride 可选的覆盖文本（用于点击选择题选项时）
   */
  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || inputText;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { role: 'user', text: textToSend, timestamp: Date.now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setLoading(true);

    try {
      const { text } = await api.sendMessage(newMessages, textToSend, config);
      const modelMsg = parseResponse(text);
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error("Message error", error);
      setMessages(prev => [...prev, { role: 'model', text: "消息发送失败，请重试。", timestamp: Date.now(), isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* 顶部标题栏 */}
      <div className="bg-gray-50 border-b border-gray-100 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* 对话消息滚动区 */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50"
      >
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : (msg.isError ? 'bg-red-50 border border-red-100 text-red-600' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none')
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              
              {/* 选择题选项渲染（如果是最新的 AI 消息） */}
              {msg.type === 'choice' && msg.options && (
                <div className="mt-4 space-y-2">
                  {msg.options.map((option, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => !loading && handleSend(option)}
                      disabled={loading || idx !== messages.length - 1}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        loading || idx !== messages.length - 1
                          ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white border-blue-100 hover:border-blue-400 hover:bg-blue-50 text-gray-700'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              <span className={`text-[10px] mt-2 block opacity-60 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {/* 打字中占位符 */}
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

      {/* 底部输入框与语音工具栏 */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="relative flex items-center gap-2">
          {/* 录音按钮 */}
          <button
            onClick={toggleRecording}
            className={`p-3 rounded-full transition-all ${
              isRecording 
                ? 'bg-red-100 text-red-600 animate-pulse' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
            title={isRecording ? "点击停止录音" : "点击开始录音"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>

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
            placeholder={isRecording ? "正在听..." : "输入你的回答..."}
            className="flex-1 px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-xl outline-none resize-none transition-all"
          />
          {/* 发送按钮 */}
          <button
            onClick={() => handleSend()}
            disabled={loading || !inputText.trim()}
            className={`p-3 rounded-lg transition-colors ${
              loading || !inputText.trim() ? 'text-gray-400 bg-gray-100' : 'text-white bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
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
