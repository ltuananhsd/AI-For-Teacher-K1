import { useState, useEffect } from 'react';
import { RefreshCw, Bot, User } from 'lucide-react';

function MessageRow({ msg }) {
    const isBot = msg.role === 'bot';
    return (
        <div className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${isBot ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'
                }`}>
                {isBot ? <Bot size={14} /> : <User size={14} />}
            </div>
            <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${isBot
                    ? 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm'
                    : 'bg-indigo-600 text-white rounded-tr-sm'
                }`}>
                {msg.content}
            </div>
        </div>
    );
}

export default function ConversationDetail({ session }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!session) return;
        setLoading(true);
        setMessages([]);
        fetch(`/api/v1/history/${session.id}`)
            .then(r => r.json())
            .then(d => setMessages(d.messages || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [session?.id]);

    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                    <Bot size={22} className="text-gray-300" />
                </div>
                <p className="text-sm">Chọn một hội thoại để xem chi tiết</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-5 py-3 border-b border-gray-100 bg-white shrink-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{session.title || session.id}</p>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${session.source === 'facebook' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                        {session.source === 'facebook' ? 'Facebook' : 'Test Bot'}
                    </span>
                    {session.page_name && (
                        <span className="text-xs text-gray-400">{session.page_name}</span>
                    )}
                    <span className="text-xs text-gray-400">
                        {messages.length} tin nhắn
                    </span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loading ? (
                    <div className="flex items-center justify-center py-12 gap-2 text-gray-400">
                        <RefreshCw size={16} className="animate-spin" />
                        <span className="text-sm">Đang tải tin nhắn...</span>
                    </div>
                ) : messages.length === 0 ? (
                    <p className="text-center text-sm text-gray-400 py-12">Không có tin nhắn</p>
                ) : (
                    messages.map(msg => <MessageRow key={msg.id} msg={msg} />)
                )}
            </div>
        </div>
    );
}
