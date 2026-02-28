"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, RefreshCw, Send, Loader2 } from 'lucide-react';
import { marked } from 'marked';

// Configure marked to resolve synchronous parsing
marked.setOptions({
  breaks: true,
  gfm: true
});

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  content: string;
}

const DEFAULT_GREETING: ChatMessage = {
  id: 'greeting',
  sender: 'bot',
  content: 'Chào bạn! Mình là trợ lý AI của CES Global. Mình có thể giúp gì cho bạn hôm nay?'
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([DEFAULT_GREETING]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Clear history and add default greeting
    setMessages([DEFAULT_GREETING]);
    setInputValue('');
    setIsTyping(false);
    
    // Remove spinning effect after 500ms
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  const parseMessage = (text: string) => {
    // We can safely cast as string because we are not using async options
    return { __html: marked.parse(text) as string };
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputValue
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Gọi API kết nối với DeepSeek
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].filter(m => m.id !== 'greeting') // Loại bỏ câu chào mặc định để tối ưu token
        }),
      });

      const data = await response.json();
      setIsTyping(false);

      if (!response.ok) {
        throw new Error(data.error || 'Unknown error');
      }
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        content: data.content
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error: any) {
      console.error(error);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        content: `*(Lỗi)* Không thể gửi tin nhắn. Mất kết nối tới máy chủ AI hoặc API Key không hợp lệ. Vui lòng kiểm tra lại.`
      }]);
    }
  };

  return (
    <>
      {/* Nút Chat nổi (Floating Button) */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:bg-blue-500 hover:scale-105 transition-all duration-300 ${isOpen ? 'hidden' : 'block'}`}
      >
        <MessageSquare size={28} />
        {/* Glow behind the button */}
        <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-50 -z-10 animate-pulse"></div>
      </motion.button>

      {/* Cửa sổ Chat (Chat Window) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[550px] max-h-[80vh] flex flex-col bg-slate-900/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
          >
            {/* 2️⃣ Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
                    <MessageSquare size={20} className="text-white" />
                  </div>
                  {/* Trạng thái Online */}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold text-white text-base leading-tight">CES Assistant</h3>
                  <span className="text-xs text-green-400 font-medium">Online</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Nút Refresh */}
                <button 
                  onClick={handleRefresh}
                  className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Refresh chat"
                >
                  <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
                </button>
                {/* Nút Close */}
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Close chat"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Nội dung tin nhắn */}
            <div className="flex-1 overflow-y-auto p-5 pb-2 space-y-4 custom-scrollbar">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                      msg.sender === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-sm' 
                        : 'bg-slate-800/80 border border-white/5 text-slate-200 rounded-tl-sm shadow-md'
                    }`}
                  >
                    {msg.sender === 'user' ? (
                      <div className="text-sm leading-relaxed">{msg.content}</div>
                    ) : (
                      <div 
                        className="chat-markdown text-sm"
                        dangerouslySetInnerHTML={parseMessage(msg.content)}
                      />
                    )}
                  </div>
                </div>
              ))}
              
              {/* 6️⃣ Hiệu ứng Typing */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-800/80 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-sm flex flex-col items-start gap-1 shadow-md">
                    <span className="text-xs text-slate-400 mb-1">Đang nhập...</span>
                    <div className="flex items-center gap-1.5 h-4">
                      <motion.div 
                        animate={{ y: [0, -5, 0] }} 
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                        className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                      />
                      <motion.div 
                        animate={{ y: [0, -5, 0] }} 
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                        className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                      />
                      <motion.div 
                        animate={{ y: [0, -5, 0] }} 
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                        className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Vùng nhập liệu */}
            <div className="p-4 bg-slate-800/30 border-t border-white/5">
              <form 
                onSubmit={handleSendMessage}
                className="flex items-center gap-2 relative"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Hỏi CES Assistant..."
                  disabled={isTyping}
                  className="flex-1 bg-slate-900/50 border border-white/10 rounded-full py-3 pl-5 pr-14 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 placeholder:text-slate-500 transition-all disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-1 w-10 h-10 flex items-center justify-center bg-blue-600 rounded-full text-white disabled:bg-slate-700 disabled:text-slate-400 transition-colors hover:bg-blue-500"
                >
                  <Send size={16} className="ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5️⃣ CSS riêng cho .chat-markdown */}
      <style dangerouslySetInnerHTML={{__html: `
        .chat-markdown p {
          line-height: 1.6;
          margin-bottom: 0.5em;
        }
        .chat-markdown p:last-child {
          margin-bottom: 0;
        }
        .chat-markdown ul {
          list-style-type: disc;
          padding-left: 1.2em;
          margin-bottom: 0.5em;
        }
        .chat-markdown ol {
          list-style-type: decimal;
          padding-left: 1.2em;
          margin-bottom: 0.5em;
        }
        .chat-markdown li {
          margin-bottom: 0.25em;
        }
        .chat-markdown strong {
          color: #60a5fa; /* Accent blue-400 */
          font-weight: 700;
        }
        .chat-markdown code {
          background-color: #0f172a; /* slate-900 */
          color: #38bdf8; /* sky-400 */
          font-family: monospace;
          padding: 0.15em 0.3em;
          border-radius: 0.25em;
          font-size: 0.9em;
        }
        .chat-markdown blockquote {
          border-left: 3px solid #3b82f6; /* blue-500 */
          padding-left: 0.75em;
          marginLeft: 0;
          color: #94a3b8; /* slate-400 */
          font-style: italic;
          margin-bottom: 0.5em;
        }
        
        /* Custom scrollbar cho khung chat */
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.2);
        }
      `}} />
    </>
  );
}
