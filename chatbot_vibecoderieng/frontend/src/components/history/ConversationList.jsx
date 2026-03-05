import { MessageSquare, RefreshCw } from 'lucide-react';

function relativeTime(ts) {
    if (!ts) return '';
    try {
        const diff = Date.now() - new Date(ts).getTime();
        const m = Math.floor(diff / 60000);
        if (m < 1) return 'vừa xong';
        if (m < 60) return `${m} phút trước`;
        const h = Math.floor(m / 60);
        if (h < 24) return `${h} giờ trước`;
        const d = Math.floor(h / 24);
        return `${d} ngày trước`;
    } catch { return ''; }
}

function stageBadge(stage) {
    const MAP = {
        BASIC: { label: 'Cơ bản', color: 'bg-gray-100 text-gray-600' },
        PRICING: { label: 'Học phí', color: 'bg-blue-100 text-blue-600' },
        COMPLEX: { label: 'Tư vấn', color: 'bg-purple-100 text-purple-600' },
        REGISTERED: { label: 'Đã ĐK', color: 'bg-green-100 text-green-700' },
    };
    const m = MAP[stage] || { label: stage, color: 'bg-gray-100 text-gray-500' };
    return (
        <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${m.color}`}>
            {m.label}
        </span>
    );
}

export default function ConversationList({ sessions, selected, onSelect, loading, onLoadMore, hasMore }) {
    if (loading && sessions.length === 0) {
        return (
            <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
                <RefreshCw size={16} className="animate-spin" />
                <span className="text-sm">Đang tải...</span>
            </div>
        );
    }

    if (sessions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
                <MessageSquare size={32} className="text-gray-200" />
                <p className="text-sm">Không có hội thoại nào</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                {sessions.map(s => {
                    const isActive = selected?.id === s.id;
                    return (
                        <button
                            key={s.id}
                            onClick={() => onSelect(s)}
                            className={`w-full text-left px-4 py-3.5 transition-colors ${isActive
                                ? 'bg-indigo-50 border-l-2 border-indigo-500'
                                : 'hover:bg-gray-50 border-l-2 border-transparent'
                                }`}
                        >
                            <div className="flex items-start justify-between gap-2 mb-1">
                                <p className={`text-sm font-medium truncate ${isActive ? 'text-indigo-700' : 'text-gray-800'}`}>
                                    {s.title || s.id}
                                </p>
                                {stageBadge(s.current_stage)}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-xs text-gray-400">{relativeTime(s.updated_at)}</p>
                                {s.page_name && (
                                    <span className="text-xs text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">
                                        {s.page_name}
                                    </span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
            {hasMore && (
                <div className="p-3 border-t border-gray-100 shrink-0">
                    <button
                        onClick={onLoadMore}
                        disabled={loading}
                        className="w-full py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? <RefreshCw size={14} className="animate-spin" /> : null}
                        Tải thêm
                    </button>
                </div>
            )}
        </div>
    );
}
