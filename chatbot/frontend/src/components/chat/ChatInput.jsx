import React, { useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, Square } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function ChatInput({ value, onChange, onSend, onStop, isLoading }) {
    const textareaRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    // Auto-resize
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [value]);

    return (
        <div className="relative group max-w-3xl mx-auto w-full">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-[2rem] blur-xl opacity-40 group-focus-within:opacity-70 transition-opacity duration-500" />

            <div className="relative flex items-end gap-2 bg-white border border-gray-200 rounded-[2rem] p-2 pr-2 shadow-sm transition-all focus-within:shadow-md focus-within:border-indigo-200 focus-within:ring-4 focus-within:ring-indigo-50/50">

                {/* Attach */}
                <button className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors shrink-0 mb-0.5">
                    <Paperclip size={20} />
                </button>

                {/* Text Area */}
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Hỏi bất cứ điều gì..."
                    rows={1}
                    disabled={isLoading}
                    className="flex-1 bg-transparent border-none focus:outline-none resize-none py-3.5 max-h-40 text-gray-800 placeholder:text-gray-400 text-sm leading-relaxed"
                    style={{ minHeight: '48px' }}
                />

                {/* Actions */}
                <div className="flex items-center gap-1 mb-1">
                    {!value && (
                        <button className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                            <Mic size={20} />
                        </button>
                    )}

                    {isLoading ? (
                        <button
                            onClick={onStop}
                            className="p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md shadow-red-200 transition-all active:scale-95 flex items-center justify-center w-10 h-10"
                            title="Dừng phản hồi"
                        >
                            <Square size={16} fill="currentColor" />
                        </button>
                    ) : (
                        <button
                            onClick={() => onSend()}
                            disabled={!value.trim()}
                            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-md shadow-indigo-200 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95 flex items-center justify-center w-10 h-10"
                        >
                            <Send size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
