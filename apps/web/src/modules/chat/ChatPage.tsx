import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ChevronDown, Check, Send, User, Bot, Copy, Plus, History, Trash2, MessageCircle, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { chatApi } from './api';
import type { AIModel, ChatMessage } from './api';
import { chatDB } from './db';
import type { ChatSession } from './db';

/**
 * 智能助手主页面组件
 * 包含侧边栏会话管理、模型切换、对话内容展示及输入交互
 */
const ChatPage: React.FC = () => {
  const [models, setModels] = useState<AIModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /**
   * 初始化：获取模型列表及历史会话
   */
  useEffect(() => {
    const init = async () => {
      try {
        const modelData = await chatApi.getModels();
        setModels(modelData);
        if (modelData.length > 0) {
          // 默认选中 Gemini 2.0 模型或第一个可用模型
          const preferredModel = modelData.find(m => m.id.includes('2.0')) || modelData[0];
          setSelectedModel(preferredModel);
        }

        const sessionData = await chatDB.getAllSessions();
        setSessions(sessionData);
      } catch (error) {
        console.error('Initialization failed:', error);
      }
    };
    init();
  }, []);

  /**
   * 自动滚动到底部
   */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  /**
   * 输入框高度自适应
   */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputText]);

  /**
   * 开启一个全新的对话会话
   */
  const createNewSession = () => {
    setCurrentSessionId(null);
    setMessages([]);
    setInputText('');
  };

  /**
   * 选择并加载历史会话
   * @param id 会话 ID
   */
  const selectSession = async (id: string) => {
    const session = await chatDB.getSessionById(id);
    if (session) {
      setCurrentSessionId(session.id);
      setMessages(session.messages);
      const model = models.find(m => m.id === session.modelId);
      if (model) setSelectedModel(model);
    }
  };

  /**
   * 删除指定的会话
   */
  const deleteSession = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await chatDB.deleteSession(id);
    const updatedSessions = await chatDB.getAllSessions();
    setSessions(updatedSessions);
    if (currentSessionId === id) {
      createNewSession();
    }
  };

  /**
   * 将当前对话状态保存到数据库
   * @param updatedMessages 更新后的消息列表
   */
  const saveCurrentSession = async (updatedMessages: ChatMessage[]) => {
    if (!selectedModel) return;

    let sessionId = currentSessionId;
    let title = '';

    if (!sessionId) {
      // 首次保存，生成新 ID 并提取标题
      sessionId = crypto.randomUUID();
      setCurrentSessionId(sessionId);
      const firstMsg = updatedMessages.find(m => m.role === 'user')?.content || '新对话';
      title = firstMsg.length > 20 ? firstMsg.substring(0, 20) + '...' : firstMsg;
    } else {
      const existing = sessions.find(s => s.id === sessionId);
      title = existing?.title || '新对话';
    }

    const session: ChatSession = {
      id: sessionId,
      title,
      messages: updatedMessages,
      modelId: selectedModel.id,
      createdAt: sessions.find(s => s.id === sessionId)?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    await chatDB.saveSession(session);
    const allSessions = await chatDB.getAllSessions();
    setSessions(allSessions);
  };

  /**
   * 发送消息并处理流式响应
   * @param overrideText 可选的覆盖文本（用于重新生成）
   */
  const handleSend = async (overrideText?: string) => {
    const text = overrideText || inputText;
    if (!text.trim() || isLoading || !selectedModel) return;

    const userMessage: ChatMessage = { role: 'user', content: text.trim() };
    const historyWithUser = [...messages, userMessage];
    
    setMessages(historyWithUser);
    setInputText('');
    setIsLoading(true);

    // 添加 AI 响应占位符
    const modelMessage: ChatMessage = { role: 'model', content: '' };
    const historyWithPlaceholder = [...historyWithUser, modelMessage];
    setMessages(historyWithPlaceholder);

    abortControllerRef.current = new AbortController();

    try {
      let fullContent = '';
      await chatApi.chatStream(
        selectedModel.id,
        historyWithUser,
        (chunk) => {
          fullContent += chunk;
          setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage.role === 'model') {
              const updatedModelMsg = { ...lastMessage, content: fullContent, isError: false };
              return [...prev.slice(0, -1), updatedModelMsg];
            }
            return prev;
          });
        },
        async (error) => {
          console.error('Streaming error callback:', error);
          const errorMsg = '⚠️ 请求失败: ' + error.message;
          setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            const updatedHistory = [
              ...prev.slice(0, -1),
              { ...lastMessage, content: errorMsg, isError: true }
            ];
            saveCurrentSession(updatedHistory);
            return updatedHistory;
          });
          setIsLoading(false);
        },
        abortControllerRef.current.signal
      );
      
      // 流式结束后保存完整会话
      setMessages(prev => {
        saveCurrentSession(prev);
        return prev;
      });

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Chat generation aborted');
      } else {
        console.error('Chat error catch:', error);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  /**
   * 中断正在生成的 AI 响应
   */
  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  };

  /**
   * 重新生成上一次的 AI 回复
   */
  const handleRegenerate = () => {
    if (messages.length < 1 || isLoading) return;
    
    let lastUserIdx = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        lastUserIdx = i;
        break;
      }
    }

    if (lastUserIdx === -1) return;
    
    const lastUserMessage = messages[lastUserIdx];
    const previousHistory = messages.slice(0, lastUserIdx);
    
    setMessages(previousHistory);
    handleSend(lastUserMessage.content);
  };

  /**
   * 复制文本到剪贴板
   */
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="h-full flex bg-white overflow-hidden animate-in fade-in duration-500 relative">
      {/* Sidebar */}
      <div 
        className={`border-r border-gray-100 bg-gray-50/30 shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${
          isSidebarOpen ? 'w-80' : 'w-0 border-r-0'
        }`}
      >
        <div className="w-80 h-full flex flex-col">
          <div className="p-6 flex items-center gap-3">
            <button 
              onClick={createNewSession}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-white border border-blue-100 rounded-2xl font-bold text-blue-700 hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm active:scale-95"
            >
              <Plus size={18} />
              开启新对话
            </button>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all shrink-0"
              title="收起侧边栏"
            >
              <PanelLeftClose size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-4 space-y-1.5 custom-scrollbar pb-6">
            <div className="px-3 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              历史会话
            </div>
            {sessions.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <History size={20} className="text-gray-300" />
                </div>
                <p className="text-xs text-gray-400 font-medium">暂无对话记录</p>
              </div>
            ) : (
              sessions.map(session => (
                <div 
                  key={session.id}
                  onClick={() => selectSession(session.id)}
                  className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-all ${
                    currentSessionId === session.id 
                      ? 'bg-blue-50/50 text-blue-700 border-l-4 border-l-blue-500' 
                      : 'text-gray-500 hover:bg-gray-100/50 hover:text-gray-700'
                  }`}
                >
                  <MessageCircle size={18} className={currentSessionId === session.id ? 'text-blue-500' : 'text-gray-400'} />
                  <span className={`flex-1 text-sm font-semibold truncate pr-6 ${currentSessionId === session.id ? '' : 'font-medium'}`}>
                    {session.title}
                  </span>
                  <button 
                    onClick={(e) => deleteSession(e, session.id)}
                    className="absolute right-2 opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Chat Header (Inner) */}
        <div className="h-16 px-8 border-b border-gray-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all mr-2"
                title="显示侧边栏"
              >
                <PanelLeftOpen size={22} />
              </button>
            )}
            <div className="flex items-center gap-1.5 relative">
              <button 
                onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded-xl transition-colors group"
              >
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-bold text-gray-600 group-hover:text-blue-600 transition-colors uppercase tracking-wider">
                  {selectedModel?.displayName || '正在获取模型...'}
                </span>
                <ChevronDown size={14} className={`text-gray-400 group-hover:text-blue-600 transition-transform ${isModelMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Model Dropdown */}
              {isModelMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsModelMenuOpen(false)}></div>
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-100 shadow-2xl rounded-2xl z-50 py-2 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">
                      选择 AI 模型
                    </div>
                    <div className="max-h-[28rem] overflow-y-auto custom-scrollbar">
                      {models.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => {
                            setSelectedModel(model);
                            setIsModelMenuOpen(false);
                          }}
                          className="w-full px-4 py-3.5 flex items-start gap-3 hover:bg-blue-50 transition-colors group text-left"
                        >
                          <div className={`mt-0.5 rounded-full p-1 ${selectedModel?.id === model.id ? 'bg-blue-100 text-blue-600' : 'text-transparent group-hover:text-gray-200'}`}>
                            <Check size={12} />
                          </div>
                          <div>
                            <div className={`text-sm font-bold ${selectedModel?.id === model.id ? 'text-blue-700' : 'text-gray-700'}`}>
                              {model.displayName}
                            </div>
                            {model.description && (
                              <div className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed mt-1">
                                {model.description}
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">Powered by Gemini 2.0</div>
          </div>
        </div>

        {/* Chat Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto custom-scrollbar bg-white"
        >
          <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
            {messages.length === 0 ? (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="w-24 h-24 bg-blue-50 rounded-[2.5rem] flex items-center justify-center text-blue-500 shadow-inner">
                  <Sparkles size={48} />
                </div>
                <div className="max-w-xl">
                  <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">有什么我可以帮您的吗？</h2>
                  <p className="text-gray-400 font-medium mb-10 text-lg">
                    作为您的 AI 助手，我可以帮您写代码、分析数据或解答任何问题。
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: "💪", text: "制定一周健身计划" },
                      { icon: "🐍", text: "Python 爬虫脚本示例" },
                      { icon: "📚", text: "深度学习进阶书籍推荐" },
                      { icon: "⚛️", text: "React 响应式组件开发" }
                    ].map((hint, i) => (
                      <button 
                        key={i}
                        onClick={() => setInputText(hint.text)}
                        className="p-5 bg-white border border-gray-100 rounded-2xl text-sm text-gray-600 hover:border-blue-200 hover:bg-blue-50/30 transition-all text-left font-bold shadow-sm group"
                      >
                        <span className="text-xl mb-2 block group-hover:scale-110 transition-transform">{hint.icon}</span>
                        {hint.text}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                  {msg.role === 'model' && (
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 text-blue-600 shadow-sm">
                      <Bot size={22} />
                    </div>
                  )}
                  
                  <div className={`flex flex-col space-y-3 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-6 py-4 rounded-[2rem] text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : msg.isError
                          ? 'bg-red-50 border border-red-100 text-red-600 rounded-tl-none'
                          : 'bg-gray-50 border border-gray-100 text-gray-800 rounded-tl-none'
                    }`}>
                      <div className="whitespace-pre-wrap font-medium">{msg.content || (isLoading && idx === messages.length - 1 ? (
                        <div className="flex gap-1.5 py-2">
                          <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                          <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                        </div>
                      ) : null)}</div>
                    </div>
                    
                    <div className="flex items-center gap-3 px-2">
                      {msg.role === 'model' && msg.content && (
                        <>
                          <button 
                            onClick={() => copyToClipboard(msg.content)}
                            className="p-2 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                            title="复制内容"
                          >
                            <Copy size={16} />
                          </button>
                          {idx === messages.length - 1 && !isLoading && (
                            <button 
                              onClick={handleRegenerate}
                              className="p-2 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                              title="重新生成"
                            >
                              <Sparkles size={16} />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 text-white shadow-md">
                      <User size={22} />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Input Area */}
        <div className="p-8 bg-white border-t border-gray-50">
          <div className="max-w-5xl mx-auto relative group">
            <div className="absolute inset-0 bg-blue-500/5 blur-xl group-focus-within:bg-blue-500/10 transition-all rounded-[2rem]"></div>
            <div className="relative flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-[2rem] p-3 focus-within:border-blue-500 focus-within:bg-white transition-all shadow-sm">
              <textarea 
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={`向 ${selectedModel?.displayName || 'AI'} 提问...`}
                rows={1}
                className="flex-1 pl-5 pr-2 py-3 bg-transparent outline-none resize-none custom-scrollbar min-h-[48px] max-h-60 text-base text-gray-700 placeholder:text-gray-400 font-medium"
              />
              <div className="pb-1 pr-1">
                {isLoading ? (
                  <button 
                    onClick={handleStop}
                    className="w-11 h-11 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-all flex items-center justify-center shadow-sm"
                  >
                    <div className="w-3 h-3 bg-red-600 rounded-sm animate-pulse"></div>
                  </button>
                ) : (
                  <button 
                    onClick={() => handleSend()}
                    disabled={!inputText.trim()}
                    className={`w-11 h-11 rounded-2xl transition-all flex items-center justify-center ${
                      !inputText.trim()
                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100 active:scale-95'
                    }`}
                  >
                    <Send size={20} />
                  </button>
                )}
              </div>
            </div>
            <p className="text-center mt-4 text-[10px] text-gray-300 font-bold uppercase tracking-widest">
              AI 可能会产生错误，请核实重要信息
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

